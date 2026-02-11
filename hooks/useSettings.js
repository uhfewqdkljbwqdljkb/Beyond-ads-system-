
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/api';
import { queryKeys } from './useQueryConfig';
import { useToast } from '../components/ui/Toast';

export const useSettings = () => {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      return data;
    },
  });
};

export const useLeadSources = () => {
  return useQuery({
    queryKey: queryKeys.leadSources,
    queryFn: async () => {
      const { data, error } = await supabase.from('lead_sources').select('*').eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });
};

export const useIndustries = () => {
  return useQuery({
    queryKey: queryKeys.industries,
    queryFn: async () => {
      const { data, error } = await supabase.from('industries').select('*').eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });
};

export const useServices = () => {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      return data;
    },
  });
};