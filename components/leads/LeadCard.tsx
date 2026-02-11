
import React from 'react';
import { Calendar, DollarSign, Clock, User } from 'lucide-react';
import { Card, Avatar, Badge } from '../ui';

interface LeadCardProps {
  lead: any;
  isDragging?: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, isDragging }) => {
  const daysSinceActivity = lead.last_activity_at 
    ? Math.floor((Date.now() - new Date(lead.last_activity_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'default';
  };

  return (
    <Card 
      padding="sm" 
      className={`
        relative group transition-all duration-200 border-l-4
        ${isDragging ? 'rotate-2 scale-105 shadow-xl border-primary ring-2 ring-primary/20' : 'hover:border-primary border-transparent'}
      `}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-textPrimary leading-tight group-hover:text-primary transition-colors">
              {lead.first_name} {lead.last_name}
            </h4>
            <p className="text-xs text-textSecondary mt-0.5">{lead.company_name || 'Individual'}</p>
          </div>
          <Badge variant={getScoreColor(lead.lead_score)} size="sm">
            {lead.lead_score}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center text-xs font-bold text-success">
            <DollarSign size={12} className="mr-0.5" />
            {lead.estimated_value?.toLocaleString() || '0'}
          </div>
          <div className={`flex items-center text-[10px] font-medium ${daysSinceActivity > 7 ? 'text-error' : 'text-textMuted'}`}>
            <Clock size={10} className="mr-1" />
            {daysSinceActivity === 0 ? 'Today' : `${daysSinceActivity}d ago`}
          </div>
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-1.5">
             <div className="p-1 bg-surface rounded text-textMuted">
                <User size={10} />
             </div>
             <span className="text-[10px] text-textMuted font-medium truncate max-w-[100px]">
               {lead.users?.first_name || 'Unassigned'}
             </span>
           </div>
           <Avatar 
             src={lead.users?.avatar_url} 
             name={`${lead.users?.first_name || 'U'}`} 
             size="xs" 
           />
        </div>
      </div>
    </Card>
  );
};
