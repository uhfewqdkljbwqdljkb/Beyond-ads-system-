import { supabase } from './api.js';

export const salesAnalyticsService = {
  async getSalesPersonStats(userId, period = 'month') {
    const now = new Date();
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1);

    if (period === 'today') startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    else if (period === 'week') startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [leads, deals, activities, tasks] = await Promise.all([
      supabase.from('leads').select('id, status').eq('assigned_to', userId).gte('created_at', startDate.toISOString()),
      supabase.from('deals').select('id, deal_value, win_probability, pipeline_stage_id, status').eq('assigned_to', userId).gte('created_at', startDate.toISOString()),
      supabase.from('activities').select('id, type').eq('created_by', userId).gte('created_at', startDate.toISOString()).eq('is_system_generated', false),
      supabase.from('tasks').select('id, status, due_date').eq('assigned_to', userId)
    ]);

    const leadsData = leads.data || [];
    const dealsData = deals.data || [];
    const activitiesData = activities.data || [];
    const tasksData = tasks.data || [];

    const activeDeals = dealsData.filter(d => d.status === 'open');
    const wonDeals = dealsData.filter(d => d.status === 'won');

    return {
      user_id: userId,
      period,
      total_leads: leadsData.length,
      qualified_leads: leadsData.filter(l => l.status === 'qualified').length,
      converted_leads: leadsData.filter(l => l.status === 'converted').length,
      pipeline_value: activeDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0),
      weighted_pipeline: activeDeals.reduce((sum, d) => sum + ((d.deal_value || 0) * (d.win_probability || 0) / 100), 0),
      closed_value: wonDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0),
      win_rate: dealsData.length > 0 ? (wonDeals.length / dealsData.length) * 100 : 0,
      calls_made: activitiesData.filter(a => a.type === 'call').length,
      emails_sent: activitiesData.filter(a => a.type === 'email').length,
      completed_tasks: tasksData.filter(t => t.status === 'completed').length,
      total_tasks: tasksData.length
    };
  }
};