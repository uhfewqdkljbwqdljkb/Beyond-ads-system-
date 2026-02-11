import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronRight, Terminal, MessageCircle } from 'lucide-react';
import { Button, Card } from '../ui';

export const ErrorFallback = ({ error, resetError }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6 font-sans">
      <div className="max-w-xl w-full animate-in fade-in zoom-in-95 duration-300">
        <Card padding="lg" className="shadow-2xl border-none ring-1 ring-black/5 overflow-hidden">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-50 text-error rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={40} />
            </div>
            
            <h1 className="text-2xl font-black text-textPrimary tracking-tight">Something went wrong</h1>
            <p className="text-textSecondary mt-2 mb-8">
              An unexpected error occurred and the application was unable to continue. 
              Your work may not have been saved.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <Button 
                onClick={resetError} 
                fullWidth 
                leftIcon={<RefreshCw size={18} />}
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/dashboard'} 
                fullWidth 
                leftIcon={<Home size={18} />}
              >
                Go to Dashboard
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-border w-full">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between text-[10px] font-black text-textMuted uppercase tracking-widest hover:text-textPrimary transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Terminal size={14} /> Technical Details
                  </span>
                  <ChevronRight size={14} className={`transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                </button>

                {showDetails && (
                  <div className="bg-surface p-4 rounded-xl border border-border text-left overflow-auto max-h-[150px] animate-in slide-in-from-top-2">
                    <p className="font-mono text-xs text-red-600 font-bold mb-2">
                      {error?.name}: {error?.message}
                    </p>
                    <pre className="font-mono text-[10px] text-textSecondary whitespace-pre-wrap leading-relaxed">
                      {error?.stack}
                    </pre>
                  </div>
                )}

                <a 
                  href="mailto:support@nexusagency.com" 
                  className="flex items-center justify-center gap-2 text-xs font-bold text-primary hover:underline"
                >
                  <MessageCircle size={14} /> Contact Support
                </a>
              </div>
            </div>
          </div>
        </Card>
        <p className="text-center text-[10px] text-textMuted font-black uppercase tracking-widest mt-8">
          Beyond Ads Agency CRM • Error ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </p>
      </div>
    </div>
  );
};