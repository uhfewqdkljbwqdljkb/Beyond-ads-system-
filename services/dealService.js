import { supabase, handleError, paginate } from './api.js';

export const dealService = {
  async getDeals({ stageId, status, assignedTo, page = 1, limit = 50 } = {}) {
    try {
      let query = supabase.from('deals').select('*, pipeline_stages(name, color), clients(company_name), users(first_name, last_name, avatar_url)', { count: 'exact' });
      
      if (stageId) query = query.eq('pipeline_stage_id', stageId);
      if (status) query = query.eq('status', status);
      if (assignedTo) query = query.eq('assigned_to', assignedTo);

      query = paginate(query, page, limit);
      query = query.order('updated_at', { ascending: false });

      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleError(error);
    }
  },

  async getDealById(id) {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *, 
          pipeline_stages(*),
          clients(*),
          users(first_name, last_name, avatar_url),
          deal_services(*, services(*)), 
          activities(*), 
          invoices(*)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async createDeal(dealData) {
    const { services, ...rest } = dealData;
    try {
      // 1. Insert the deal
      const { data: deal, error } = await supabase
        .from('deals')
        .insert([rest])
        .select()
        .single();
      
      if (error) throw error;

      // 2. Insert service relations if any
      if (services && services.length > 0) {
        const serviceLinks = services.map(serviceId => ({
          deal_id: deal.id,
          service_id: serviceId
        }));
        await supabase.from('deal_services').insert(serviceLinks);
      }

      return deal;
    } catch (error) {
      handleError(error);
    }
  },

  async updateDeal(id, updates) {
    try {
      const { data, error } = await supabase.from('deals').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async moveDealToStage(dealId, stageId) {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update({ pipeline_stage_id: stageId, updated_at: new Date() })
        .eq('id', dealId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async getDealsByStage() {
    try {
      const { data: stagesData, error: stagesError } = await supabase.from('pipeline_stages').select('*').order('stage_order');
      if (stagesError) throw stagesError;
      
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*, clients(company_name), users(first_name, last_name)')
        .eq('status', 'open');
      if (dealsError) throw dealsError;
      
      const stages = stagesData || [];
      const deals = dealsData || [];
      
      return stages.map(stage => ({
        ...stage,
        deals: deals.filter(d => d.pipeline_stage_id === stage.id)
      }));
    } catch (error) {
      handleError(error);
      return [];
    }
  }
};