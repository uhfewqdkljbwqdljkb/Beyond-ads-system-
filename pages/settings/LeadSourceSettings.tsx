import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Link2, Search } from 'lucide-react';
import { Button, Card, Table, Badge, Modal, Input, Select, Toggle } from '../../components/ui';
import { useLeadSources } from '../../hooks/useSettings';
import { useToast } from '../../components/ui/Toast';

const LeadSourceSettings: React.FC = () => {
  const { data: sources, isLoading } = useLeadSources();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { label: 'Organic', value: 'organic' },
    { label: 'Paid Ads', value: 'paid' },
    { label: 'Referral', value: 'referral' },
    { label: 'Outbound', value: 'outbound' },
    { label: 'Event', value: 'event' },
    { label: 'Partner', value: 'partner' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-textPrimary">Lead Sources</h1>
          <p className="text-sm text-textSecondary">Track where your agency's business comes from</p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Add Source</Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row hover={false}>
              <Table.HeaderCell>Source Name</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell align="right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sources?.map((s: any) => (
              <Table.Row key={s.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-light text-primary rounded-lg">
                       <Link2 size={16} />
                    </div>
                    <span className="font-bold text-textPrimary">{s.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                   <Badge variant="default" size="sm" className="capitalize">{s.category}</Badge>
                </Table.Cell>
                <Table.Cell>
                   <Toggle checked={s.is_active} onChange={() => {}} size="sm" />
                </Table.Cell>
                <Table.Cell align="right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 hover:bg-surface rounded text-textMuted"><Edit3 size={14} /></button>
                    <button className="p-1.5 hover:bg-surface rounded text-error/60 hover:text-error"><Trash2 size={14} /></button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Inbound Source" size="sm">
        <form className="space-y-6">
           <Input label="Source Name" required placeholder="e.g. LinkedIn Outreach" />
           <Select label="Category" options={categories} value="organic" onChange={() => {}} />
           <Toggle label="Active Source" checked={true} onChange={() => {}} />
           <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create Source</Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeadSourceSettings;