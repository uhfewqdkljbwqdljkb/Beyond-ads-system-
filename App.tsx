import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './hooks/useQueryConfig';
import { AppLayout } from './components/layout/AppLayout';
import { Spinner } from './components/ui/Spinner';
import { ToastContainer } from './components/ui/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { LoadingScreen } from './components/common/LoadingScreen';
import { NotFound as NotFoundPage } from './components/common/NotFound';

// Lazy Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const LeadsList = lazy(() => import('./pages/leads/LeadsList'));
const DealsList = lazy(() => import('./pages/deals/DealsList'));
const TasksList = lazy(() => import('./pages/tasks/TasksList')); // New import
const ClientsList = lazy(() => import('./pages/clients/ClientsList'));
const InvoicesList = lazy(() => import('./pages/invoices/InvoicesList'));
const CommissionsList = lazy(() => import('./pages/commissions/CommissionsList'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const NotificationsList = lazy(() => import('./pages/notifications/NotificationsList'));

// Settings Sub-Pages
const ProfileSettings = lazy(() => import('./pages/settings/ProfileSettings'));
const CompanySettings = lazy(() => import('./pages/settings/CompanySettings'));
const TeamManagement = lazy(() => import('./pages/settings/TeamManagement'));
const CommissionStructures = lazy(() => import('./pages/settings/CommissionStructures'));
const ServicesSettings = lazy(() => import('./pages/settings/ServicesSettings'));
const PipelineSettings = lazy(() => import('./pages/settings/PipelineSettings'));
const LeadSourceSettings = lazy(() => import('./pages/settings/LeadSourceSettings'));

const LeadDetail = lazy(() => import('./pages/leads/LeadDetail'));
const DealDetail = lazy(() => import('./pages/deals/DealDetail'));
const ClientDetail = lazy(() => import('./pages/clients/ClientDetail'));
const InvoiceCreate = lazy(() => import('./pages/invoices/InvoiceCreate'));
const InvoiceDetail = lazy(() => import('./pages/invoices/InvoiceDetail'));
const Reports = lazy(() => import('./pages/reports/Reports'));

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary onReset={() => window.location.reload()}>
      <QueryClientProvider client={queryClient}>
        <OfflineIndicator />
        <HashRouter>
          <ToastContainer />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                <Route path="leads">
                  <Route index element={<LeadsList />} />
                  <Route path=":id" element={<LeadDetail />} />
                </Route>

                <Route path="deals">
                  <Route index element={<DealsList />} />
                  <Route path=":id" element={<DealDetail />} />
                </Route>

                <Route path="tasks" element={<TasksList />} />

                <Route path="clients">
                  <Route index element={<ClientsList />} />
                  <Route path=":id" element={<ClientDetail />} />
                </Route>

                <Route path="invoices">
                  <Route index element={<InvoicesList />} />
                  <Route path="new" element={<InvoiceCreate />} />
                  <Route path=":id" element={<InvoiceDetail />} />
                </Route>

                <Route path="commissions" element={<CommissionsList />} />
                <Route path="notifications" element={<NotificationsList />} />
                <Route path="reports" element={<Reports />} />
                
                <Route path="settings" element={<Settings />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route element={<ProtectedRoute roles={['admin']} />}>
                    <Route path="company" element={<CompanySettings />} />
                    <Route path="team" element={<TeamManagement />} />
                    <Route path="commissions" element={<CommissionStructures />} />
                    <Route path="services" element={<ServicesSettings />} />
                    <Route path="pipeline" element={<PipelineSettings />} />
                    <Route path="lead-sources" element={<LeadSourceSettings />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;