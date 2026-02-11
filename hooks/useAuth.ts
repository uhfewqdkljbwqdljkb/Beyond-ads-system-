
import { useAuthStore } from '../store/authStore';
import { hasPermission } from '../utils/permissions';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore();

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasUserPermission = (permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    hasPermission: hasUserPermission,
  };
};
