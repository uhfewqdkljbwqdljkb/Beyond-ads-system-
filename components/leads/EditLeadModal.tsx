import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../ui';
import { useUpdateLead } from '../../hooks/useLeads';
import { useLeadSources, useIndustries } from '../../hooks/useSettings';
import { useUsers } from '../../hooks/useUsers';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({ isOpen, onClose, lead }) => {
  const updateLead = useUpdateLead();
  const { data: sources } = useLeadSources();
  const { data: industries } = useIndustries();
  const { data: usersData } = useUsers();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    company_name: '',
    website: '',
    industry_id: '',
    company_size: '',
    lead_source_id: '',
    estimated_value: '',
    assigned_to: '',
    notes: ''
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        first_name: lead.first_name || '',
        last_name: lead.last_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        job_title: lead.job_title || '',
        company_name: lead.company_name || '',
        website: lead.website || '',
        industry_id: lead.industry_id || '',
        company_size: lead.company_size || '',
        lead_source_id: lead.lead_source_id || '',
        estimated_value: lead.estimated_value?.toString() || '',
        assigned_to: lead.assigned_to || '',
        notes: lead.notes || ''
      });
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateLead.mutateAsync({
        id: lead.id,
        ...formData,
        estimated_value: parseFloat(formData.estimated_value) || 0,
      });
      onClose();
    } catch (err) {}
  };

  const sourceOptions = sources?.map(s => ({ value: s.id, label: s.name })) || [];
  const industryOptions = industries?.map(i => ({ value: i.id, label: i.name })) || [];
  const repOptions = usersData?.data?.map(u => ({ value: u.id, label: `${u.first_name} ${u.last_name}` })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Lead" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="First Name" 
            required 
            value={formData.first_name} 
            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
          />
          <Input 
            label="Last Name" 
            value={formData.last_name} 
            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
          />
          <Input 
            label="Email" 
            type="email" 
            required 
            value={formData.email} 
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <Input 
            label="Phone" 
            value={formData.phone} 
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-6">
          <Input 
            label="Company" 
            value={formData.company_name} 
            onChange={e => setFormData({ ...formData, company_name: e.target.value })}
          />
          <Input 
            label="Job Title" 
            value={formData.job_title} 
            onChange={e => setFormData({ ...formData, job_title: e.target.value })}
          />
          <Select 
            label="Industry" 
            options={industryOptions} 
            value={formData.industry_id} 
            onChange={val => setFormData({ ...formData, industry_id: val })}
          />
          <Select 
            label="Lead Source" 
            options={sourceOptions} 
            value={formData.lead_source_id} 
            onChange={val => setFormData({ ...formData, lead_source_id: val })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-6">
          <Input 
            label="Value ($)" 
            type="number" 
            value={formData.estimated_value} 
            onChange={e => setFormData({ ...formData, estimated_value: e.target.value })}
          />
          <Select 
            label="Assigned To" 
            options={repOptions} 
            value={formData.assigned_to} 
            onChange={val => setFormData({ ...formData, assigned_to: val })}
          />
          <Textarea 
            label="Notes" 
            className="md:col-span-2" 
            value={formData.notes} 
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={updateLead.isPending}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};