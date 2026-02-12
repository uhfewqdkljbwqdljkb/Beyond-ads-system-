
import { supabase } from './api';
import { activityService } from './activityService';
import { notificationService } from './notificationService';
import { taskService } from './taskService';

export const automationService = {
  async handleStageChange(dealId: string, oldStageId: string, newStageId: string, userId: string) {
    const { data: deal } = await supabase.from('deals').select('*, clients(company_name)').eq('id', dealId).single();
    if (!deal) return;

    const { data: newStage } = await supabase.from('pipeline_stages').select('name').eq('id', newStageId).single();
    
    // 1. Log Activity
    await activityService.createSystemActivity('deal', dealId, 'stage_change', `Stage moved to ${newStage.name}`, {
      old_stage: oldStageId,
      new_stage: newStageId
    });

    // 2. Notify Owner
    await notificationService.createNotification({
      user_id: deal.assigned_to,
      type: 'stage_change',
      title: 'Deal Stage Updated',
      message: `"${deal.name}" moved to ${newStage.name}`,
      related_to_type: 'deal',
      related_to_id: dealId
    });

    // 3. Conditional Tasks
    const inDays = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString();
    };

    if (newStage.name.includes('Proposal')) {
      await taskService.createTask({
        title: `Draft & send proposal for ${deal.clients.company_name}`,
        assigned_to: deal.assigned_to,
        due_date: inDays(2),
        priority: 'high',
        related_to_type: 'deal',
        related_to_id: dealId,
        is_auto_generated: true,
        trigger_source: 'stage_change:proposal'
      });
    }

    if (newStage.name.includes('Negotiation')) {
      await taskService.createTask({
        title: `Negotiation follow-up: ${deal.name}`,
        assigned_to: deal.assigned_to,
        due_date: inDays(3),
        priority: 'medium',
        related_to_type: 'deal',
        related_to_id: dealId,
        is_auto_generated: true
      });
    }

    if (newStage.name.includes('Contract')) {
      await taskService.createTask({
        title: `Legal/Contract Review for ${deal.clients.company_name}`,
        assigned_to: deal.assigned_to,
        due_date: inDays(5),
        priority: 'urgent',
        related_to_type: 'deal',
        related_to_id: dealId,
        is_auto_generated: true
      });
    }
  }
};
