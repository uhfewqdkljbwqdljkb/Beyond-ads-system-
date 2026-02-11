import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../ui';
import { useCreateLead } from '../../hooks/useLeads';
import { useLeadSources, useIndustries } from '../../hooks/useSettings';
import { useUsers } from '../../hooks/useUsers';
import { useAuthStore } from '../../store/authStore';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export const AddLeadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const currentUser = useAuthStore(state => state.user);
  const createLead = useCreateLead();
  const { data: sources } = useLeadSources();
  const { data: industries } = useIndustries();
  const { data: usersData } = useUsers();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    company_name: '',
    industry_id: '',
    lead_source_id: '',
    estimated_value: '',
    assigned_to: currentUser?.id || '',
    notes: ''
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    try {
      await createLead.mutateAsync({
        ...formData,
        estimated_value: parseFloat(formData.estimated_value) || 0,
        status: 'new'
      });
      onClose();
      setStep(1);
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Lead Prospect" currentStep={step} totalSteps={3} size="md">
      <div className="min-h-[320px] flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} placeholder="Jane" />
                <Input label="Last Name" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} placeholder="Doe" />
              </div>
              <Input label="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@company.com" />
              <Input label="Phone (Optional)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1..." />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Input label="Company Name" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} placeholder="Acme Corp" />
              <Input label="Job Title" value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} placeholder="VP Sales" />
              <Select 
                label="Industry" 
                options={industries?.map((i: any) => ({ value: i.id, label: i.name })) || []} 
                value={formData.industry_id} 
                onChange={val => setFormData({...formData, industry_id: val})} 
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Lead Source" 
                  options={sources?.map((s: any) => ({ value: s.id, label: s.name })) || []} 
                  value={formData.lead_source_id} 
                  onChange={val => setFormData({...formData, lead_source_id: val})} 
                />
                <Input label="Est. Value ($)" type="number" value={formData.estimated_value} onChange={e => setFormData({...formData, estimated_value: e.target.value})} />
              </div>
              <Select 
                label="Assign To" 
                options={usersData?.data?.map((u: any) => ({ value: u.id, label: u.first_name })) || []} 
                value={formData.assigned_to} 
                onChange={val => setFormData({...formData, assigned_to: val})} 
              />
              <Textarea label="Internal Notes" rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Brief context..." />
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center">
          {step > 1 ? (
            <Button variant="subtle" onClick={prev} leftIcon={<ArrowLeft size={16} />}>Back</Button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <Button onClick={next} rightIcon={<ChevronRight size={16} />}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={createLead.isPending}>Add Lead</Button>
          )}
        </div>
      </div>
    </Modal>
  );
};