import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetService } from '../services/googleSheetService.js';
import { useToast } from '../components/ui/Toast.jsx';

export const usePreviewSheet = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: ({ url, tabName }) => 
      googleSheetService.previewSheet(url, tabName),
    onError: (error) => toast.error(error.message)
  });
};

export const useSaveSheetConnection = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: googleSheetService.saveConnection,
    onError: (error) => toast.error("Failed to save connection")
  });
};