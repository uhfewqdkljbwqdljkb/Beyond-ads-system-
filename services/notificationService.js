import { supabase, handleError } from './api.js';

export const notificationService = {
  async getNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error);
    }
  },

  async markAsRead(id) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date() })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
    }
  },

  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date() })
        .eq('user_id', userId)
        .eq('is_read', false);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
    }
  },

  async deleteNotification(id) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
    }
  },

  async getUnreadCount(userId) {
    try {
      // head: true returns just the count without fetching data
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      handleError(error);
    }
  }
};