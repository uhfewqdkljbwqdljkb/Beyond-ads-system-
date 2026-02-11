import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Trophy, 
  Phone, 
  Mail, 
  FileText, 
  UserPlus,
  ArrowUpRight
} from 'lucide-react';
import { Card, Avatar } from '../ui';

const activities = [
  { id: '1', type: 'won', user: 'Sarah Miller', action: 'closed a deal', target: 'Project Hyperion', time: new Date(Date.now() - 1000*60*45) },
  { id: '2', type: 'lead', user: 'James Wilson', action: 'converted lead', target: 'Starlight Co.', time: new Date(Date.now() - 1000*60*120) },
  { id: '3', type: 'call', user: 'Elena Rodriguez', action: 'logged a call with', target: 'Marcus Chen', time: new Date(Date.now() - 1000*60*60*4) },
  { id: '4', type: 'invoice', user: 'System', action: 'sent invoice to', target: 'Nebula Labs', time: new Date(Date.now() - 1000*60*60*6) },
];

export const ActivityFeed: React.FC<{ title?: string }> = ({ title = "Recent Team Activity" }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'won': return <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><Trophy size={14} /></div>;
      case 'lead': return <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><UserPlus size={14} /></div>;
      case 'call': return <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><Phone size={14} /></div>;
      case 'invoice': return <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><FileText size={14} /></div>;
      default: return <div className="p-1.5 bg-surface text-textMuted rounded-lg"><ArrowUpRight size={14} /></div>;
    }
  };

  return (
    <Card title={title} headerAction={<button className="text-xs font-bold text-primary hover:underline">View Stream</button>}>
      <div className="space-y-6 mt-4">
        {activities.map(act => (
          <div key={act.id} className="flex gap-4 relative">
            <div className="relative z-10">{getIcon(act.type)}</div>
            <div className="flex-1 min-w-0">
               <p className="text-sm text-textSecondary">
                 <span className="font-bold text-textPrimary">{act.user}</span> {act.action} <span className="font-bold text-textPrimary">{act.target}</span>
               </p>
               <p className="text-[10px] text-textMuted font-medium uppercase mt-1">
                 {formatDistanceToNow(act.time, { addSuffix: true })}
               </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};