
export type UserRole = 'sales_rep' | 'team_lead' | 'sales_manager' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar: string;
  teamLeadId?: string | null;
  commissionStructureId?: string | null;
}

export const LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  LOST: 'LOST'
};

export const DealStage = {
  DISCOVERY: 'DISCOVERY',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  CLOSED_WON: 'CLOSED_WON',
  CLOSED_LOST: 'CLOSED_LOST'
};

export interface LeadGroup {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  created_by: string;
  is_shared: boolean;
  lead_count?: number; // Aggregated
  created_at: string;
  updated_at: string;
}

export interface GoogleSheetConnection {
  id: string;
  group_id: string;
  sheet_url: string;
  sheet_id: string;
  sheet_tab_name: string;
  column_mapping: Record<string, string>;
  last_synced_at?: string;
  last_sync_status?: 'success' | 'failed' | 'in_progress';
}
