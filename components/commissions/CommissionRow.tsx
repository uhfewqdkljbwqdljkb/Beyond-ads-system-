import React from 'react';
import { format } from 'date-fns';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { Table, Avatar, Checkbox } from '../ui';
import { CommissionStatusBadge } from './CommissionStatusBadge';
import { CommissionTypeBadge } from './CommissionTypeBadge';

interface CommissionRowProps {
  commission: any;
  showRep: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
}

export const CommissionRow: React.FC<CommissionRowProps> = ({ 
  commission, showRep, isSelected, onSelect, onClick 
}) => {
  return (
    <Table.Row selected={isSelected} onClick={onClick}>
      <Table.Cell onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onChange={onSelect} />
      </Table.Cell>
      {showRep && (
        <Table.Cell>
          <div className="flex items-center gap-3">
            <Avatar name={commission.users?.first_name} src={commission.users?.avatar_url} size="xs" />
            <span className="font-medium text-textPrimary">{commission.users?.first_name} {commission.users?.last_name}</span>
          </div>
        </Table.Cell>
      )}
      <Table.Cell>
        <span className="font-bold text-textPrimary group-hover:text-primary transition-colors cursor-pointer">
          {commission.deals?.name}
        </span>
      </Table.Cell>
      <Table.Cell>
        <div className="flex flex-col">
          <span className="font-bold text-textPrimary">${commission.commission_amount.toLocaleString()}</span>
          <span className="text-[10px] text-textSecondary">{commission.commission_rate}% of ${commission.base_amount.toLocaleString()}</span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <CommissionTypeBadge type={commission.commission_type} />
      </Table.Cell>
      <Table.Cell>
        <CommissionStatusBadge status={commission.status} size="sm" />
      </Table.Cell>
      <Table.Cell>
        <span className="text-xs text-textSecondary">{format(new Date(commission.earned_date), 'MMM d, yyyy')}</span>
      </Table.Cell>
      <Table.Cell align="right">
        <ChevronRight size={16} className="text-textMuted" />
      </Table.Cell>
    </Table.Row>
  );
};