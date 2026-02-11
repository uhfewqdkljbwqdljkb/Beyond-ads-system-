
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../services/leadService';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useLeads = (filters) => {
  return useQuery({
    queryKey: queryKeys.leads(filters),
    queryFn: () => leadService.getLeads(filters),
  });
};

export const useLead = (id) => {
  return useQuery({
    queryKey: queryKeys.lead(id),
    queryFn: () => leadService.getLeadById(id),
    enabled: !!id,
  });
};

export const useLeadsByStatus = () => {
  return useQuery({
    queryKey: queryKeys.leadsByStatus,
    queryFn: leadService.getLeadStats,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: leadService.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead added successfully');
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, ...data }) => leadService.updateLead(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lead(data.id) });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated');
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useConvertToClient = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ leadId, data }) => leadService.convertToClient(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Lead converted to client successfully');
    },
    onError: (error) => toast.error(error.message),
  });
};