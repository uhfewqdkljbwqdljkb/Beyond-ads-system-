
import { supabase, handleError } from './api';

export const searchService = {
  async globalSearch(query, { limit = 20 } = {}) {
    if (!query || query.length < 2) return [];

    try {
      const term = `%${query}%`;
      
      const [leads, deals, clients, projects] = await Promise.all([
        supabase.from('leads').select('id, first_name, last_name, company_name').or(`first_name.ilike.${term},last_name.ilike.${term},company_name.ilike.${term}`).limit(5),
        supabase.from('deals').select('id, name, clients(company_name)').ilike('name', term).limit(5),
        supabase.from('clients').select('id, company_name').ilike('company_name', term).limit(5),
        supabase.from('projects').select('id, name').ilike('name', term).limit(5)
      ]);

      const results = [];
      
      leads.data?.forEach(l => results.push({
        type: 'lead',
        id: l.id,
        title: `${l.first_name} ${l.last_name}`,
        subtitle: l.company_name || 'Individual',
        url: `/leads/${l.id}`
      }));

      deals.data?.forEach(d => results.push({
        type: 'deal',
        id: d.id,
        title: d.name,
        subtitle: d.clients?.company_name,
        url: `/deals/${d.id}`
      }));

      clients.data?.forEach(c => results.push({
        type: 'client',
        id: c.id,
        title: c.company_name,
        subtitle: 'Account',
        url: `/clients/${c.id}`
      }));

      projects.data?.forEach(p => results.push({
        type: 'project',
        id: p.id,
        title: p.name,
        subtitle: 'Active Project',
        url: `/projects/${p.id}`
      }));

      return results;
    } catch (error) {
      handleError(error);
    }
  }
};
