
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  UserPlus, 
  Briefcase, 
  Trophy, 
  XCircle, 
  FileText, 
  BadgePercent, 
  CheckCircle2, 
  AlertCircle,
  Bell,
  Trash2
} from 'lucide-react';
import { useMarkAsRead, useDeleteNotification } from '../../hooks/useNotifications';

interface NotificationItemProps {
  notification: any;
  onCloseDropdown: () => void;
  showDelete?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onCloseDropdown,
  showDelete = false
}) => {
  const navigate = useNavigate();
  const markAsRead = useMarkAsRead();
  const deleteNotif = useDeleteNotification();

  const getIcon = () => {
    const type = notification.type.toLowerCase();
    const style = "p-2 rounded-lg shrink-0";
    
    if (type.includes('lead')) return <div className={`${style} bg-blue-100 text-blue-600`}><UserPlus size={16} /></div>;
    if (type.includes('won')) return <div className={`${style} bg-emerald-100 text-emerald-600`}><Trophy size={16} /></div>;
    if (type.includes('lost')) return <div className={`${style} bg-red-100 text-red-600`}><XCircle size={16} /></div>;
    if (type.includes('deal')) return <div className={`${style} bg-primary-light text-primary`}><Briefcase size={16} /></div>;
    if (type.includes('invoice')) return <div className={`${style} bg-purple-100 text-purple-600`}><FileText size={16} /></div>;
    if (type.includes('commission')) return <div className={`${style} bg-amber-100 text-amber-600`}><BadgePercent size={16} /></div>;
    if (type.includes('task')) return <div className={`${style} bg-rose-100 text-rose-600`}><CheckCircle2 size={16} /></div>;
    
    return <div className={`${style} bg-surface text-textSecondary`}><Bell size={16} /></div>;
  };

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    if (onCloseDropdown) onCloseDropdown();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotif.mutate(notification.id);
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative flex gap-3 p-4 transition-all cursor-pointer group
        ${notification.is_read ? 'opacity-80 hover:bg-surface' : 'bg-primary-light/10 hover:bg-primary-light/20'}
        border-b border-border last:border-0
      `}
    >
      {getIcon()}
      
      <div className="flex-1 min-w-0 pr-4">
        <h4 className={`text-sm leading-tight ${notification.is_read ? 'text-textPrimary font-medium' : 'text-textPrimary font-bold'}`}>
          {notification.title}
        </h4>
        <p className="text-xs text-textSecondary mt-1 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <span className="text-[10px] text-textMuted font-bold uppercase mt-2 block tracking-wider">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        {!notification.is_read && (
          <div className="w-2 h-2 rounded-full bg-primary" />
        )}
        {showDelete && (
          <button 
            onClick={handleDelete}
            className="p-1 text-textMuted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
