
import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea, Checkbox } from '../ui';
import { useCreateLead } from '../../hooks/useLeads';
import { useAddLeadsToGroup } from '../../hooks/useLeadGroups';
import { useAuthStore } from '../../store/authStore';
import { useUsers } from '../../hooks/useUsers';

interface AddLeadManuallyModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

export const AddLeadManuallyModal: React.FC<AddLeadManuallyModalProps> = ({ isOpen, onClose, groupId, groupName }) => {
  const { user } = useAuthStore();
  const createLead = useCreateLead();
  const addLeadToGroup = useAddLeadsToGroup();
  const { data: usersData } = useUsers();

  const [addAnother, setAddAnother] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    job_title: '',
    website: '',
    country: '',
    city: '',
    estimated_value: '',
    status: 'new',
    assigned_to: user?.id || '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Create Lead
      const newLead = await createLead.mutateAsync({
        ...formData,
        estimated_value: parseFloat(formData.estimated_value) || 0,
        lead_score: 0
      });

      // 2. Add to Group
      if (newLead?.id) {
        await addLeadToGroup.mutateAsync({
          groupId,
          leadIds: [newLead.id],
          userId: user?.id
        });
      }

      if (addAnother) {
        setFormData({
          first_name: '', last_name: '', email: '', phone: '', company_name: '',
          job_title: '', website: '', country: '', city: '', estimated_value: '',
          status: 'new', assigned_to: user?.id || '', notes: ''
        });
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const repOptions = usersData?.data?.map((u: any) => ({ value: u.id, label: `${u.first_name} ${u.last_name}` })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add New Lead to "${groupName}"`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-1">Personal Info</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            <Input label="Last Name" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <Input label="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>

        {/* Company Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-1">Company Info</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
            <Input label="Job Title" value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} />
          </div>
          <Input label="Website" placeholder="https://" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-1">Lead Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Estimated Value ($)" type="number" value={formData.estimated_value} onChange={e => setFormData({...formData, estimated_value: e.target.value})} />
            <Select 
              label="Status" 
              options={['new', 'contacted', 'qualified', 'nurturing', 'unqualified'].map(s => ({label: s.charAt(0).toUpperCase() + s.slice(1), value: s}))}
              value={formData.status} 
              onChange={val => setFormData({...formData, status: val})} 
            />
          </div>
          <Select 
            label="Assigned To" 
            options={repOptions} 
            value={formData.assigned_to} 
            onChange={val => setFormData({...formData, assigned_to: val})} 
          />
          <Textarea label="Notes" rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Checkbox label="Add another lead after saving" checked={addAnother} onChange={setAddAnother} />
          <div className="flex gap-2">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={createLead.isPending || addLeadToGroup.isPending}>Save Lead</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
