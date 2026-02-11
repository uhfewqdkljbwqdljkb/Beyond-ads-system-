import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  GripVertical, 
  DollarSign, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { Button, Card, Table, Badge, Modal, Input, Select, Textarea, Toggle } from '../../components/ui';
import { useServices } from '../../hooks/useSettings';
import { useToast } from '../../components/ui/Toast';

const ServicesSettings: React.FC = () => {
  const { data: services, isLoading } = useServices();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-textPrimary">Services Catalog</h1>
          <p className="text-sm text-textSecondary">Offerings and default rate cards for your deals</p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Add Service</Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row hover={false}>
              <Table.HeaderCell width="40px"></Table.HeaderCell>
              <Table.HeaderCell>Service Name</Table.HeaderCell>
              <Table.HeaderCell>Default Price</Table.HeaderCell>
              <Table.HeaderCell>Pricing Model</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell align="right"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {services?.map((s: any) => (
              <Table.Row key={s.id}>
                <Table.Cell><GripVertical size={16} className="text-textMuted cursor-grab" /></Table.Cell>
                <Table.Cell>
                  <div>
                    <p className="font-bold text-textPrimary">{s.name}</p>
                    <p className="text-[10px] text-textSecondary italic line-clamp-1">{s.description || 'No description provided.'}</p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-mono font-bold text-textPrimary">${s.default_price?.toLocaleString() || '-'}</span>
                </Table.Cell>
                <Table.Cell>
                   <Badge variant="primary" size="sm">{s.pricing_type?.replace('_', ' ')}</Badge>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Agency Service" size="md">
        <form className="space-y-6">
           <Input label="Service Name" required placeholder="e.g. SEO Audit & Strategy" />
           <Textarea label="Description" placeholder="What does this include?" rows={3} />
           <div className="grid grid-cols-2 gap-4">
              <Input label="Default Price" type="number" leftIcon={<DollarSign size={16} />} />
              <Select 
                label="Pricing Type" 
                options={[
                  {label: 'One-time', value: 'one_time'},
                  {label: 'Monthly Retainer', value: 'monthly'},
                  {label: 'Hourly Rate', value: 'hourly'},
                  {label: 'Custom/Quote', value: 'custom'}
                ]} 
                value="one_time" 
                onChange={() => {}} 
              />
           </div>
           <Toggle label="Active and available for new deals" checked={true} onChange={() => {}} />
           <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create Service</Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesSettings;