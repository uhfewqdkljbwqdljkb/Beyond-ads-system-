import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, Avatar } from '../ui';
import { LeadScoreBadge } from './LeadScoreBadge';
import { useUpdateLead } from '../../hooks/useLeads';

interface LeadDetailsCardProps {
  lead: any;
  onReassign: () => void;
}

export const LeadDetailsCard: React.FC<LeadDetailsCardProps> = ({ lead, onReassign }) => {
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [tempValue, setTempValue] = useState(lead?.estimated_value || 0);
  const updateLead = useUpdateLead();

  const handleValueSave = async () => {
    try {
      await updateLead.mutateAsync({ id: lead.id, estimated_value: tempValue });
      setIsEditingValue(false);
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <Card title="Engagement Score">
        <LeadScoreBadge score={lead.lead_score || 0} showBar className="mt-2" />
        <p className="text-[11px] text-textSecondary italic mt-4">Score based on activity frequency and profile completeness.</p>
      </Card>

      <Card title="Assignee" headerAction={
         <button className="text-[11px] font-bold text-primary uppercase" onClick={onReassign}>Change</button>
      }>
         <div className="flex items-center gap-3">
            <Avatar name={`${lead.users?.first_name} ${lead.users?.last_name}`} src={lead.users?.avatar_url} />
            <div>
               <p className="text-sm font-bold text-textPrimary">{lead.users?.first_name} {lead.users?.last_name}</p>
               <p className="text-xs text-textMuted">Owner since {format(new Date(lead.created_at), 'MMM yyyy')}</p>
            </div>
         </div>
      </Card>

      <Card title="Financial Context">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Est. Deal Value</p>
              {!isEditingValue ? (
                <button onClick={() => setIsEditingValue(true)} className="text-[10px] text-primary font-bold">Edit</button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleValueSave} className="text-[10px] text-success font-bold">Save</button>
                  <button onClick={() => setIsEditingValue(false)} className="text-[10px] text-textMuted font-bold">X</button>
                </div>
              )}
            </div>
            
            {isEditingValue ? (
              <input 
                type="number" 
                autoFocus
                className="text-2xl font-black text-textPrimary w-full bg-surface border border-primary/20 rounded mt-1 px-2 outline-none"
                value={tempValue}
                onChange={e => setTempValue(parseFloat(e.target.value))}
              />
            ) : (
              <p className="text-2xl font-black text-textPrimary mt-1">${lead.estimated_value?.toLocaleString() || '0'}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};