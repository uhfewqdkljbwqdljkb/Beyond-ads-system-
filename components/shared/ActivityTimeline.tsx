
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Phone, Mail, Calendar, StickyNote, CheckCircle, RefreshCw, Star, ArrowUpRight, Zap } from 'lucide-react';
import { Avatar, Badge, Spinner } from '../ui';

interface ActivityTimelineProps {
  entityType: 'lead' | 'deal' | 'client' | 'contact' | 'project';
  entityId: string;
  activities: any[];
  isLoading?: boolean;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, isLoading }) => {
  if (isLoading) return <div className="py-20 flex justify-center"><Spinner /></div>;

  const getIcon = (type: string) => {
    switch (type) {
      case 'call': return { icon: <Phone size={14} />, color: 'bg-emerald-100 text-emerald-600' };
      case 'email': return { icon: <Mail size={14} />, color: 'bg-blue-100 text-blue-600' };
      case 'meeting': return { icon: <Calendar size={14} />, color: 'bg-purple-100 text-purple-600' };
      case 'task_completed': return { icon: <CheckCircle size={14} />, color: 'bg-emerald-500 text-white' };
      case 'stage_change': return { icon: <RefreshCw size={14} />, color: 'bg-amber-100 text-amber-600' };
      case 'conversion': return { icon: <Zap size={14} />, color: 'bg-amber-500 text-white shadow-md' };
      default: return { icon: <StickyNote size={14} />, color: 'bg-zinc-100 text-zinc-600' };
    }
  };

  return (
    <div className="relative space-y-6 before:absolute before:left-4 before:top-4 before:bottom-0 before:w-0.5 before:bg-zinc-100">
      {activities?.map((activity, idx) => {
        const { icon, color } = getIcon(activity.type);
        const isSystem = activity.is_system_generated;

        return (
          <div key={activity.id} className="relative pl-10 group animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className={`
              absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-white
              ${color}
            `}>
              {icon}
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${isSystem ? 'bg-zinc-50/50 border-zinc-100' : 'bg-white border-zinc-100 group-hover:border-primary/20 shadow-sm group-hover:shadow-md'}`}>
               <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-black ${isSystem ? 'text-zinc-500' : 'text-zinc-900'} uppercase tracking-tight`}>
                    {activity.subject}
                  </h4>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
               </div>
               
               {activity.description && (
                 <p className="text-[13px] text-zinc-600 leading-relaxed mt-2 whitespace-pre-wrap">
                   {activity.description}
                 </p>
               )}

               <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Avatar name={activity.users?.first_name || 'System'} size="xs" src={activity.users?.avatar_url} />
                     <span className="text-[10px] font-bold text-zinc-400 uppercase">
                        {activity.users ? `${activity.users.first_name} ${activity.users.last_name}` : 'Automated System'}
                     </span>
                  </div>
                  {activity.duration_minutes && (
                    <Badge variant="default" size="xs">{activity.duration_minutes} min</Badge>
                  )}
               </div>
            </div>
          </div>
        );
      })}
      
      {(!activities || activities.length === 0) && (
        <div className="py-20 text-center space-y-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-zinc-300 shadow-sm"><StickyNote size={24} /></div>
           <p className="text-zinc-400 text-sm font-medium">No activity logged yet.</p>
        </div>
      )}
    </div>
  );
};
