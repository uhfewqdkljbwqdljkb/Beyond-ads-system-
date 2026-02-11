
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../services/clientService';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useClients = (filters) => {
  return useQuery({
    queryKey: queryKeys.clients(filters),
    queryFn: () => clientService.getClients(filters),
  });
};

export const useClient = (id) => {
  return useQuery({
    queryKey: queryKeys.client(id),
    queryFn: () => clientService.getClientById(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client added');
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, ...data }) => clientService.updateClient(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client(data.id) });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client updated');
    },
    onError: (error) => toast.error(error.message),
  });
};