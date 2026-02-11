import React from 'react';
import { format } from 'date-fns';
import { Briefcase } from 'lucide-react';

interface InvoicePreviewProps {
  data: any;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const subtotal = data.subtotal || 0;
  const discount = data.discount_amount || 0;
  const tax = data.tax_amount || 0;
  const total = data.total_amount || 0;

  return (
    <div className="bg-white shadow-2xl rounded-sm border border-border overflow-hidden max-w-[800px] mx-auto min-h-[1050px] flex flex-col p-12 text-gray-800 font-serif leading-relaxed">
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                <Briefcase size={28} />
             </div>
             <h1 className="text-3xl font-black font-sans tracking-tighter text-primary">BEYOND ADS</h1>
          </div>
          <div className="text-sm font-sans text-textSecondary space-y-1">
            <p>123 Agency Workspace Dr.</p>
            <p>San Francisco, CA 94103</p>
            <p>hello@nexusagency.com</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-5xl font-black font-sans text-gray-200 uppercase tracking-widest mb-4">Invoice</h2>
          <div className="font-sans text-sm">
            <p className="text-textMuted uppercase font-bold tracking-widest text-[10px]">Invoice Number</p>
            <p className="text-lg font-bold">{data.invoice_number || 'INV-202X-000'}</p>
          </div>
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="grid grid-cols-2 gap-12 mb-16 font-sans">
        <div>
          <h3 className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-3">Bill To</h3>
          <p className="text-lg font-bold text-textPrimary">{data.clients?.company_name || 'Select Client'}</p>
          <div className="text-sm text-textSecondary mt-2 space-y-0.5">
            <p>{data.clients?.contact_first_name} {data.clients?.contact_last_name}</p>
            <p>{data.clients?.contact_email}</p>
            <p>{data.clients?.billing_address_line1}</p>
            <p>{data.clients?.billing_city}, {data.clients?.billing_country}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-1">Issue Date</h3>
            <p className="text-sm font-bold">{data.issue_date ? format(new Date(data.issue_date), 'MMMM d, yyyy') : '-'}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-1">Due Date</h3>
            <p className="text-sm font-bold text-primary">{data.due_date ? format(new Date(data.due_date), 'MMMM d, yyyy') : '-'}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 font-sans">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-textPrimary">Description</th>
              <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-textPrimary">Qty</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-textPrimary">Rate</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-textPrimary">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.invoice_line_items?.map((item: any, idx: number) => (
              <tr key={idx}>
                <td className="py-6 pr-8">
                  <p className="font-bold text-gray-900">{item.description || 'Service'}</p>
                  {item.notes && <p className="text-xs text-textSecondary mt-1">{item.notes}</p>}
                </td>
                <td className="py-6 text-center text-sm font-medium">{item.quantity}</td>
                <td className="py-6 text-right text-sm font-medium">${item.unit_price?.toLocaleString()}</td>
                <td className="py-6 text-right text-sm font-bold text-textPrimary">${(item.quantity * item.unit_price).toLocaleString()}</td>
              </tr>
            ))}
            {(!data.invoice_line_items || data.invoice_line_items.length === 0) && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-textMuted italic text-sm">No items added yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Totals */}
      <div className="mt-12 pt-8 border-t border-gray-100 font-sans">
        <div className="flex justify-between gap-12">
          <div className="max-w-[400px]">
            <h3 className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-2">Notes</h3>
            <p className="text-sm text-textSecondary whitespace-pre-wrap">{data.notes_client || 'Thank you for your business!'}</p>
          </div>
          <div className="w-64 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-textSecondary">Subtotal</span>
              <span className="font-bold">${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-textSecondary">Discount</span>
                <span className="font-bold text-error">-${discount.toLocaleString()}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-textSecondary">Tax</span>
                <span className="font-bold">${tax.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-gray-900">
              <span className="font-black text-textPrimary uppercase tracking-widest">Total</span>
              <span className="text-3xl font-black text-primary">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};