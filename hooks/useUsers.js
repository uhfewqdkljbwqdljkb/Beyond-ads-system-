
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useUsers = (filters) => {
  return useQuery({
    queryKey: queryKeys.users(filters),
    queryFn: () => userService.getUsers(filters),
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useTeamMembers = (teamLeadId) => {
  return useQuery({
    queryKey: queryKeys.teamMembers(teamLeadId),
    queryFn: () => userService.getUsers({ teamLeadId }),
    enabled: !!teamLeadId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, ...data }) => userService.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user(data.id) });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deactivated');
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useAssignToTeamLead = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ repId, teamLeadId }) => userService.assignToTeamLead(repId, teamLeadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Team assignment updated');
    },
    onError: (error) => toast.error(error.message),
  });
};