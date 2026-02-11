import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, DatePicker, Textarea } from '../ui';
import { useUpdateClient } from '../../hooks/useClients';
import { useIndustries } from '../../hooks/useSettings';
import { Building2, UserCircle, CreditCard } from 'lucide-react';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, client }) => {
  const updateClient = useUpdateClient();
  const { data: industries } = useIndustries();

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
    contract_end_date: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client.company_name || '',
        website: client.website || '',
        industry_id: client.industry_id || '',
        contact_first_name: client.contact_first_name || '',
        contact_last_name: client.contact_last_name || '',
        contact_email: client.contact_email || '',
        contact_phone: client.contact_phone || '',
        billing_email: client.billing_email || '',
        billing_address_line1: client.billing_address_line1 || '',
        billing_city: client.billing_city || '',
        billing_country: client.billing_country || '',
        tax_id: client.tax_id || '',
        contract_start_date: client.contract_start_date || '',
        contract_end_date: client.contract_end_date || ''
      });
    }
  }, [client, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateClient.mutateAsync({ id: client.id, ...formData });
      onClose();
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Account Profile" size="xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                <Building2 size={16} className="text-primary" />
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Organization</span>
              </div>
              <Input 
                label="Company Name" 
                required 
                value={formData.company_name} 
                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
              />
              <Input 
                label="Website" 
                value={formData.website} 
                onChange={e => setFormData({ ...formData, website: e.target.value })}
              />
              <Select 
                label="Industry" 
                options={industries?.map(i => ({ value: i.id, label: i.name })) || []} 
                value={formData.industry_id} 
                onChange={val => setFormData({ ...formData, industry_id: val })}
              />
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                <UserCircle size={16} className="text-primary" />
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Primary Contact</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="First Name" 
                  value={formData.contact_first_name} 
                  onChange={e => setFormData({ ...formData, contact_first_name: e.target.value })}
                />
                <Input 
                  label="Last Name" 
                  value={formData.contact_last_name} 
                  onChange={e => setFormData({ ...formData, contact_last_name: e.target.value })}
                />
              </div>
              <Input 
                label="Contact Email" 
                value={formData.contact_email} 
                onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
              />
           </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-50 pb-2">
            <CreditCard size={16} className="text-primary" />
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Billing & Compliance</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Input 
               label="Billing Email" 
               value={formData.billing_email} 
               onChange={e => setFormData({ ...formData, billing_email: e.target.value })}
             />
             <Input 
               label="Tax ID" 
               value={formData.tax_id} 
               onChange={e => setFormData({ ...formData, tax_id: e.target.value })}
             />
             <DatePicker 
               label="Contract End" 
               value={formData.contract_end_date} 
               onChange={val => setFormData({ ...formData, contract_end_date: val })}
             />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 sticky bottom-0 bg-white">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={updateClient.isPending}>Save Profile</Button>
        </div>
      </form>
    </Modal>
  );
};