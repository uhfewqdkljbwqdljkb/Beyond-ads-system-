
import React from 'react';
import { MoreVertical, ExternalLink, ArrowRight, RefreshCw, HandCoins } from 'lucide-react';
import { Table, Badge, Avatar, Dropdown } from '../ui';
import { format, differenceInDays } from 'date-fns';

interface DealRowProps {
  deal: any;
  onClick: () => void;
}

export const DealRow: React.FC<DealRowProps> = ({ deal, onClick }) => {
  const daysInStage = deal.updated_at 
    ? differenceInDays(new Date(), new Date(deal.updated_at)) 
    : 0;

  return (
    <Table.Row onClick={onClick}>
      <Table.Cell>
        <div className="flex items-center gap-3">
          {deal.deal_type === 'retainer' ? (
            <RefreshCw size={14} className="text-blue-500" />
          ) : (
            <HandCoins size={14} className="text-emerald-500" />
          )}
          <span className="font-bold text-textPrimary hover:text-primary cursor-pointer">{deal.name}</span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <span className="text-textSecondary font-medium">{deal.clients?.company_name}</span>
      </Table.Cell>
      <Table.Cell>
        <Badge variant="primary" size="sm" className="font-bold" style={{ backgroundColor: `${deal.pipeline_stages?.color}20`, color: deal.pipeline_stages?.color }}>
          {deal.pipeline_stages?.name}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <span className="font-bold text-textPrimary">${deal.deal_value?.toLocaleString()}</span>
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <div className="w-12 h-1.5 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${deal.win_probability}%` }} />
          </div>
          <span className="text-xs font-semibold text-textSecondary">{deal.win_probability}%</span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <span className="text-xs text-textSecondary">
          {deal.expected_close_date ? format(new Date(deal.expected_close_date), 'MMM d, yyyy') : '-'}
        </span>
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <Avatar name={deal.users?.first_name || 'U'} size="xs" src={deal.users?.avatar_url} />
          <span className="text-xs text-textSecondary">{deal.users?.first_name}</span>
        </div>
      </Table.Cell>
      <Table.Cell align="right" onClick={(e) => e.stopPropagation()}>
        <Dropdown trigger={<button className="p-1 hover:bg-surface rounded-md"><MoreVertical size={16} /></button>} align="right">
          <Dropdown.Item icon={<ExternalLink size={14} />} onClick={onClick}>View Details</Dropdown.Item>
          <Dropdown.Item icon={<ArrowRight size={14} />}>Move Stage</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item danger>Delete Deal</Dropdown.Item>
        </Dropdown>
      </Table.Cell>
    </Table.Row>
  );
};
