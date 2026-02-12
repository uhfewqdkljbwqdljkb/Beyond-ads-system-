import { supabase, handleError, paginate } from './api.js';

export const taskService = {
  async getTasks({ assigned_to, status, related_to_type, related_to_id, overdue, page = 1, limit = 20 } = {}) {
    try {
      let query = supabase.from('tasks').select('*', { count: 'exact' });
      
      if (assigned_to) query = query.eq('assigned_to', assigned_to);
      if (status) query = query.eq('status', status);
      if (related_to_type && related_to_id) {
        query = query.eq('related_to_type', related_to_type).eq('related_to_id', related_to_id);
      }
      
      if (overdue) {
        query = query.lt('due_date', new Date().toISOString()).neq('status', 'completed');
      }

      query = paginate(query, page, limit);
      query = query.order('due_date', { ascending: true });
      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleError(error);
    }
  },

  async createTask(payload) {
    const { data, error } = await supabase.from('tasks').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  async completeTask(id) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getTasksDueToday(userId) {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', userId)
      .gte('due_date', start.toISOString())
      .lte('due_date', end.toISOString())
      .neq('status', 'completed');
    return data || [];
  }
};