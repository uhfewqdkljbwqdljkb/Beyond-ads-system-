
import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../ui';
import { useCreateLead } from '../../hooks/useLeads';
import { useUsers } from '../../hooks/useUsers';
import { useLeadSources } from '../../hooks/useSettings';
import { useToast } from '../ui/Toast';
import { Mail, Phone, Globe, DollarSign } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose }) => {
  const createLead = useCreateLead();
  const { data: usersData } = useUsers({});
  const { data: leadSources } = useLeadSources();
  const toast = useToast();

  const initialFormState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
    city: '',
    country: '',
    status: 'new',
    estimated_value: '',
    lead_source_id: '',
    assigned_to: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLead.mutateAsync({
        ...formData,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : 0,
      });
      toast.success('Lead created successfully!');
      setFormData(initialFormState);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create lead');
    }
  };

  const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Lost', value: 'lost' },
  ];

  const sourceOptions = leadSources?.map((s: any) => ({ label: s.name, value: s.id })) || [];
  const userOptions = usersData?.data?.map((u: any) => ({ label: `${u.first_name} ${u.last_name}`, value: u.id })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead" size="lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Contact Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. Jane"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <Input
              label="Last Name"
              placeholder="e.g. Doe"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="jane@example.com"
              required
              leftIcon={<Mail size={16} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone"
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone size={16} />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Company Details */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Company Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="e.g. Acme Corp"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />
            <Input
              label="Website"
              placeholder="https://acme.com"
              leftIcon={<Globe size={16} />}
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="San Francisco"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="Country"
              placeholder="USA"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        {/* Lead Qualification */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Lead Qualification</h4>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
            />
            <Input
              label="Estimated Value"
              type="number"
              placeholder="0.00"
              leftIcon={<DollarSign size={16} />}
              value={formData.estimated_value}
              onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Lead Source"
              placeholder="Select source..."
              options={sourceOptions}
              value={formData.lead_source_id}
              onChange={(val) => setFormData({ ...formData, lead_source_id: val })}
            />
            <Select
              label="Assign To"
              placeholder="Select team member..."
              options={userOptions}
              value={formData.assigned_to}
              onChange={(val) => setFormData({ ...formData, assigned_to: val })}
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Additional Notes</h4>
          <Textarea
            label="Notes"
            rows={3}
            placeholder="Enter any background context or requirements..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createLead.isPending}>
            Create Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};
