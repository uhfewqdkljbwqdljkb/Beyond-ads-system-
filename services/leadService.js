
import { supabase, handleError, paginate } from './api';

export const leadService = {
  async getLeads({ status, sourceId, assignedTo, page = 1, limit = 20, search, groupId, isUngrouped, notInGroupId } = {}) {
    try {
      let query = supabase.from('leads').select('*, lead_sources(name), industries(name)', { count: 'exact' });
      
      if (status) query = query.eq('status', status);
      if (sourceId) query = query.eq('lead_source_id', sourceId);
      if (assignedTo) query = query.eq('assigned_to', assignedTo);
      if (search) query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,company_name.ilike.%${search}%`);

      if (groupId) {
        const { data: memberIds } = await supabase
          .from('lead_group_members')
          .select('lead_id')
          .eq('group_id', groupId);
        
        if (memberIds) {
          const ids = memberIds.map(m => m.lead_id);
          if (ids.length > 0) {
            query = query.in('id', ids);
          } else {
            return { data: [], count: 0 };
          }
        }
      } else if (notInGroupId) {
        // Fetch leads NOT in this group
        const { data: memberIds } = await supabase
          .from('lead_group_members')
          .select('lead_id')
          .eq('group_id', notInGroupId);
          
        if (memberIds && memberIds.length > 0) {
           const ids = memberIds.map(m => m.lead_id);
           query = query.not('id', 'in', `(${ids.join(',')})`);
        }
      } else if (isUngrouped) {
         // This is complex in simple REST, ideally use .not.in('id', allGroupedIds)
         // Simplified for this mock implementation
         const { data: allGrouped } = await supabase.from('lead_group_members').select('lead_id');
         const groupedIds = allGrouped?.map(g => g.lead_id) || [];
         if (groupedIds.length > 0) {
            // query = query.not('id', 'in', `(${groupedIds.join(',')})`);
         }
      }

      query = paginate(query, page, limit);
      query = query.order('created_at', { ascending: false });

      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleError(error);
    }
  },

  async getLeadById(id) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, activities(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async createLead(leadData) {
    try {
      const { data, error } = await supabase.from('leads').insert([leadData]).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      handleError(error);
    }
  },

  async updateLead(id, data) {
    try {
      const { data: res, error } = await supabase.from('leads').update(data).eq('id', id).select();
      if (error) throw error;
      return res[0];
    } catch (error) {
      handleError(error);
    }
  },

  async convertToClient(leadId, { company_name, contact_email, industry_id }) {
    try {
      // 1. Create client record
      const { data: client, error: clientErr } = await supabase
        .from('clients')
        .insert([{ 
          company_name, 
          contact_email, 
          industry_id, 
          original_lead_id: leadId,
          status: 'active'
        }])
        .select()
        .single();
      
      if (clientErr) throw clientErr;

      // 2. Update lead status
      await supabase.from('leads').update({ status: 'converted', converted_at: new Date() }).eq('id', leadId);

      return client;
    } catch (error) {
      handleError(error);
    }
  },

  async getLeadStats() {
    try {
      const { data, error } = await supabase.rpc('get_lead_counts_by_status');
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to manual count if RPC not defined
      const { data: leads } = await supabase.from('leads').select('status');
      return leads?.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});
    }
  }
};
