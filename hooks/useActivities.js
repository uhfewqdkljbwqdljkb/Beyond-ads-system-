
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '../services/activityService';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useActivities = (entityType, entityId) => {
  return useQuery({
    queryKey: queryKeys.activities(entityType, entityId),
    queryFn: () => activityService.getActivities(entityType, entityId),
    enabled: !!entityType && !!entityId,
  });
};

export const useLogNote = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ entityType, entityId, content, userId }) => 
      activityService.logNote(entityType, entityId, content, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.activities(data.entity_type, data.entity_id) 
      });
      toast.success('Note logged');
    },
    onError: (error) => toast.error(error.message),
  });
};
