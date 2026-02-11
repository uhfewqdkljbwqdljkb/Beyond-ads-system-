import React, { useState } from 'react';
import { Modal, Button, Input, Textarea, Checkbox } from '../ui';
import { useUpdateInvoiceStatus } from '../../hooks/useInvoices';
import { useToast } from '../ui/Toast';
import { Mail, Send, FileText } from 'lucide-react';

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

export const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
  const toast = useToast();
  const updateStatus = useUpdateInvoiceStatus();
  
  const [formData, setFormData] = useState({
    to: invoice?.clients?.billing_email || invoice?.clients?.contact_email || '',
    subject: `Invoice #${invoice?.invoice_number} from Beyond Ads Agency`,
    message: `Hello ${invoice?.clients?.contact_first_name || 'there'},\n\nPlease find attached invoice #${invoice?.invoice_number} for your recent project. You can pay this invoice online via the link provided or by bank transfer.\n\nThank you for your business!`,
    attach_pdf: true
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStatus.mutateAsync({ id: invoice.id, status: 'sent' });
      toast.success(`Invoice #${invoice.invoice_number} sent to ${formData.to}`);
      onClose();
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Invoice to Client" size="lg">
      <form onSubmit={handleSend} className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Mail size={24} /></div>
          <div>
            <h4 className="text-sm font-bold text-textPrimary">Electronic Delivery</h4>
            <p className="text-xs text-textSecondary">The client will receive an email with a secure payment link.</p>
          </div>
        </div>

        <div className="space-y-4">
           <Input label="To" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} required />
           <Input label="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
           <Textarea label="Message" rows={6} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required />
           
           <div className="bg-surface p-3 rounded-lg border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-white border border-border rounded text-error"><FileText size={18} /></div>
                 <span className="text-xs font-bold text-textPrimary">{invoice?.invoice_number}.pdf</span>
              </div>
              <Checkbox label="Attach PDF" checked={formData.attach_pdf} onChange={v => setFormData({...formData, attach_pdf: v})} />
           </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={updateStatus.isPending} leftIcon={<Send size={18} />}>Send Invoice</Button>
        </div>
      </form>
    </Modal>
  );
};