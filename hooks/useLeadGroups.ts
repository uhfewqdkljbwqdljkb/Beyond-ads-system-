import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadGroupService } from '../services/leadGroupService';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';

export const useLeadGroups = () => {
  const user = useAuthStore(s => s.user);
  return useQuery({
    queryKey: ['leadGroups', user?.id],
    queryFn: () => leadGroupService.getGroups(user?.id || ''),
    enabled: !!user?.id,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: leadGroupService.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadGroups'] });
      toast.success('Group created successfully');
    },
    onError: (error: any) => toast.error(error.message),
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: leadGroupService.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadGroups'] });
      toast.success('Group deleted');
    },
    onError: (error: any) => toast.error(error.message),
  });
};

export const useAddLeadsToGroup = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ groupId, leadIds, userId }: any) => 
      leadGroupService.addLeadsToGroup(groupId, leadIds, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadGroups'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Leads added to group');
    },
    onError: (error: any) => toast.error(error.message),
  });
};

export const useRemoveLeadFromGroup = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ groupId, leadId }: any) => leadGroupService.removeLeadFromGroup(groupId, leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadGroups'] });
      toast.success('Lead removed from group');
    },
    onError: (error: any) => toast.error(error.message),
  });
};