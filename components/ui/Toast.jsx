import React from 'react';
import ReactDOM from 'react-dom';
import { create } from 'zustand';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (type, message, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, type, message, duration }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const useToast = () => {
  const { addToast } = useToastStore();
  return {
    success: (msg) => addToast('success', msg),
    error: (msg) => addToast('error', msg),
    info: (msg) => addToast('info', msg),
    warning: (msg) => addToast('warning', msg),
  };
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  return ReactDOM.createPortal(
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            bg-white border-l-4 rounded-lg shadow-xl p-4 flex items-start gap-3 pointer-events-auto
            animate-in slide-in-from-right-10 fade-in duration-300
            ${toast.type === 'success' ? 'border-emerald-500' : ''}
            ${toast.type === 'error' ? 'border-red-500' : ''}
            ${toast.type === 'warning' ? 'border-amber-500' : ''}
            ${toast.type === 'info' ? 'border-blue-500' : ''}
          `}
        >
          <div className="shrink-0">{icons[toast.type]}</div>
          <div className="flex-1 text-sm font-medium text-textPrimary">{toast.message}</div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-textMuted hover:text-textPrimary"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
};