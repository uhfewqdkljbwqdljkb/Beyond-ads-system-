import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  PhoneCall, Mail, Calendar, MessageSquare, History, Clock, CheckCircle2 
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface ActivityItemProps {
  activity: any;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.activity_type) {
      case 'call': return { icon: <PhoneCall size={10} />, bg: 'bg-emerald-500' };
      case 'email': return { icon: <Mail size={10} />, bg: 'bg-blue-500' };
      case 'meeting': return { icon: <Calendar size={10} />, bg: 'bg-purple-500' };
      case 'note': return { icon: <MessageSquare size={10} />, bg: 'bg-amber-500' };
      case 'status_change': return { icon: <History size={10} />, bg: 'bg-textMuted' };
      default: return { icon: <History size={10} />, bg: 'bg-textMuted' };
    }
  };

  const { icon, bg } = getIcon();

  return (
    <div className="relative group">
      <div className={`
        absolute -left-6 top-1.5 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center shadow-sm text-white
        ${bg}
      `}>
        {icon}
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h5 className="text-sm font-bold text-textPrimary leading-none">
            {activity.subject || activity.activity_type.replace('_', ' ').toUpperCase()}
          </h5>
          <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider" title={format(new Date(activity.created_at), 'PPP pp')}>
            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
          </span>
        </div>
        
        {activity.content && (
          <div className="mt-1.5 text-sm text-textSecondary bg-surface p-3 rounded-lg border border-border/50">
            {activity.content}
          </div>
        )}

        {activity.activity_type === 'call' && (
          <div className="flex gap-4 mt-1 text-[11px] font-medium text-textMuted">
            <span className="flex items-center gap-1"><Clock size={12} /> {activity.call_duration_minutes || 0}m duration</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> {activity.call_outcome || 'Connected'}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-2">
           <Avatar size="xs" name={`${activity.users?.first_name} ${activity.users?.last_name}`} src={activity.users?.avatar_url} />
           <span className="text-[10px] font-bold text-textMuted">{activity.users?.first_name} {activity.users?.last_name}</span>
        </div>
      </div>
    </div>
  );
};