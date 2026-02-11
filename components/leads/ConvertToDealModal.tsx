import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { Modal, Button, Input, Select, Textarea, DatePicker } from '../ui';
import { useConvertToClient } from '../../hooks/useLeads';
import { useToast } from '../ui/Toast';

interface ConvertToDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export const ConvertToDealModal: React.FC<ConvertToDealModalProps> = ({ isOpen, onClose, lead }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const convertLead = useConvertToClient();

  const [formData, setFormData] = useState({
    deal_name: `${lead?.company_name || 'New Client'} - Project`,
    deal_value: lead?.estimated_value || 0,
    deal_type: 'retainer',
    initial_stage: 's1',
    expected_close: '',
    win_prob: '50',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await convertLead.mutateAsync({
        leadId: lead.id,
        data: {
          company_name: lead.company_name || 'Individual',
          contact_email: lead.email,
          industry_id: lead.industry_id,
          ...formData
        }
      });
      toast.success('Lead converted successfully');
      onClose();
      navigate('/deals');
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Convert to Deal" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-primary-light/30 border border-primary/10 p-4 rounded-xl flex items-start gap-4">
          <div className="p-2 bg-primary rounded-lg text-white"><Landmark size={24} /></div>
          <div>
            <h4 className="text-sm font-bold text-textPrimary">Convert Lead to Opportunity</h4>
            <p className="text-xs text-textSecondary">This will create a new client and a deal, and mark the lead as converted.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Deal Information</h5>
            <Input 
              label="Deal Name" 
              required 
              value={formData.deal_name}
              onChange={e => setFormData({ ...formData, deal_name: e.target.value })}
            />
            <Input 
              label="Deal Value ($)" 
              type="number" 
              required 
              value={formData.deal_value}
              onChange={e => setFormData({ ...formData, deal_value: parseFloat(e.target.value) || 0 })}
            />
            <Select 
              label="Deal Type" 
              options={[
                { label: 'One-time Project', value: 'one_time' },
                { label: 'Monthly Retainer', value: 'retainer' },
                { label: 'Annual Contract', value: 'contract' },
              ]} 
              value={formData.deal_type} 
              onChange={val => setFormData({ ...formData, deal_type: val })}
            />
          </div>
          <div className="space-y-4">
            <h5 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Pipeline Settings</h5>
            <Select 
              label="Initial Stage" 
              options={[
                { label: 'Discovery', value: 's1' },
                { label: 'Proposal', value: 's2' },
                { label: 'Negotiation', value: 's3' },
              ]} 
              value={formData.initial_stage} 
              onChange={val => setFormData({ ...formData, initial_stage: val })}
            />
            <DatePicker 
              label="Expected Close Date" 
              value={formData.expected_close} 
              onChange={val => setFormData({ ...formData, expected_close: val })}
            />
            <Select 
              label="Win Prob." 
              options={[
                { label: '10% (Low)', value: '10' },
                { label: '25% (Growing)', value: '25' },
                { label: '50% (Average)', value: '50' },
                { label: '75% (High)', value: '75' },
              ]} 
              value={formData.win_prob} 
              onChange={val => setFormData({ ...formData, win_prob: val })}
            />
          </div>
        </div>

        <Textarea 
          label="Transition Notes" 
          placeholder="Any specific details for the account manager?" 
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="pt-6 flex justify-end gap-3 border-t border-border bg-white sticky bottom-0">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={convertLead.isPending}>Create Deal & Client</Button>
        </div>
      </form>
    </Modal>
  );
};