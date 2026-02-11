import React, { useState } from 'react';
import { Modal, Button, Input, Select, DatePicker, Textarea } from '../ui';
import { useCreateClient } from '../../hooks/useClients';
import { useIndustries } from '../../hooks/useSettings';
import { useUsers } from '../../hooks/useUsers';
import { useAuthStore } from '../../store/authStore';
import { ChevronRight, ArrowLeft, Building2, UserCircle, CreditCard } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const currentUser = useAuthStore(s => s.user);
  const createClient = useCreateClient();
  const { data: industries } = useIndustries();
  const { data: usersData } = useUsers();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    industry_id: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_email: '',
    contact_phone: '',
    billing_email: '',
    billing_address_line1: '',
    billing_city: '',
    billing_country: '',
    tax_id: '',
    contract_start_date: '',
    contract_end_date: '',
    original_salesperson_id: currentUser?.id || ''
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    try {
      await createClient.mutateAsync({
        ...formData,
        status: 'active',
        lifetime_value: 0,
        total_deals: 0
      });
      onClose();
      setStep(1);
    } catch (err) {}
  };

  const industryOptions = industries?.map(i => ({ value: i.id, label: i.name })) || [];
  const salespersonOptions = usersData?.data?.map(u => ({ value: u.id, label: `${u.first_name} ${u.last_name}` })) || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create Client Account" 
      currentStep={step} 
      totalSteps={3} 
      size="md"
    >
      <div className="min-h-[340px] flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-primary" />
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Organization Details</span>
              </div>
              <Input 
                label="Company Name" 
                required 
                value={formData.company_name} 
                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g. Acme Industries"
              />
              <Input 
                label="Website" 
                placeholder="https://company.com"
                value={formData.website} 
                onChange={e => setFormData({ ...formData, website: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Industry" 
                  options={industryOptions} 
                  value={formData.industry_id} 
                  onChange={val => setFormData({ ...formData, industry_id: val })}
                />
                <Select 
                  label="Owner (AE)" 
                  options={salespersonOptions} 
                  value={formData.original_salesperson_id} 
                  onChange={val => setFormData({ ...formData, original_salesperson_id: val })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <UserCircle size={16} className="text-primary" />
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Primary Decision Maker</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="First Name" 
                  value={formData.contact_first_name} 
                  onChange={e => setFormData({ ...formData, contact_first_name: e.target.value })}
                  placeholder="John"
                />
                <Input 
                  label="Last Name" 
                  value={formData.contact_last_name} 
                  onChange={e => setFormData({ ...formData, contact_last_name: e.target.value })}
                  placeholder="Smith"
                />
              </div>
              <Input 
                label="Contact Email" 
                type="email" 
                required 
                value={formData.contact_email} 
                onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="john@acme.com"
              />
              <Input 
                label="Phone" 
                value={formData.contact_phone} 
                onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+1..."
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-primary" />
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Contract & Finance</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DatePicker 
                  label="Start Date" 
                  value={formData.contract_start_date} 
                  onChange={val => setFormData({ ...formData, contract_start_date: val })}
                />
                <DatePicker 
                  label="End Date (Opt)" 
                  value={formData.contract_end_date} 
                  onChange={val => setFormData({ ...formData, contract_end_date: val })}
                />
              </div>
              <Input 
                label="Billing Email" 
                type="email"
                value={formData.billing_email} 
                onChange={e => setFormData({ ...formData, billing_email: e.target.value })}
                placeholder="finance@acme.com"
              />
              <Input 
                label="Tax ID / VAT" 
                value={formData.tax_id} 
                onChange={e => setFormData({ ...formData, tax_id: e.target.value })}
                placeholder="Optional"
              />
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={prev} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
              <ArrowLeft size={14} /> Back
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <Button onClick={next} rightIcon={<ChevronRight size={16} />}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={createClient.isPending}>Onboard Client</Button>
          )}
        </div>
      </div>
    </Modal>
  );
};