import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, ExternalLink, Briefcase, DollarSign, User } from 'lucide-react';
import { Table, Avatar, Badge, Dropdown } from '../ui';
import { ClientStatusBadge } from './ClientStatusBadge';
import { format } from 'date-fns';

interface ClientRowProps {
  client: any;
}

export const ClientRow: React.FC<ClientRowProps> = ({ client }) => {
  const navigate = useNavigate();

  return (
    <Table.Row onClick={() => navigate(`/clients/${client.id}`)}>
      <Table.Cell>
        <div className="flex items-center gap-3">
          <Avatar name={client.company_name} size="sm" />
          <div className="flex flex-col">
            <span className="font-bold text-textPrimary group-hover:text-primary transition-colors">
              {client.company_name}
            </span>
            <span className="text-[11px] text-textSecondary">
              {client.contact_first_name} {client.contact_last_name}
            </span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        <ClientStatusBadge status={client.status} size="sm" />
      </Table.Cell>
      <Table.Cell>
        <Badge variant="default" size="sm" className="font-bold">
          {client.total_deals || 0} Deals
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <span className="font-bold text-textPrimary">
          ${client.lifetime_value?.toLocaleString() || '0'}
        </span>
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <User size={12} className="text-textMuted" />
          <span className="text-xs text-textSecondary">
            {client.users?.first_name || 'System'}
          </span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="text-xs text-textSecondary">
          {client.contract_start_date ? format(new Date(client.contract_start_date), 'MMM yy') : 'N/A'} - 
          {client.contract_end_date ? format(new Date(client.contract_end_date), 'MMM yy') : 'Open'}
        </div>
      </Table.Cell>
      <Table.Cell align="right" onClick={(e) => e.stopPropagation()}>
        <Dropdown trigger={<button className="p-1.5 hover:bg-surface rounded-md text-textMuted"><MoreHorizontal size={16} /></button>}>
          <Dropdown.Item icon={<ExternalLink size={14} />} onClick={() => navigate(`/clients/${client.id}`)}>View Profile</Dropdown.Item>
          <Dropdown.Item icon={<Briefcase size={14} />} onClick={() => navigate('/deals')}>New Deal</Dropdown.Item>
          <Dropdown.Item icon={<DollarSign size={14} />} onClick={() => navigate('/invoices')}>Create Invoice</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item danger>Archive Client</Dropdown.Item>
        </Dropdown>
      </Table.Cell>
    </Table.Row>
  );
};