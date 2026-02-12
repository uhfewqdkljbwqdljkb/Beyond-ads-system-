import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';

export const RoleGate = ({ roles, children, fallback = null }) => {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};