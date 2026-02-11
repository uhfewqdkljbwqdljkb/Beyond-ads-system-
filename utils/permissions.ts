
export const PERMISSIONS = {
  LEADS_VIEW_OWN: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  LEADS_VIEW_TEAM: ['team_lead', 'sales_manager', 'admin'],
  LEADS_VIEW_ALL: ['sales_manager', 'admin'],
  LEADS_CREATE: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  LEADS_EDIT_OWN: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  LEADS_EDIT_ANY: ['sales_manager', 'admin'],
  LEADS_DELETE: ['sales_manager', 'admin'],
  LEADS_REASSIGN: ['team_lead', 'sales_manager', 'admin'],
  LEADS_IMPORT: ['sales_manager', 'admin'],
  
  DEALS_VIEW_OWN: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  DEALS_VIEW_ALL: ['sales_manager', 'admin'],
  DEALS_CREATE: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  DEALS_EDIT_VALUE: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  
  INVOICES_CREATE: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  INVOICES_VIEW_OWN: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  INVOICES_VIEW_ALL: ['sales_manager', 'admin'],
  INVOICES_MARK_PAID: ['sales_manager', 'admin'],
  INVOICES_DELETE: ['admin'],
  
  COMMISSIONS_VIEW_OWN: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  COMMISSIONS_VIEW_ALL: ['sales_manager', 'admin'],
  COMMISSIONS_APPROVE: ['sales_manager', 'admin'],
  COMMISSIONS_MARK_PAID: ['admin'],
  
  SETTINGS_VIEW: ['admin'],
  SETTINGS_USERS_MANAGE: ['admin'],
  SETTINGS_COMMISSION_STRUCTURES: ['admin'],
  
  REPORTS_PERSONAL: ['sales_rep', 'team_lead', 'sales_manager', 'admin'],
  REPORTS_TEAM: ['team_lead', 'sales_manager', 'admin'],
  REPORTS_COMPANY: ['sales_manager', 'admin'],
};

export function hasPermission(userRole, permission) {
  if (!userRole) return false;
  return (PERMISSIONS[permission] || []).includes(userRole);
}
