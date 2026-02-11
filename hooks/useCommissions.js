
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionService } from '../services/commissionService';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useCommissions = (filters) => {
  return useQuery({
    queryKey: queryKeys.commissions(filters),
    queryFn: () => commissionService.getCommissions(filters),
  });
};

export const useCommissionStats = (userId) => {
  return useQuery({
    queryKey: queryKeys.commissionStats(userId),
    queryFn: () => commissionService.getCommissionStats(userId),
    enabled: !!userId,
  });
};

export const useApproveCommission = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, userId }) => commissionService.approveCommission(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      toast.success('Commission approved');
    },
    onError: (error) => toast.error(error.message),
  });
};