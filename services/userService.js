
import { supabase, handleError, paginate } from './api';

/**
 * Service for managing users and sales team hierarchies
 */
export const userService = {
  /**
   * Get users with optional filters (role, status, team)
   */
  async getUsers({ role, status, teamLeadId, page = 1, limit = 20 } = {}) {
    try {
      let query = supabase.from('users').select('*', { count: 'exact' });
      
      if (role) query = query.eq('role', role);
      if (status) query = query.eq('status', status);
      
      if (teamLeadId) {
        const { data: assignments } = await supabase
          .from('team_assignments')
          .select('sales_rep_id')
          .eq('team_lead_id', teamLeadId)
          .eq('status', 'active');
        
        const ids = assignments?.map(a => a.sales_rep_id) || [];
        query = query.in('id', ids);
      }

      query = paginate(query, page, limit);
      query = query.order('last_name', { ascending: true });

      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleError(error);
    }
  },

  async getUserById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*, commission_structures(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async createUser(userData) {
    try {
      const { data, error } = await supabase.from('users').insert([userData]).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      handleError(error);
    }
  },

  async updateUser(id, userData) {
    try {
      const { data, error } = await supabase.from('users').update(userData).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      handleError(error);
    }
  },

  async deleteUser(id) {
    try {
      const { error } = await supabase.from('users').update({ status: 'inactive' }).eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
    }
  },

  async assignToTeamLead(repId, teamLeadId) {
    try {
      const { data, error } = await supabase.from('team_assignments').insert([{
        sales_rep_id: repId,
        team_lead_id: teamLeadId,
        status: 'active'
      }]).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      handleError(error);
    }
  }
};
