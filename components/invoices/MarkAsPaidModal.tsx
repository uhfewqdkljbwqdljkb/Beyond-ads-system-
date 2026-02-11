
import React, { useState } from 'react';
import { Modal, Button, DatePicker, Select, Input, Textarea } from '../ui';
import { useMarkInvoicePaid } from '../../hooks/useInvoices';
import { useToast } from '../ui/Toast';
import { CheckCircle } from 'lucide-react';

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

export const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({ isOpen, onClose, invoice }) => {
  const toast = useToast();
  const markPaid = useMarkInvoicePaid();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    method: 'Bank Transfer',
    reference: '',
    notes: ''
  });

  const handleMark = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await markPaid.mutateAsync({
        id: invoice.id,
        paymentData: {
          amount: invoice.total_amount,
          method: formData.method,
          reference: formData.reference,
          date: formData.date
        }
      });
      toast.success('Invoice marked as fully paid');
      onClose();
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark as Fully Paid" size="md">
      <form onSubmit={handleMark} className="space-y-6">
        <div className="text-center py-4">
           <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
             <CheckCircle size={32} />
           </div>
           <h3 className="text-lg font-bold text-textPrimary">Complete Payment</h3>
           <p className="text-sm text-textSecondary">Recording full payment of <span className="font-black text-textPrimary">${invoice?.total_amount?.toLocaleString()}</span></p>
        </div>

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

        <Input label="Reference / Transaction ID" placeholder="Optional" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} />
        <Textarea label="Notes" rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />

        <div className="pt-4 flex justify-end gap-3 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={markPaid.isPending} className="bg-emerald-600 hover:bg-emerald-700">Confirm Payment</Button>
        </div>
      </form>
    </Modal>
  );
};
