
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useTasks = (filters) => {
  return useQuery({
    queryKey: queryKeys.tasks(filters),
    queryFn: () => taskService.getTasks(filters),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created');
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => taskService.updateTask(id, { status: 'completed', completed_at: new Date() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task completed');
    },
    onError: (error) => toast.error(error.message),
  });
};
