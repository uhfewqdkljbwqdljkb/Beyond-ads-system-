import { supabase, handleError } from './api.js';

export const activityService = {
  async getActivitiesByEntity(entityType, entityId, { limit = 50, offset = 0 } = {}) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*, users(first_name, last_name, avatar_url)')
        .eq('related_to_type', entityType)
        .eq('related_to_id', entityId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async createActivity(payload) {
    try {
      const { data, error } = await supabase.from('activities').insert([payload]).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async createSystemActivity(entityType, entityId, type, subject, metadata = {}) {
    return this.createActivity({
      related_to_type: entityType,
      related_to_id: entityId,
      type,
      subject,
      metadata,
      is_system_generated: true
    });
  }
};