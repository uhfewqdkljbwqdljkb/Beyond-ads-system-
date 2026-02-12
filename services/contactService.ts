import { supabase, handleError } from './api.js';
import { Contact } from '../types.ts';

export const contactService = {
  async getContactsByClientId(clientId: string): Promise<Contact[]> {
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

  async createContact(payload: any): Promise<Contact> {
    const { data, error } = await supabase.from('contacts').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  async updateContact(id: string, payload: any): Promise<Contact> {
    const { data, error } = await supabase.from('contacts').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async setPrimaryContact(contactId: string, clientId: string) {
    // Reset all
    await supabase.from('contacts').update({ is_primary: false }).eq('client_id', clientId);
    // Set one
    const { data, error } = await supabase.from('contacts').update({ is_primary: true }).eq('id', contactId).select().single();
    if (error) throw error;
    return data;
  }
};