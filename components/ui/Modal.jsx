import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '../../hooks/useMediaQuery.js';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  currentStep,
  totalSteps
}) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-[400px]',
    md: 'max-w-[500px]',
    lg: 'max-w-[600px]',
    xl: 'max-w-[800px]',
    full: 'max-w-[90vw] h-[90vh]',
  };

  const mobileClasses = isMobile 
    ? 'fixed inset-0 z-[100] flex flex-col bg-white'
    : 'relative w-full bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200 ' + sizes[size];

  const modalContent = (
    <div className={isMobile ? '' : 'fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6'}>
      {!isMobile && (
        <div 
          className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}
      <div className={mobileClasses}>
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10 min-h-[64px]">
          <div className="flex items-center gap-3">
             {isMobile && <button onClick={onClose} className="p-1 -ml-2 text-zinc-500"><ArrowLeft size={20} /></button>}
             <div>
               {title && <h3 className="text-sm font-bold text-zinc-900">{title}</h3>}
               {currentStep !== undefined && totalSteps !== undefined && (
                 <div className="flex gap-1 mt-1.5">
                   {Array.from({ length: totalSteps }).map((_, i) => (
                     <div 
                       key={i} 
                       className={`h-1 w-6 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? 'bg-primary' : 'bg-zinc-100'}`}
                     />
                   ))}
                 </div>
               )}
             </div>
          </div>
          {!isMobile && showCloseButton && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};