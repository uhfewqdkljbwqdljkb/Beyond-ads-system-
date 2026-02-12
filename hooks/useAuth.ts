import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/api.js';
import { userService } from '../services/userService.ts';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.ts';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAuth = () => {
  const store = useAuthStore() as any;
  return {
    user: store.user,
    login: store.login,
    logout: store.logout,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    hasRole: (roles: string | string[]) => {
      if (!store.user) return false;
      const roleList = Array.isArray(roles) ? roles : [roles];
      return roleList.includes(store.user.role);
    }
  };
};

export const usePermission = (permission: string) => {
  const { data: user } = useCurrentUser();
  if (!user) return false;
  if (user.role === 'admin') return true;
  
  const permissionsMap: Record<string, string[]> = {
    sales_manager: ['leads.view_all', 'deals.view_all', 'reports.view_team'],
    sales_rep: ['leads.view', 'deals.view', 'reports.view_own']
  };
  
  return permissionsMap[user.role]?.includes(permission) || false;
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await supabase.auth.signOut();
      queryClient.clear();
      navigate('/login');
    }
  });
};