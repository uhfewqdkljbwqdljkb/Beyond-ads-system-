import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './hooks/useQueryConfig.js';
import { AppLayout } from './components/layout/AppLayout.tsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';
import { useAuthStore } from './store/authStore.ts';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';
import { LoadingScreen } from './components/common/LoadingScreen.jsx';

// Lazy Pages
const Login = lazy(() => import('./pages/auth/Login.tsx'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard.tsx'));
const SalesDashboard = lazy(() => import('./pages/dashboard/SalesDashboard.tsx').then(m => ({ default: m.SalesDashboard })));
const UsersPage = lazy(() => import('./pages/settings/TeamManagement.tsx'));

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary onReset={() => window.location.reload()}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={user?.role === 'admin' ? <Dashboard /> : <SalesDashboard />} />
                <Route path="users" element={<ProtectedRoute requiredPermission="users.view"><UsersPage /></ProtectedRoute>} />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;