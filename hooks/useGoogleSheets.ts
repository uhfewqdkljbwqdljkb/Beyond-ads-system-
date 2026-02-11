
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetService } from '../services/googleSheetService';
import { useToast } from '../components/ui/Toast';

export const usePreviewSheet = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: ({ url, tabName }: { url: string; tabName?: string }) => 
      googleSheetService.previewSheet(url, tabName),
    onError: (error: any) => toast.error(error.message)
  });
};

export const useSaveSheetConnection = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: googleSheetService.saveConnection,
    onError: (error: any) => toast.error("Failed to save connection")
  });
};
