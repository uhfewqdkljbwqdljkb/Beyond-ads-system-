import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/invoiceService';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useInvoices = (filters) => {
  return useQuery({
    queryKey: queryKeys.invoices(filters),
    queryFn: () => invoiceService.getInvoices(filters),
  });
};

export const useInvoice = (id) => {
  return useQuery({
    queryKey: queryKeys.invoice(id),
    queryFn: () => invoiceService.getInvoiceById(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ data, items }) => invoiceService.createInvoice(data, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Invoice generated successfully');
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, status }) => invoiceService.updateInvoiceStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoice(data.id) });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success(`Invoice status: ${status}`);
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useMarkInvoicePaid = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, paymentData }) => invoiceService.recordPayment(id, paymentData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoice(data.id) });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Payment recorded and commission triggered');
    },
    onError: (error) => toast.error(error.message),
  });
};