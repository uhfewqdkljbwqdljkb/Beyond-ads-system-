import React from 'react';
import { Briefcase } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 animate-bounce">
          <Briefcase size={40} />
        </div>
        <h1 className="text-2xl font-black text-textPrimary tracking-tighter">BEYOND ADS</h1>
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-48 h-1 bg-surface rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 bg-primary rounded-full animate-progress" />
          </div>
          <span className="text-[10px] font-black text-textMuted uppercase tracking-[0.3em] animate-pulse">
            Establishing Secure Connection
          </span>
        </div>
      </div>
    </div>
  );
};