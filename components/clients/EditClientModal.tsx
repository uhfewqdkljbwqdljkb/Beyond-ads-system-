import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, DatePicker } from '../ui';
import { useUpdateClient } from '../../hooks/useClients';
import { useIndustries } from '../../hooks/useSettings';

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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Client Account" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Company Name" 
            required 
            value={formData.company_name} 
            onChange={e => setFormData({ ...formData, company_name: e.target.value })}
          />
          <Select 
            label="Industry" 
            options={industries?.map(i => ({ value: i.id, label: i.name })) || []} 
            value={formData.industry_id} 
            onChange={val => setFormData({ ...formData, industry_id: val })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Contact First Name" 
            value={formData.contact_first_name} 
            onChange={e => setFormData({ ...formData, contact_first_name: e.target.value })}
          />
          <Input 
            label="Contact Last Name" 
            value={formData.contact_last_name} 
            onChange={e => setFormData({ ...formData, contact_last_name: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={updateClient.isPending}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};