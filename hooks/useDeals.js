
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealService } from '../services/dealService';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useDeals = (filters) => {
  return useQuery({
    queryKey: queryKeys.deals(filters),
    queryFn: () => dealService.getDeals(filters),
  });
};

export const useDeal = (id) => {
  return useQuery({
    queryKey: queryKeys.deal(id),
    queryFn: () => dealService.getDealById(id),
    enabled: !!id,
  });
};

export const useDealsByStage = () => {
  return useQuery({
    queryKey: queryKeys.dealsByStage({}),
    queryFn: dealService.getDealsByStage,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: dealService.createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal created');
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useMoveDealToStage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ dealId, stageId }) => dealService.moveDealToStage(dealId, stageId),
    onMutate: async ({ dealId, stageId }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['deals', 'byStage'] });
      const previousDeals = queryClient.getQueryData(['deals', 'byStage']);
      
      // We assume byStage returns stages with a deals array
      queryClient.setQueryData(['deals', 'byStage'], (old) => {
        if (!old) return old;
        return old.map(stage => {
          if (stage.id === stageId) {
            // Find deal and add to this stage
            const movingDeal = previousDeals?.flatMap(s => s.deals).find(d => d.id === dealId);
            if (movingDeal) return { ...stage, deals: [...stage.deals, { ...movingDeal, pipeline_stage_id: stageId }] };
          }
          return { ...stage, deals: stage.deals.filter(d => d.id !== dealId) };
        });
      });

      return { previousDeals };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['deals', 'byStage'], context.previousDeals);
      toast.error('Failed to move deal');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, ...data }) => dealService.updateDeal(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deal(data.id) });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal updated');
    },
    onError: (error) => toast.error(error.message),
  });
};