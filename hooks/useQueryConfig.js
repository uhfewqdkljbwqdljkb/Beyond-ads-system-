
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Query key factory
export const queryKeys = {
  // Users
  users: (filters) => ['users', filters],
  user: (id) => ['users', id],
  userStats: (id, dateRange) => ['users', id, 'stats', dateRange],
  teamMembers: (teamLeadId) => ['users', 'team', teamLeadId],
  
  // Leads
  leads: (filters) => ['leads', filters],
  lead: (id) => ['leads', id],
  leadStats: (filters) => ['leads', 'stats', filters],
  leadsByStatus: ['leads', 'byStatus'],
  
  // Deals
  deals: (filters) => ['deals', filters],
  deal: (id) => ['deals', id],
  dealsByStage: (filters) => ['deals', 'byStage', filters],
  pipelineValue: (filters) => ['deals', 'pipelineValue', filters],
  dealStats: (filters) => ['deals', 'stats', filters],
  
  // Clients
  clients: (filters) => ['clients', filters],
  client: (id) => ['clients', id],
  clientStats: (id) => ['clients', id, 'stats'],
  topClients: (limit, dateRange) => ['clients', 'top', limit, dateRange],
  
  // Invoices
  invoices: (filters) => ['invoices', filters],
  invoice: (id) => ['invoices', id],
  invoiceStats: (filters) => ['invoices', 'stats', filters],
  overdueInvoices: ['invoices', 'overdue'],
  nextInvoiceNumber: ['invoices', 'nextNumber'],
  
  // Commissions
  commissions: (filters) => ['commissions', filters],
  commission: (id) => ['commissions', id],
  commissionStats: (userId, dateRange) => ['commissions', 'stats', userId, dateRange],
  commissionsByStatus: ['commissions', 'byStatus'],
  
  // Activities
  activities: (entityType, entityId, filters) => ['activities', entityType, entityId, filters],
  recentActivities: (userId) => ['activities', 'recent', userId],
  
  // Tasks
  tasks: (filters) => ['tasks', filters],
  task: (id) => ['tasks', id],
  tasksDueToday: (userId) => ['tasks', 'dueToday', userId],
  overdueTasks: (userId) => ['tasks', 'overdue', userId],
  upcomingTasks: (userId, days) => ['tasks', 'upcoming', userId, days],
  
  // Pipeline Stages
  pipelineStages: ['pipelineStages'],
  
  // Settings
  settings: ['settings'],
  setting: (key) => ['settings', key],
  leadSources: ['leadSources'],
  industries: ['industries'],
  services: ['services'],
  
  // Commission Structures
  commissionStructures: ['commissionStructures'],
  commissionStructure: (id) => ['commissionStructures', id],
  
  // Notifications
  notifications: (userId, filters) => ['notifications', userId, filters],
  unreadCount: (userId) => ['notifications', 'unread', userId],
  
  // Reports
  salesPerformance: (filters) => ['reports', 'salesPerformance', filters],
  pipelineAnalysis: (filters) => ['reports', 'pipelineAnalysis', filters],
  revenueReport: (filters) => ['reports', 'revenue', filters],
  leadSourceReport: (filters) => ['reports', 'leadSource', filters],
};