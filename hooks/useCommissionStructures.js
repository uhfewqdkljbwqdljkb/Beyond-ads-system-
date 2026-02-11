
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/api';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useCommissionStructures = () => {
  return useQuery({
    queryKey: queryKeys.commissionStructures,
    queryFn: async () => {
      const { data, error } = await supabase.from('commission_structures').select('*').eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateCommissionStructure = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const { data: res, error } = await supabase.from('commission_structures').insert([data]).select();
      if (error) throw error;
      return res[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissionStructures });
      toast.success('Structure created');
    },
    onError: (error) => toast.error(error.message),
  });
};