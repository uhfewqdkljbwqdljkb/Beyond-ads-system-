import { supabase, handleError, paginate } from './api.js';

export const commissionService = {
  async getCommissions({ salespersonId, status, page = 1, limit = 20 } = {}) {
    try {
      let query = supabase.from('commissions').select('*, deals(name), users!salesperson_id(first_name, last_name)', { count: 'exact' });
      
      if (salespersonId) query = query.eq('salesperson_id', salespersonId);
      if (status) query = query.eq('status', status);

      query = paginate(query, page, limit);
      query = query.order('earned_date', { ascending: false });

      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleError(error);
    }
  },

  async approveCommission(id, approvedBy) {
    try {
      const { data, error } = await supabase
        .from('commissions')
        .update({ 
          status: 'approved', 
          approved_at: new Date(), 
          approved_by: approvedBy 
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      handleError(error);
    }
  },

  async getCommissionStats(salespersonId) {
    try {
      const { data, error } = await supabase
        .from('commissions')
        .select('status, commission_amount')
        .eq('salesperson_id', salespersonId);
      
      if (error) throw error;

      return data.reduce((acc, comm) => {
        acc[comm.status] = (acc[comm.status] || 0) + Number(comm.commission_amount);
        acc.total = (acc.total || 0) + Number(comm.commission_amount);
        return acc;
      }, { pending: 0, approved: 0, paid: 0, total: 0 });
    } catch (error) {
      handleError(error);
    }
  }
};