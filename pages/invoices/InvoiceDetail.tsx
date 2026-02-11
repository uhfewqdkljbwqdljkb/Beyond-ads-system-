
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Send, CreditCard, 
  Trash2, Edit3, CheckCircle, FileText,
  Clock, History, User, Building2, ExternalLink,
  // Added MoreHorizontal to icons import
  ChevronRight, AlertTriangle, Printer, MoreHorizontal
} from 'lucide-react';

import { 
  Card, Button, Badge, Spinner, 
  EmptyState, Avatar, Dropdown, Table
} from '../../components/ui';
import { InvoiceStatusBadge } from '../../components/invoices/InvoiceStatusBadge';
import { InvoicePreview } from '../../components/invoices/InvoicePreview';
import { useInvoice, useMarkInvoicePaid } from '../../hooks/useInvoices';
import { format, isAfter } from 'date-fns';

// Modals
import { SendInvoiceModal } from '../../components/invoices/SendInvoiceModal';
import { MarkAsPaidModal } from '../../components/invoices/MarkAsPaidModal';
import { RecordPaymentModal } from '../../components/invoices/RecordPaymentModal';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: invoice, isLoading, isError } = useInvoice(id!);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (isError || !invoice) return <EmptyState icon={<FileText />} title="Invoice not found" description="This invoice might have been deleted." />;

  const isOverdue = invoice.status === 'sent' && isAfter(new Date(), new Date(invoice.due_date));
  const outstanding = Number(invoice.total_amount) - Number(invoice.amount_paid || 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/invoices')} className="bg-white border border-border">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-textPrimary leading-none">Invoice #{invoice.invoice_number}</h1>
              <InvoiceStatusBadge status={isOverdue ? 'overdue' : invoice.status} />
            </div>
            <p className="text-sm text-textSecondary mt-2 flex items-center gap-2">
               Created by <span className="font-bold">{invoice.users?.first_name} {invoice.users?.last_name}</span> on {format(new Date(invoice.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {invoice.status === 'draft' && (
            <>
              <Button variant="outline" leftIcon={<Edit3 size={18} />}>Edit Draft</Button>
              <Button variant="primary" leftIcon={<Send size={18} />} onClick={() => setActiveModal('send')}>Send to Client</Button>
            </>
          )}
          {['sent', 'partially_paid', 'overdue'].includes(invoice.status) && (
             <>
               <Button variant="outline" leftIcon={<Send size={18} />}>Send Reminder</Button>
               <Button variant="primary" leftIcon={<CreditCard size={18} />} onClick={() => setActiveModal('payment')}>Record Payment</Button>
             </>
          )}
          <Dropdown trigger={<Button variant="ghost" className="bg-white border border-border p-2"><MoreHorizontal size={20} /></Button>} align="right">
            <Dropdown.Item icon={<Download size={14} />}>Download PDF</Dropdown.Item>
            <Dropdown.Item icon={<Printer size={14} />}>Print Invoice</Dropdown.Item>
            <Dropdown.Divider />
            {invoice.status === 'draft' && <Dropdown.Item danger icon={<Trash2 size={14} />}>Delete Invoice</Dropdown.Item>}
          </Dropdown>
        </div>
      </div>

      {isOverdue && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4 animate-pulse">
           <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
           <p className="text-sm text-red-700 font-medium">
             This invoice is <span className="font-black underline">OVERDUE</span>. It was due on {format(new Date(invoice.due_date), 'MMMM d')}.
           </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Preview Section */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-surface p-8 rounded-xl border border-border shadow-inner flex justify-center overflow-x-auto">
              <InvoicePreview data={invoice} />
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <Card title="Client Overview">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar name={invoice.clients?.company_name} size="md" />
                  <div>
                    <p className="text-sm font-bold text-textPrimary">{invoice.clients?.company_name}</p>
                    <button 
                      onClick={() => navigate(`/clients/${invoice.client_id}`)}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      View Account <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t border-border space-y-3">
                   <div className="flex justify-between text-xs">
                     <span className="text-textMuted">Contact</span>
                     <span className="text-textPrimary font-semibold">{invoice.clients?.contact_first_name} {invoice.clients?.contact_last_name}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                     <span className="text-textMuted">Billing Email</span>
                     <span className="text-textPrimary font-semibold truncate max-w-[150px]">{invoice.clients?.billing_email}</span>
                   </div>
                </div>
              </div>
           </Card>

           <Card title="Payment Status">
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">Amount Due</p>
                       <p className="text-3xl font-black text-textPrimary">${outstanding.toLocaleString()}</p>
                    </div>
                    {invoice.status === 'paid' && <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full"><CheckCircle size={24} /></div>}
                 </div>
                 
                 <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${invoice.status === 'paid' ? 'bg-emerald-500' : 'bg-primary'}`} 
                      style={{ width: `${(Number(invoice.amount_paid || 0) / Number(invoice.total_amount)) * 100}%` }} 
                    />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-textMuted">Total Invoiced</span>
                      <span className="text-textPrimary font-bold">${invoice.total_amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-textMuted">Total Paid</span>
                      <span className="text-success font-bold">${(invoice.amount_paid || 0).toLocaleString()}</span>
                    </div>
                 </div>
              </div>
           </Card>

           <Card title="Payment History">
              <div className="space-y-4">
                 {invoice.invoice_payments?.map((pay: any) => (
                    <div key={pay.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                       <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 h-fit"><CreditCard size={14} /></div>
                       <div>
                          <p className="text-xs font-bold text-textPrimary">${pay.amount.toLocaleString()} via {pay.payment_method}</p>
                          <p className="text-[10px] text-textMuted mt-0.5">{format(new Date(pay.payment_date), 'MMM d, yyyy')} • {pay.users?.first_name}</p>
                       </div>
                    </div>
                 ))}
                 {(!invoice.invoice_payments || invoice.invoice_payments.length === 0) && (
                    <p className="text-xs text-textMuted italic text-center py-4">No payments recorded yet.</p>
                 )}
              </div>
           </Card>

           {invoice.deal_id && (
             <Card title="Related Records">
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-textMuted">Associated Deal</span>
                      <button 
                        onClick={() => navigate(`/deals/${invoice.deal_id}`)}
                        className="text-primary font-bold hover:underline"
                      >
                        {invoice.deals?.name}
                      </button>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-textMuted">AE Commission</span>
                      <Badge variant="primary" size="sm">Calculated on Payment</Badge>
                   </div>
                </div>
             </Card>
           )}
        </div>
      </div>

      <SendInvoiceModal isOpen={activeModal === 'send'} onClose={() => setActiveModal(null)} invoice={invoice} />
      <MarkAsPaidModal isOpen={activeModal === 'mark-paid'} onClose={() => setActiveModal(null)} invoice={invoice} />
      <RecordPaymentModal isOpen={activeModal === 'payment'} onClose={() => setActiveModal(null)} invoice={invoice} />
    </div>
  );
};

export default InvoiceDetail;
