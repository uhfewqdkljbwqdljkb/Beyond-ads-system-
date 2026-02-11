
import { supabase, handleError, paginate } from './api';

export const taskService = {
  async getTasks({ assignedTo, status, entityType, entityId, page = 1, limit = 20 } = {}) {
    try {
      let query = supabase.from('tasks').select('*', { count: 'exact' });
      if (assignedTo) query = query.eq('assigned_to', assignedTo);
      if (status) query = query.eq('status', status);
      if (entityType) query = query.eq('entity_type', entityType);
      if (entityId) query = query.eq('entity_id', entityId);
      
      query = paginate(query, page, limit);
      query = query.order('due_date', { ascending: true });
      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleError(error);
    }
  },

  async createTask(data) {
    const { data: res, error } = await supabase.from('tasks').insert([data]).select();
    if (error) throw error;
    return res[0];
  },

  async updateTask(id, data) {
    const { data: res, error } = await supabase.from('tasks').update(data).eq('id', id).select();
    if (error) throw error;
    return res[0];
  },

  async deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
