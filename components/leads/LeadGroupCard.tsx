import React from 'react';
import { MoreHorizontal, Edit, Trash2, UserPlus, Folder } from 'lucide-react';
import { Card, Dropdown } from '../ui';
import { LeadGroup } from '../../types';

interface LeadGroupCardProps {
  group: LeadGroup;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAssign?: () => void;
}

export const LeadGroupCard: React.FC<LeadGroupCardProps> = ({ 
  group, onClick, onEdit, onDelete, onAssign 
}) => {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col bg-white border border-border rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Color Accent */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1" 
        style={{ backgroundColor: group.color }} 
      />

      <div className="flex justify-between items-start mb-4 pl-2">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: `${group.color}` }}
        >
          <Folder size={20} className="text-white/90" />
        </div>
        
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown trigger={
            <button className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors">
              <MoreHorizontal size={18} />
            </button>
          } align="right">
            <Dropdown.Item icon={<Edit size={14} />} onClick={onEdit}>Edit Group</Dropdown.Item>
            {onAssign && <Dropdown.Item icon={<UserPlus size={14} />} onClick={onAssign}>Assign Members</Dropdown.Item>}
            <Dropdown.Divider />
            <Dropdown.Item danger icon={<Trash2 size={14} />} onClick={onDelete}>Delete Group</Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <div className="flex-1 pl-2">
        <h3 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors mb-1 truncate">
          {group.name}
        </h3>
        <p className="text-xs text-textSecondary line-clamp-2 min-h-[2.5em]">
          {group.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-border pl-2 flex items-center justify-between">
        <span className="text-xs font-bold text-textSecondary bg-zinc-100 px-2 py-1 rounded-md">
          {group.lead_count || 0} leads
        </span>
        <span className="text-[10px] font-medium text-textMuted">
          {new Date(group.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};