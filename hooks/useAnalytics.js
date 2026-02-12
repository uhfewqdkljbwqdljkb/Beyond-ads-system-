import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService.js';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: () => analyticsService.getDashboardSummary(),
  });
};

export const usePipelineValue = () => {
  return useQuery({
    queryKey: ['analytics', 'pipeline'],
    queryFn: () => analyticsService.getPipelineValue(),
  });
};