import React from 'react';
import { Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { Card, Avatar, Badge } from '../ui';
import { useNavigate } from 'react-router-dom';

interface FollowupLead {
  id: string;
  name: string;
  company: string;
  daysSinceActivity: number;
}

export const LeadsFollowupWidget: React.FC<{ leads: FollowupLead[] }> = ({ leads }) => {
  const navigate = useNavigate();

  return (
    <Card 
      title="Attention Needed" 
      subtitle="Leads cooling off"
      headerAction={<Badge variant="error" size="sm">{leads.length}</Badge>}
    >
      <div className="space-y-1">
        {leads.length === 0 ? (
          <p className="py-8 text-center text-sm text-textSecondary italic">Your leads are all active.</p>
        ) : (
          leads.map(lead => (
            <button 
              key={lead.id} 
              onClick={() => navigate(`/leads/${lead.id}`)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-all group border border-transparent hover:border-border"
            >
              <div className="flex items-center gap-3">
                <Avatar name={lead.name} size="sm" />
                <div className="text-left">
                  <p className="text-sm font-bold text-textPrimary leading-none">{lead.name}</p>
                  <p className="text-[11px] text-textSecondary mt-1">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-[11px] font-black text-red-600">
                     <Clock size={12} /> {lead.daysSinceActivity}d ago
                   </div>
                </div>
                <ChevronRight size={14} className="text-textMuted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  );
};