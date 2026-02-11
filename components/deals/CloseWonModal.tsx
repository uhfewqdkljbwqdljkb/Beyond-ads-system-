
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, DatePicker, Checkbox, Textarea, StatCard } from '../ui';
import { useUpdateDeal } from '../../hooks/useDeals';
import { useToast } from '../ui/Toast';
import { Trophy, CheckCircle, Receipt } from 'lucide-react';

interface CloseWonModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
}

export const CloseWonModal: React.FC<CloseWonModalProps> = ({ isOpen, onClose, deal }) => {
  const toast = useToast();
  const updateDeal = useUpdateDeal();

  const [formData, setFormData] = useState({
    final_value: 0,
    close_date: new Date().toISOString().split('T')[0],
    notes: '',
    generate_invoice: true,
    contract_signed: true
  });

  useEffect(() => {
    if (deal) {
      setFormData(prev => ({ ...prev, final_value: deal.deal_value }));
    }
  }, [deal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDeal.mutateAsync({
        id: deal.id,
        status: 'won',
        deal_value: formData.final_value,
        actual_close_date: formData.close_date,
        won_notes: formData.notes,
        closed_at: new Date().toISOString()
      });
      toast.success(`Deal "${deal.name}" closed as WON!`);
      onClose();
    } catch (err) {}
  };

  if (!deal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏆 Close Deal as WON" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center py-4">
           <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
             <Trophy size={32} />
           </div>
           <h3 className="text-lg font-bold text-textPrimary">Congratulations!</h3>
           <p className="text-sm text-textSecondary">Confirm the final details for <span className="font-bold text-textPrimary">{deal.name}</span></p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Input 
             label="Final Deal Value ($)" 
             type="number" 
             required 
             value={formData.final_value}
             onChange={e => setFormData({ ...formData, final_value: parseFloat(e.target.value) || 0 })}
           />
           <DatePicker 
             label="Actual Close Date" 
             required 
             value={formData.close_date}
             onChange={val => setFormData({ ...formData, close_date: val })}
           />
        </div>

        <div className="space-y-3 bg-surface p-4 rounded-xl border border-border">
           <Checkbox 
             label="Contract Signed & Executed" 
             checked={formData.contract_signed} 
             onChange={val => setFormData({ ...formData, contract_signed: val })}
           />
           <Checkbox 
             label="Generate first draft invoice automatically" 
             checked={formData.generate_invoice} 
             onChange={val => setFormData({ ...formData, generate_invoice: val })}
           />
        </div>

        <Textarea 
          label="Win Notes" 
          placeholder="What were the key factors in winning this deal?" 
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={updateDeal.isPending} className="bg-emerald-600 hover:bg-emerald-700">
            Confirm Win
          </Button>
        </div>
      </form>
    </Modal>
  );
};
