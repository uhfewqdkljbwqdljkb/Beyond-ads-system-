import { supabase, handleError } from './api.js';

export const leadGroupService = {
  async getGroups(userId) {
    try {
      const { data, error } = await supabase
        .from('lead_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mock getting counts (in production use a view or subquery)
      const groupsWithCounts = await Promise.all(data.map(async (group) => {
        const { count } = await supabase
          .from('lead_group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);
        return { ...group, lead_count: count || 0 };
      }));

      return groupsWithCounts;
    } catch (error) {
      handleError(error);
    }
  },

  async createGroup(groupData) {
    try {
      const { data, error } = await supabase
        .from('lead_groups')
        .insert([groupData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async deleteGroup(groupId) {
    try {
      const { error } = await supabase.from('lead_groups').delete().eq('id', groupId);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
    }
  },

  async updateGroup(groupId, updates) {
    try {
      const { data, error } = await supabase
        .from('lead_groups')
        .update(updates)
        .eq('id', groupId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async addLeadsToGroup(groupId, leadIds, userId) {
    try {
      const inserts = leadIds.map(leadId => ({
        group_id: groupId,
        lead_id: leadId,
        added_by: userId
      }));
      const { error } = await supabase.from('lead_group_members').insert(inserts);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
    }
  },

  async removeLeadFromGroup(groupId, leadId) {
    try {
      const { error } = await supabase
        .from('lead_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('lead_id', leadId);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
    }
  }
};