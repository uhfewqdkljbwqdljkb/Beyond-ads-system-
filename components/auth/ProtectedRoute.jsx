import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser, usePermission } from '../../hooks/useAuth.js';
import { Spinner } from '../ui/Spinner.jsx';

export const ProtectedRoute = ({ 
  children, 
  requiredPermission 
}) => {
  const location = useLocation();
  const { data: user, isLoading } = useCurrentUser();
  const hasPerm = usePermission(requiredPermission || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPerm) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};