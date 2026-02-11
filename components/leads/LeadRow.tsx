import React from 'react';
import { 
  Phone, Mail, MoreVertical, ExternalLink, Trash2, 
  ArrowRight, User, Building2, UserMinus
} from 'lucide-react';
import { Avatar, Checkbox, Dropdown, Badge } from '../ui';
import { LeadStatusBadge } from './LeadStatusBadge';
import { useNavigate } from 'react-router-dom';

interface LeadRowProps {
  lead: any;
  isSelected?: boolean;
  onSelect?: () => void;
  onRemoveFromGroup?: () => void;
  isInGroup?: boolean;
}

export const LeadRow: React.FC<LeadRowProps> = ({ 
  lead, isSelected, onSelect, onRemoveFromGroup, isInGroup 
}) => {
  const navigate = useNavigate();

  return (
    <div className="group flex items-center justify-between p-4 bg-white border-b border-zinc-100 hover:bg-zinc-50/80 transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {onSelect && (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={!!isSelected} onChange={onSelect} />
          </div>
        )}
        
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={`${lead.first_name} ${lead.last_name}`} src={lead.avatar_url} size="sm" className="hidden sm:block" />
          <div className="min-w-0">
            <button 
              onClick={() => navigate(`/leads/${lead.id}`)}
              className="text-sm font-bold text-textPrimary hover:text-primary transition-colors truncate block text-left"
            >
              {lead.first_name} {lead.last_name}
            </button>
            <div className="flex items-center gap-2 text-xs text-textSecondary">
              <span className="truncate max-w-[120px]">{lead.company_name || 'Individual'}</span>
              {lead.email && (
                <>
                  <span className="text-zinc-300">•</span>
                  <span className="truncate max-w-[150px] text-textMuted">{lead.email}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-8">
        <div className="hidden md:flex items-center gap-2 min-w-[140px]">
          <Phone size={12} className="text-textMuted" />
          <span className="text-xs text-textSecondary">{lead.phone || 'No phone'}</span>
        </div>

        <div className="hidden sm:block min-w-[100px]">
          <LeadStatusBadge status={lead.status} size="sm" />
        </div>

        <div className="flex items-center gap-2">
          {lead.phone && (
            <a 
              href={`tel:${lead.phone}`}
              className="p-2 text-zinc-400 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
              title="Call Lead"
            >
              <Phone size={16} />
            </a>
          )}
          
          <Dropdown trigger={<button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"><MoreVertical size={16} /></button>} align="right">
            <Dropdown.Item icon={<ExternalLink size={14} />} onClick={() => navigate(`/leads/${lead.id}`)}>View Details</Dropdown.Item>
            {isInGroup && (
              <Dropdown.Item icon={<UserMinus size={14} />} onClick={onRemoveFromGroup}>Remove from Group</Dropdown.Item>
            )}
            <Dropdown.Divider />
            <Dropdown.Item danger icon={<Trash2 size={14} />}>Delete Lead</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
