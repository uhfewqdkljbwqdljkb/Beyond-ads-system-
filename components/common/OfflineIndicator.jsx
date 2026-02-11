import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useToast } from '../ui/Toast';

export const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  const [showBanner, setShowBanner] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      // If we were offline and now we're back
      if (showBanner) {
        toast.success('Connection restored. You are back online.');
        setShowBanner(false);
      }
    }
  }, [isOnline, toast]);

  if (!showBanner || isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] animate-in slide-in-from-top duration-300">
      <div className="bg-textPrimary text-white px-4 py-2 flex items-center justify-center gap-3 shadow-lg">
        <WifiOff size={16} className="text-warning" />
        <span className="text-xs font-bold uppercase tracking-widest">
          You are currently offline. Some features may be unavailable.
        </span>
        <button 
          onClick={() => setShowBanner(false)}
          className="ml-4 p-1 hover:bg-white/10 rounded-md transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};