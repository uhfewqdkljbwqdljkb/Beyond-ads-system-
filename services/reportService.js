import { supabase, handleError } from './api.js';

export const reportService = {
  async getDashboardStats() {
    try {
      // Simplified aggregate fetch
      const { data: revData } = await supabase.from('invoices').select('total_amount').eq('status', 'paid');
      const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).neq('status', 'lost');
      const { count: wonDeals } = await supabase.from('deals').select('*', { count: 'exact', head: true }).eq('status', 'won');
      
      const totalRev = revData?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;

      return {
        totalRevenue: totalRev,
        activeLeads: leadsCount || 0,
        dealsClosed: wonDeals || 0,
        conversionRate: leadsCount ? ((wonDeals / leadsCount) * 100).toFixed(1) : 0
      };
    } catch (error) {
      handleError(error);
    }
  },

  async getRevenueByService() {
    try {
      const { data, error } = await supabase
        .from('invoice_line_items')
        .select('total_price, services(name)');
      
      if (error) throw error;

      return data.reduce((acc, item) => {
        const name = item.services?.name || 'Other';
        acc[name] = (acc[name] || 0) + Number(item.total_price);
        return acc;
      }, {});
    } catch (error) {
      handleError(error);
    }
  }
};