import { supabase, handleError } from './api.js';

export const contactService = {
  async getContactsByClientId(clientId) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('client_id', clientId)
        .order('is_primary', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  },

  async createContact(payload) {
    const { data, error } = await supabase.from('contacts').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  async updateContact(id, payload) {
    const { data, error } = await supabase.from('contacts').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async setPrimaryContact(contactId, clientId) {
    // Reset all
    await supabase.from('contacts').update({ is_primary: false }).eq('client_id', clientId);
    // Set one
    const { data, error } = await supabase.from('contacts').update({ is_primary: true }).eq('id', contactId).select().single();
    if (error) throw error;
    return data;
  }
};