
import React, { useState } from 'react';
import { Modal, Button, Select, Textarea, Checkbox } from '../ui';
import { useUpdateDeal } from '../../hooks/useDeals';
import { useToast } from '../ui/Toast';
import { XCircle, Frown } from 'lucide-react';

interface CloseLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
}

export const CloseLostModal: React.FC<CloseLostModalProps> = ({ isOpen, onClose, deal }) => {
  const toast = useToast();
  const updateDeal = useUpdateDeal();

  const [formData, setFormData] = useState({
    lost_reason: '',
    notes: '',
    keep_lead_warm: true
  });

  const lossReasons = [
    { label: 'Price too high', value: 'price' },
    { label: 'Chose competitor', value: 'competitor' },
    { label: 'No budget', value: 'no_budget' },
    { label: 'Bad timing', value: 'timing' },
    { label: 'No response / Ghosted', value: 'ghosted' },
    { label: 'Went in-house', value: 'in_house' },
    { label: 'Other', value: 'other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lost_reason) {
      toast.error('Please select a loss reason');
      return;
    }

    try {
      await updateDeal.mutateAsync({
        id: deal.id,
        status: 'lost',
        lost_reason: formData.lost_reason,
        lost_notes: formData.notes,
        closed_at: new Date().toISOString()
      });
      toast.info(`Deal "${deal.name}" marked as Lost.`);
      onClose();
    } catch (err) {}
  };

  if (!deal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="❌ Close Deal as LOST" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center py-4">
           <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
             <Frown size={32} />
           </div>
           <h3 className="text-lg font-bold text-textPrimary">Tough break...</h3>
           <p className="text-sm text-textSecondary">Help us improve by sharing why we lost <span className="font-bold text-textPrimary">{deal.name}</span></p>
        </div>

        <Select 
          label="Primary Loss Reason" 
          placeholder="Select reason..." 
          options={lossReasons}
          required
          value={formData.lost_reason}
          onChange={val => setFormData({ ...formData, lost_reason: val })}
        />

        <Textarea 
          label="Additional Details" 
          placeholder="Any feedback from the client or internal observations?" 
          rows={3}
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
           <Checkbox 
             label="Schedule follow-up task for next quarter" 
             checked={formData.keep_lead_warm} 
             onChange={val => setFormData({ ...formData, keep_lead_warm: val })}
           />
           <p className="text-[10px] text-amber-700 ml-7 mt-1 italic">We'll automatically set a reminder to check back with them.</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={updateDeal.isPending} variant="danger">
            Confirm Loss
          </Button>
        </div>
      </form>
    </Modal>
  );
};
