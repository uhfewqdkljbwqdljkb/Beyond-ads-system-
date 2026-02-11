import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { queryKeys } from './useQueryConfig';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';

export const useNotifications = (filters) => {
  const user = useAuthStore(s => s.user);
  return useQuery({
    queryKey: queryKeys.notifications(user?.id, filters),
    queryFn: () => notificationService.getNotifications(user?.id),
    enabled: !!user?.id,
    refetchInterval: 60000,
  });
};

export const useUnreadCount = () => {
  const user = useAuthStore(s => s.user);
  return useQuery({
    queryKey: queryKeys.unreadCount(user?.id),
    queryFn: () => notificationService.getUnreadCount(user?.id),
    enabled: !!user?.id,
    refetchInterval: 30000,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);

  return useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount(user?.id) });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);
  const toast = useToast();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount(user?.id) });
      toast.success('All notifications marked as read');
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);

  return useMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount(user?.id) });
    },
  });
};