
import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications, useMarkAllAsRead } from '../../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Spinner } from '../ui/Spinner';
import { BellOff, ChevronRight, CheckCheck } from 'lucide-react';

export const NotificationDropdown = ({ onClose }: { onClose: () => void }) => {
  // Added empty filters object to useNotifications call
  const { data: notifications, isLoading } = useNotifications({});
  const markAllRead = useMarkAllAsRead();

  return (
    <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border border-border z-[100] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-white sticky top-0 z-10">
        <h3 className="text-sm font-bold text-textPrimary">Notifications</h3>
        <button 
          onClick={() => markAllRead.mutate()}
          disabled={!notifications?.some((n: any) => !n.is_read)}
          className="text-[10px] font-black text-primary hover:text-primary-hover uppercase tracking-widest flex items-center gap-1.5 disabled:opacity-50"
        >
          <CheckCheck size={12} />
          Mark all as read
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="py-20 flex justify-center"><Spinner size="sm" /></div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="py-20 text-center px-6">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3 text-textMuted">
              <BellOff size={20} />
            </div>
            <p className="text-sm text-textSecondary font-medium">All caught up!</p>
            <p className="text-xs text-textMuted mt-1">We'll notify you when something needs your attention.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.slice(0, 10).map((n: any) => (
              // Added key prop to NotificationItem
              <NotificationItem key={n.id} notification={n} onCloseDropdown={onClose} />
            ))}
          </div>
        )}
      </div>

      <Link 
        to="/notifications" 
        onClick={onClose}
        className="px-5 py-3 border-t border-border bg-surface hover:bg-white text-center text-xs font-bold text-primary flex items-center justify-center gap-2 transition-colors"
      >
        View All Notifications
        <ChevronRight size={14} />
      </Link>
    </div>
  );
};
