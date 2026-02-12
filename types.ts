
export type UserRole = 'admin' | 'sales_manager' | 'team_lead' | 'sales_rep';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  phone?: string;
  title?: string;
  department?: string;
  team_id?: string;
  team?: Team;
  manager_id?: string;
  manager?: User;
  invited_by?: string;
  invitation_token?: string;
  invitation_sent_at?: string;
  invitation_accepted_at?: string;
  last_login_at?: string;
  permissions?: Record<string, boolean>;
  settings?: UserSettings;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  notifications?: {
    email_on_lead_assigned?: boolean;
    email_on_deal_stage_change?: boolean;
    email_on_task_due?: boolean;
    in_app_notifications?: boolean;
  };
  dashboard?: {
    default_view?: 'overview' | 'sales' | 'manager';
    widgets?: string[];
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'auto';
    timezone?: string;
    date_format?: string;
    currency?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  team_lead_id?: string;
  team_lead?: User;
  is_active: boolean;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  team_id?: string;
  manager_id?: string;
  invited_by: string;
  inviter?: User;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

export interface SalesPersonStats {
  user_id: string;
  user_name: string;
  period: 'today' | 'week' | 'month' | 'quarter' | 'year';
  total_leads: number;
  new_leads: number;
  qualified_leads: number;
  converted_leads: number;
  lead_conversion_rate: number;
  total_deals: number;
  active_deals: number;
  won_deals: number;
  lost_deals: number;
  pipeline_value: number;
  weighted_pipeline: number;
  closed_value: number;
  win_rate: number;
  avg_deal_size: number;
  calls_made: number;
  emails_sent: number;
  meetings_held: number;
  total_activities: number;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  tasks_due_today: number;
}

export type Permission =
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete' | 'users.invite'
  | 'teams.view' | 'teams.create' | 'teams.edit' | 'teams.delete'
  | 'leads.view' | 'leads.view_all' | 'leads.create' | 'leads.edit' | 'leads.delete'
  | 'deals.view' | 'deals.view_all' | 'deals.create' | 'deals.edit' | 'deals.delete'
  | 'clients.view' | 'clients.create' | 'clients.edit' | 'clients.delete'
  | 'reports.view_own' | 'reports.view_team' | 'reports.view_all';

export type EntityType = 'lead' | 'deal' | 'client' | 'contact' | 'project';

export interface EntityReference {
  type: EntityType;
  id: string;
}

// Added missing interface for LeadGroupCard
export interface LeadGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_by?: string;
  is_shared?: boolean;
  lead_count?: number;
  created_at: string;
  updated_at: string;
}

// Added missing interface for Contact records
export interface Contact {
  id: string;
  client_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  is_primary: boolean;
  role?: string;
  created_at: string;
  updated_at: string;
}

// Added missing interface for User updates
export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  team_id?: string;
  commission_structure_id?: string;
  monthly_target?: number;
  avatar_url?: string;
}

// Re-add existing types
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task_completed' | 'stage_change' | 'status_change' | 'assignment_change' | 'record_created' | 'conversion';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'nurturing' | 'unqualified' | 'converted' | 'lost' | 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'NURTURING' | 'UNQUALIFIED' | 'CONVERTED' | 'LOST';

export interface AuditLog {
  id: string;
  user_id?: string;
  user?: User;
  action: string;
  entity_type?: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
