import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export const PageError = ({ 
  error, 
  onRetry, 
  title = "Failed to load data",
  message 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-red-50 text-error rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-lg font-black text-textPrimary tracking-tight">{title}</h3>
      <p className="text-sm text-textSecondary mt-2 mb-8 max-w-xs mx-auto leading-relaxed">
        {message || error?.message || "There was an error connecting to the server. Please check your connection and try again."}
      </p>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          leftIcon={<RefreshCw size={16} />}
          className="shadow-sm bg-white"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};