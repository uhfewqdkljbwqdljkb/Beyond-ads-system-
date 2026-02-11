
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, FileText, Download, Send, CreditCard, Trash2, ExternalLink } from 'lucide-react';
import { Table, Dropdown, Checkbox } from '../ui';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { format, isAfter } from 'date-fns';

interface InvoiceRowProps {
  invoice: any;
  isSelected: boolean;
  onSelect: () => void;
}

export const InvoiceRow: React.FC<InvoiceRowProps> = ({ invoice, isSelected, onSelect }) => {
  const navigate = useNavigate();
  const isOverdue = invoice.status === 'sent' && isAfter(new Date(), new Date(invoice.due_date));

  return (
    <Table.Row selected={isSelected} onClick={() => navigate(`/invoices/${invoice.id}`)}>
      <Table.Cell onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onChange={onSelect} />
      </Table.Cell>
      <Table.Cell>
        <span className="font-bold text-primary hover:underline">#{invoice.invoice_number}</span>
      </Table.Cell>
      <Table.Cell>
        <span className="font-medium text-textPrimary">{invoice.clients?.company_name}</span>
      </Table.Cell>
      <Table.Cell>
        <span className="font-black text-textPrimary">${invoice.total_amount?.toLocaleString()}</span>
      </Table.Cell>
      <Table.Cell>
        <InvoiceStatusBadge status={isOverdue ? 'overdue' : invoice.status} size="sm" />
      </Table.Cell>
      <Table.Cell>
        <span className="text-xs text-textSecondary">{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</span>
      </Table.Cell>
      <Table.Cell>
        <span className={`text-xs font-medium ${isOverdue ? 'text-error' : 'text-textSecondary'}`}>
          {format(new Date(invoice.due_date), 'MMM d, yyyy')}
        </span>
      </Table.Cell>
      <Table.Cell>
        <span className="text-xs text-textSecondary">{invoice.users?.first_name}</span>
      </Table.Cell>
      <Table.Cell align="right" onClick={(e) => e.stopPropagation()}>
        <Dropdown trigger={<button className="p-1.5 hover:bg-surface rounded-md text-textMuted"><MoreHorizontal size={16} /></button>} align="right">
          <Dropdown.Item icon={<ExternalLink size={14} />} onClick={() => navigate(`/invoices/${invoice.id}`)}>View</Dropdown.Item>
          <Dropdown.Item icon={<Download size={14} />}>Download PDF</Dropdown.Item>
          {invoice.status === 'draft' && <Dropdown.Item icon={<Send size={14} />}>Send to Client</Dropdown.Item>}
          {['sent', 'partially_paid'].includes(invoice.status) && (
            <Dropdown.Item icon={<CreditCard size={14} />}>Record Payment</Dropdown.Item>
          )}
          <Dropdown.Divider />
          {invoice.status === 'draft' && <Dropdown.Item danger icon={<Trash2 size={14} />}>Delete</Dropdown.Item>}
        </Dropdown>
      </Table.Cell>
    </Table.Row>
  );
};
