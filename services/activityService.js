
import { supabase, handleError } from './api';

export const activityService = {
  async getActivities(entityType, entity_id) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*, users(first_name, last_name, avatar_url)')
        .eq('entity_type', entityType)
        .eq('entity_id', entity_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async createActivity(activityData) {
    try {
      const { data, error } = await supabase.from('activities').insert([activityData]).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      handleError(error);
    }
  },

  async logNote(entityType, entity_id, content, createdBy) {
    return this.createActivity({
      entity_type: entityType,
      entity_id,
      activity_type: 'note',
      content,
      created_by: createdBy
    });
  }
};
