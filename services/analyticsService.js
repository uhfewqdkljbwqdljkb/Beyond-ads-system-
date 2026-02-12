import { supabase } from './api.js';

export const analyticsService = {
  async getDashboardSummary() {
    const { data: deals } = await supabase.from('deals').select('deal_value, status, expected_close_date, win_probability');
    const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    
    const activeDeals = deals?.filter(d => d.status === 'open') || [];
    const pipelineValue = activeDeals.reduce((s, d) => s + Number(d.deal_value), 0);
    const weightedValue = activeDeals.reduce((s, d) => s + (Number(d.deal_value) * (Number(d.win_probability) / 100)), 0);
    
    return {
      total_leads: leadsCount || 0,
      active_deals: activeDeals.length,
      pipeline_value: pipelineValue,
      weighted_pipeline: weightedValue,
      overdue_tasks: 4, // Mock
      stale_leads: 12, // Mock
      revenue_this_month: 42000, // Mock
      mrr: 12500 // Mock
    };
  },

  async getPipelineValue() {
    const { data: stages } = await supabase.from('pipeline_stages').select('*').order('stage_order');
    const { data: deals } = await supabase.from('deals').select('deal_value, pipeline_stage_id, win_probability').eq('status', 'open');
    
    return stages?.map(s => {
      const stageDeals = deals?.filter(d => d.pipeline_stage_id === s.id) || [];
      return {
        stage_name: s.name,
        stage_id: s.id,
        deal_count: stageDeals.length,
        total_value: stageDeals.reduce((sum, d) => sum + Number(d.deal_value), 0),
        weighted_value: stageDeals.reduce((sum, d) => sum + (Number(d.deal_value) * (Number(d.win_probability) / 100)), 0),
      };
    }) || [];
  }
};