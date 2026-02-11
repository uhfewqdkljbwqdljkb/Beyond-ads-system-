import { supabase, handleError } from './api';

export const searchService = {
  async globalSearch(query) {
    if (!query || query.length < 2) return { leads: [], deals: [], clients: [], invoices: [] };

    try {
      const searchTerm = `%${query}%`;

      // Perform parallel searches
      const [leadsRes, dealsRes, clientsRes, invoicesRes] = await Promise.all([
        // Search Leads
        supabase
          .from('leads')
          .select('id, first_name, last_name, company_name, email, status, avatar_url')
          .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},company_name.ilike.${searchTerm},email.ilike.${searchTerm}`)
          .limit(3),

        // Search Deals
        supabase
          .from('deals')
          .select('id, name, deal_value, status, client_id, clients(company_name), pipeline_stages(name)')
          .ilike('name', searchTerm)
          .limit(3),

        // Search Clients
        supabase
          .from('clients')
          .select('id, company_name, contact_first_name, contact_last_name, status')
          .or(`company_name.ilike.${searchTerm},contact_first_name.ilike.${searchTerm},contact_last_name.ilike.${searchTerm}`)
          .limit(3),

        // Search Invoices
        supabase
          .from('invoices')
          .select('id, invoice_number, total_amount, status, client_id, clients(company_name)')
          .ilike('invoice_number', searchTerm)
          .limit(3)
      ]);

      return {
        leads: leadsRes.data || [],
        deals: dealsRes.data || [],
        clients: clientsRes.data || [],
        invoices: invoicesRes.data || []
      };
    } catch (error) {
      handleError(error);
    }
  }
};
