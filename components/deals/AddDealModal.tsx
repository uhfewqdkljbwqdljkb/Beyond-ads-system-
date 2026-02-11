
import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea, DatePicker } from '../ui';
import { useCreateDeal } from '../../hooks/useDeals';
import { useClients } from '../../hooks/useClients';
import { usePipelineStages } from '../../hooks/usePipeline';
import { useUsers } from '../../hooks/useUsers';
import { useToast } from '../ui/Toast';
import { DollarSign } from 'lucide-react';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDealModal: React.FC<AddDealModalProps> = ({ isOpen, onClose }) => {
  const createDeal = useCreateDeal();
  const { data: clientsData } = useClients({ limit: 100 });
  const { data: stages } = usePipelineStages();
  const { data: usersData } = useUsers({});
  const toast = useToast();

  const initialFormState = {
    name: '',
    client_id: '',
    deal_value: '',
    deal_type: 'project',
    pipeline_stage_id: '',
    expected_close_date: '',
    win_probability: 50,
    assigned_to: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDeal.mutateAsync({
        ...formData,
        deal_value: parseFloat(formData.deal_value) || 0,
        win_probability: Number(formData.win_probability),
      });
      toast.success('Deal created successfully!');
      setFormData(initialFormState);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create deal');
    }
  };

  const dealTypeOptions = [
    { label: 'Project', value: 'project' },
    { label: 'Retainer', value: 'retainer' },
    { label: 'Hybrid', value: 'hybrid' },
  ];

  const clientOptions = clientsData?.data?.map((c: any) => ({ label: c.company_name, value: c.id })) || [];
  const stageOptions = stages?.map((s: any) => ({ label: s.name, value: s.id })) || [];
  const userOptions = usersData?.data?.map((u: any) => ({ label: `${u.first_name} ${u.last_name}`, value: u.id })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Deal" size="lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Deal Information */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Deal Information</h4>
          <Input
            label="Deal Name"
            placeholder="e.g. Q4 Marketing Campaign"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Client"
              placeholder="Select client..."
              required
              options={clientOptions}
              value={formData.client_id}
              onChange={(val) => setFormData({ ...formData, client_id: val })}
            />
            <Select
              label="Deal Type"
              required
              options={dealTypeOptions}
              value={formData.deal_type}
              onChange={(val) => setFormData({ ...formData, deal_type: val })}
            />
          </div>
        </div>

        {/* Financials */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Financials & Stage</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deal Value"
              type="number"
              placeholder="0.00"
              required
              leftIcon={<DollarSign size={16} />}
              value={formData.deal_value}
              onChange={(e) => setFormData({ ...formData, deal_value: e.target.value })}
            />
            <Select
              label="Pipeline Stage"
              placeholder="Select stage..."
              required
              options={stageOptions}
              value={formData.pipeline_stage_id}
              onChange={(val) => setFormData({ ...formData, pipeline_stage_id: val })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Win Probability (%)"
              type="number"
              min={0}
              max={100}
              value={formData.win_probability}
              onChange={(e) => setFormData({ ...formData, win_probability: Number(e.target.value) })}
            />
            <DatePicker
              label="Expected Close Date"
              value={formData.expected_close_date}
              onChange={(val) => setFormData({ ...formData, expected_close_date: val })}
            />
          </div>
        </div>

        {/* Assignment */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Assignment</h4>
          <Select
            label="Deal Owner"
            placeholder="Select owner..."
            options={userOptions}
            value={formData.assigned_to}
            onChange={(val) => setFormData({ ...formData, assigned_to: val })}
          />
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Notes</h4>
          <Textarea
            label="Description"
            rows={3}
            placeholder="Enter deal details, scope, or requirements..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createDeal.isPending}>
            Create Deal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
