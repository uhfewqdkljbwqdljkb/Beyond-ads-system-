
import { supabase, handleError } from './api';
import { activityService } from './activityService';
import { automationService } from './automationService';

export const conversionService = {
  /**
   * Transforms a Lead into a Client account
   */
  async convertLeadToClient(leadId: string, userId: string, additionalData: any = {}) {
    try {
      // 1. Fetch Lead
      const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single();
      if (!lead) throw new Error("Lead not found");

      // 2. Create Client
      const clientPayload = {
        company_name: lead.company_name || `${lead.first_name} ${lead.last_name}`,
        website: lead.website,
        origin_lead_id: leadId,
        status: 'active',
        client_tier: 'standard',
        ...additionalData
      };
      const { data: client, error: cErr } = await supabase.from('clients').insert([clientPayload]).select().single();
      if (cErr) throw cErr;

      // 3. Create Primary Contact
      const contactPayload = {
        client_id: client.id,
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        is_primary: true,
        role: 'Decision Maker'
      };
      await supabase.from('contacts').insert([contactPayload]);

      // 4. Update Lead Status
      await supabase.from('leads').update({ 
        status: 'converted', 
        converted_at: new Date().toISOString(),
        converted_by: userId,
        converted_to_client_id: client.id
      }).eq('id', leadId);

      // 5. Log Activities
      await activityService.createSystemActivity('lead', leadId, 'conversion', 'Lead converted to Client account');
      await activityService.createSystemActivity('client', client.id, 'record_created', 'Account established via Lead conversion');

      return client;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Transforms a Won Deal into an Active Project
   */
  async convertDealToProject(dealId: string, userId: string, additionalData: any = {}) {
    try {
      const { data: deal } = await supabase.from('deals').select('*, clients(*)').eq('id', dealId).single();
      if (!deal) throw new Error("Deal not found");

      const projectPayload = {
        name: deal.name,
        client_id: deal.client_id,
        deal_id: dealId,
        project_type: deal.deal_type,
        budget: deal.deal_value,
        status: 'planning',
        assigned_to: deal.assigned_to,
        ...additionalData
      };

      const { data: project, error: pErr } = await supabase.from('projects').insert([projectPayload]).select().single();
      if (pErr) throw pErr;

      await supabase.from('deals').update({ 
        converted_to_project_id: project.id,
        closed_at: new Date().toISOString()
      }).eq('id', dealId);

      await activityService.createSystemActivity('deal', dealId, 'conversion', 'Deal fulfilled - Project created');
      await activityService.createSystemActivity('project', project.id, 'record_created', 'Project initiated from successful Deal');

      return project;
    } catch (error) {
      handleError(error);
    }
  }
};
