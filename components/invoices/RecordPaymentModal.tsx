
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, DatePicker, Select, Textarea } from '../ui';
import { invoiceService } from '../../services/invoiceService';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../ui/Toast';
import { CreditCard, DollarSign } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose, invoice }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const outstanding = Number(invoice?.total_amount || 0) - Number(invoice?.amount_paid || 0);

  const [formData, setFormData] = useState({
    amount: outstanding,
    date: new Date().toISOString().split('T')[0],
    method: 'Bank Transfer',
    reference: '',
    notes: ''
  });

  useEffect(() => {
    if (invoice) setFormData(prev => ({ ...prev, amount: outstanding }));
  }, [invoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await invoiceService.recordPayment(invoice.id, {
        amount: formData.amount,
        payment_date: formData.date,
        payment_method: formData.method,
        payment_reference: formData.reference,
        notes: formData.notes,
        recorded_by: 'u1' // Mock current user
      });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Payment recorded successfully');
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface p-4 rounded-xl border border-border grid grid-cols-2 gap-4">
           <div>
              <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">Total Outstanding</p>
              <p className="text-xl font-black text-textPrimary">${outstanding.toLocaleString()}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">Remaining After</p>
              <p className="text-xl font-black text-primary">${Math.max(0, outstanding - formData.amount).toLocaleString()}</p>
           </div>
        </div>

        <div className="space-y-4">
           <Input 
             label="Payment Amount ($)" 
             type="number" 
             required 
             max={outstanding}
             value={formData.amount}
             onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
           />
           <div className="grid grid-cols-2 gap-4">
              <DatePicker label="Payment Date" required value={formData.date} onChange={v => setFormData({...formData, date: v})} />
              <Select 
                label="Method" 
                options={[
                  {label: 'Bank Transfer', value: 'Bank Transfer'},
                  {label: 'Credit Card', value: 'Credit Card'},
                  {label: 'Check', value: 'Check'},
                  {label: 'Cash', value: 'Cash'}
                ]} 
                value={formData.method} 
                onChange={v => setFormData({...formData, method: v})} 
              />
           </div>
           <Input label="Reference / Transaction ID" placeholder="e.g. TXN-98210" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} />
           <Textarea label="Notes" rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<DollarSign size={18} />}>Record Payment</Button>
        </div>
      </form>
    </Modal>
  );
};
