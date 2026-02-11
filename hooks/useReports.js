
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reportService';
import { queryKeys } from './useQueryConfig';

export const useSalesPerformance = (filters) => {
  return useQuery({
    queryKey: queryKeys.salesPerformance(filters),
    queryFn: () => reportService.getDashboardStats(), // Simplified implementation
  });
};

export const useRevenueReport = (filters) => {
  return useQuery({
    queryKey: queryKeys.revenueReport(filters),
    queryFn: () => reportService.getRevenueByService(),
  });
};