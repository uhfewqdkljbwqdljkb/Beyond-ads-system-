
import { supabase, handleError, paginate } from './api';

export const clientService = {
  async getClients({ page = 1, limit = 20, search } = {}) {
    try {
      let query = supabase.from('clients').select('*, industries(name)', { count: 'exact' });
      if (search) query = query.ilike('company_name', `%${search}%`);
      query = paginate(query, page, limit);
      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleError(error);
    }
  },

  async getClientById(id) {
    try {
      const { data, error } = await supabase.from('clients').select('*, deals(*), invoices(*)').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async createClient(data) {
    const { data: res, error } = await supabase.from('clients').insert([data]).select();
    if (error) throw error;
    return res[0];
  },

  async updateClient(id, data) {
    const { data: res, error } = await supabase.from('clients').update(data).eq('id', id).select();
    if (error) throw error;
    return res[0];
  },

  async deleteClient(id) {
    const { error } = await supabase.from('clients').update({ status: 'churned' }).eq('id', id);
    if (error) throw error;
    return true;
  }
};