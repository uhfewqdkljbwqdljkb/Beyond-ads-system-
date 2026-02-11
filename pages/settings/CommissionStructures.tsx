
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  BadgePercent, 
  Zap,
  Info,
  Layers,
  HandCoins
} from 'lucide-react';
// Fix: Added Textarea to the UI components import
import { Button, Card, Badge, Modal, Input, Select, Checkbox, Table, Textarea } from '../../components/ui';
import { useCommissionStructures, useCreateCommissionStructure } from '../../hooks/useCommissionStructures';
import { useToast } from '../../components/ui/Toast';

const CommissionStructures: React.FC = () => {
  const { data: structures, isLoading } = useCommissionStructures();
  const createStructure = useCreateCommissionStructure();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'flat_percentage',
    trigger_event: 'on_invoice_paid',
    base_rate: 10,
    applies_to: 'all',
    recurring: false,
    clawback: false
  });

  const [tiers, setTiers] = useState([
    { min: 0, max: 10000, rate: 8 },
    { min: 10001, max: 25000, rate: 10 },
    { min: 25001, max: null, rate: 12 }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStructure.mutateAsync(formData);
      setIsModalOpen(false);
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-textPrimary">Commission Structures</h1>
          <p className="text-sm text-textSecondary">Define how your team earns on closed deals</p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Create Structure</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {structures?.map((s: any) => (
          <Card key={s.id} hover title={s.name} headerAction={<Badge variant="primary">{s.type?.replace('_', ' ')}</Badge>}>
            <div className="space-y-4">
              <p className="text-sm text-textSecondary line-clamp-2">{s.description || 'Standard payout rule for sales representatives.'}</p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                 <div className="flex items-center gap-1.5 text-xs font-bold text-textPrimary">
                   <BadgePercent size={14} className="text-primary" /> {s.base_rate}% Base Rate
                 </div>
                 <div className="flex items-center gap-1.5 text-xs font-bold text-textPrimary">
                   <Zap size={14} className="text-amber-500" /> {s.trigger_event?.replace('on_', '').replace('_', ' ')}
                 </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-[10px] text-textMuted font-bold uppercase">
                   <Layers size={12} /> Used by 12 Reps
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" size="sm">Edit</Button>
                   <Button variant="ghost" size="sm" className="text-error">Delete</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {!structures?.length && !isLoading && (
          <div className="lg:col-span-2 py-20 text-center bg-surface rounded-2xl border border-dashed border-border">
             <BadgePercent size={48} className="mx-auto text-textMuted mb-4" />
             <p className="text-textSecondary italic">No structures defined yet.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Define Payout Logic" size="xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">General Settings</h4>
            <Input label="Structure Name" placeholder="e.g. Senior Rep - Tiered Performance" required />
            <Textarea label="Description" rows={2} />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Commission Logic</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Structure Type" 
                options={[
                  {label: 'Flat Percentage', value: 'flat_percentage'},
                  {label: 'Tiered (By Revenue)', value: 'tiered'},
                  {label: 'Flat Fee per Deal', value: 'flat_fee'},
                ]} 
                value={formData.type} 
                onChange={(v) => setFormData({...formData, type: v})} 
              />
              <Select 
                label="Trigger Event" 
                options={[
                  {label: 'On Deal Won', value: 'on_deal_close'},
                  {label: 'On Invoice Paid', value: 'on_invoice_paid'},
                ]} 
                value={formData.trigger_event} 
                onChange={(v) => setFormData({...formData, trigger_event: v})} 
              />
            </div>

            {formData.type === 'flat_percentage' ? (
              <Input label="Commission Rate (%)" type="number" defaultValue="10" leftIcon={<HandCoins size={16} />} />
            ) : formData.type === 'tiered' ? (
              <div className="border border-border rounded-xl overflow-hidden mt-2">
                <Table>
                  <Table.Header>
                    <Table.Row hover={false}>
                      <Table.HeaderCell>Min Revenue</Table.HeaderCell>
                      <Table.HeaderCell>Max Revenue</Table.HeaderCell>
                      <Table.HeaderCell>Rate %</Table.HeaderCell>
                      <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {tiers.map((t, idx) => (
                      <Table.Row key={idx} hover={false}>
                        <Table.Cell><Input value={t.min} size={1} className="w-24 border-none bg-surface/50" /></Table.Cell>
                        <Table.Cell><Input value={t.max === null ? '∞' : t.max} className="w-24 border-none bg-surface/50" /></Table.Cell>
                        <Table.Cell><Input value={t.rate} className="w-16 border-none bg-surface/50" /></Table.Cell>
                        <Table.Cell align="right"><button type="button" className="text-textMuted hover:text-error"><Trash2 size={14} /></button></Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <button type="button" className="w-full py-2 bg-surface text-[10px] font-bold text-primary hover:bg-primary-light transition-colors">+ ADD TIER</button>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Policies & Duration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
               <Checkbox label="Recurring Commission (SaaS/Retainer)" checked={formData.recurring} onChange={(v) => setFormData({...formData, recurring: v})} />
               {formData.recurring && <Select options={[{label: '12 Months', value: '12'}, {label: 'Lifetime', value: '0'}]} value="12" onChange={() => {}} />}
               
               <Checkbox label="Clawback Policy enabled" checked={formData.clawback} onChange={(v) => setFormData({...formData, clawback: v})} />
               {formData.clawback && <Input type="number" label="Clawback window (days)" defaultValue="30" />}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
             <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button type="submit">Save Structure</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CommissionStructures;
