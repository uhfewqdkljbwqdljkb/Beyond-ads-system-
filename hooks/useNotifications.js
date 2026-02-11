
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { queryKeys } from './useQueryConfig';
import { useAuthStore } from '../store/authStore';

export const useNotifications = (filters) => {
  const user = useAuthStore(s => s.user);
  return useQuery({
    queryKey: queryKeys.notifications(user?.id, filters),
    queryFn: () => notificationService.getNotifications(user?.id),
    enabled: !!user?.id,
  });
};

export const useUnreadCount = () => {
  const user = useAuthStore(s => s.user);
  return useQuery({
    queryKey: queryKeys.unreadCount(user?.id),
    queryFn: () => notificationService.getUnreadCount(user?.id),
    enabled: !!user?.id,
    refetchInterval: 30000, // Poll every 30s
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};