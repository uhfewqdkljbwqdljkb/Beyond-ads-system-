import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea, DatePicker, Checkbox } from '../ui';
import { useUpdateDeal } from '../../hooks/useDeals';
import { useClients } from '../../hooks/useClients';
import { useServices } from '../../hooks/useSettings';
import { useUsers } from '../../hooks/useUsers';
import { HandCoins } from 'lucide-react';

interface EditDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
}

export const EditDealModal: React.FC<EditDealModalProps> = ({ isOpen, onClose, deal }) => {
  const updateDeal = useUpdateDeal();
  const { data: clientsData } = useClients({ limit: 100 });
  const { data: services } = useServices();
  const { data: usersData } = useUsers();

  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    deal_value: 0,
    deal_type: '',
    expected_close_date: '',
    win_probability: 50,
    assigned_to: '',
    notes: ''
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name || '',
        client_id: deal.client_id || '',
        deal_value: deal.deal_value || 0,
        deal_type: deal.deal_type || 'one_time',
        expected_close_date: deal.expected_close_date || '',
        win_probability: deal.win_probability || 50,
        assigned_to: deal.assigned_to || '',
        notes: deal.notes || ''
      });
    }
  }, [deal, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDeal.mutateAsync({
        id: deal.id,
        ...formData,
      });
      onClose();
    } catch (err) {}
  };

  const clientOptions = clientsData?.data?.map((c: any) => ({ value: c.id, label: c.company_name })) || [];
  const repOptions = usersData?.data?.map((u: any) => ({ value: u.id, label: `${u.first_name} ${u.last_name}` })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Deal" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input 
              label="Deal Name" 
              required 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Select 
              label="Client" 
              options={clientOptions}
              value={formData.client_id}
              onChange={val => setFormData({ ...formData, client_id: val })}
              required
            />
            <Select 
              label="Deal Type" 
              options={[
                { label: 'One-time', value: 'one_time' },
                { label: 'Retainer', value: 'retainer' },
                { label: 'Contract', value: 'contract' },
              ]} 
              value={formData.deal_type}
              onChange={val => setFormData({ ...formData, deal_type: val })}
            />
          </div>
          <div className="space-y-4">
            <DatePicker 
              label="Expected Close Date" 
              value={formData.expected_close_date}
              onChange={val => setFormData({ ...formData, expected_close_date: val })}
            />
            <Input 
              label="Win Probability (%)" 
              type="number" 
              value={formData.win_probability}
              onChange={e => setFormData({ ...formData, win_probability: parseInt(e.target.value) })}
            />
            <Select 
              label="Deal Owner" 
              options={repOptions}
              value={formData.assigned_to}
              onChange={val => setFormData({ ...formData, assigned_to: val })}
            />
          </div>
        </div>

        <div className="bg-primary-light/20 p-4 rounded-xl border border-primary/10 flex items-center justify-between">
           <div>
             <label className="text-[10px] font-bold text-primary uppercase mb-1 block">Total Deal Value</label>
             <Input 
               type="number" 
               className="bg-transparent border-none text-2xl font-black p-0 focus:ring-0 w-32" 
               value={formData.deal_value}
               onChange={e => setFormData({ ...formData, deal_value: parseFloat(e.target.value) || 0 })}
             />
           </div>
           <div className="p-3 bg-primary text-white rounded-lg"><HandCoins size={24} /></div>
        </div>

        <Textarea 
          label="Internal Notes" 
          rows={3} 
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={updateDeal.isPending}>Update Deal</Button>
        </div>
      </form>
    </Modal>
  );
};