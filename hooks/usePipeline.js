
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/api';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const usePipelineStages = () => {
  return useQuery({
    queryKey: queryKeys.pipelineStages,
    queryFn: async () => {
      const { data, error } = await supabase.from('pipeline_stages').select('*').order('stage_order');
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateStage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { data: res, error } = await supabase.from('pipeline_stages').update(data).eq('id', id).select();
      if (error) throw error;
      return res[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelineStages });
      toast.success('Stage updated');
    },
  });
};