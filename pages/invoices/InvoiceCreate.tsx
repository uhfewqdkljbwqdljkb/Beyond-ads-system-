
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Save, Send, ArrowLeft, Receipt, ChevronRight, Briefcase } from 'lucide-react';
import { 
  Card, Button, Input, Select, Textarea, 
  DatePicker, Toggle, Badge, Table 
} from '../../components/ui';
import { InvoicePreview } from '../../components/invoices/InvoicePreview';
import { useClients } from '../../hooks/useClients';
import { useDeals } from '../../hooks/useDeals';
import { useServices } from '../../hooks/useSettings';
import { useCreateInvoice } from '../../hooks/useInvoices';
import { useAuthStore } from '../../store/authStore';

const InvoiceCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = useAuthStore(s => s.user);
  const createInvoice = useCreateInvoice();

  // Queries
  const { data: clientsData } = useClients({ limit: 100 });
  const { data: services } = useServices();

  // Local State
  const [formData, setFormData] = useState({
    invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    client_id: searchParams.get('client_id') || '',
    deal_id: searchParams.get('deal_id') || '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    notes_client: 'Thank you for your business! Payment is due within 15 days.',
    notes_internal: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    tax_rate: 0,
    use_discount: false,
    use_tax: false
  });

  const [items, setItems] = useState([
    { description: '', quantity: 1, unit_price: 0, service_id: '' }
  ]);

  const { data: dealsData } = useDeals({ client_id: formData.client_id });

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const discountAmount = formData.use_discount 
    ? (formData.discount_type === 'percentage' ? (subtotal * formData.discount_value / 100) : formData.discount_value) 
    : 0;
  const taxAmount = formData.use_tax ? ((subtotal - discountAmount) * formData.tax_rate / 100) : 0;
  const total = subtotal - discountAmount + taxAmount;

  const handleAddItem = () => setItems([...items, { description: '', quantity: 1, unit_price: 0, service_id: '' }]);
  const handleRemoveItem = (idx: number) => items.length > 1 && setItems(items.filter((_, i) => i !== idx));
  const handleUpdateItem = (idx: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[idx] as any)[field] = value;
    setItems(newItems);
  };

  const handleQuickAddService = (serviceId: string) => {
    const service = services?.find((s: any) => s.id === serviceId);
    if (!service) return;
    setItems([...items, { description: service.name, quantity: 1, unit_price: service.default_price || 0, service_id: service.id }]);
  };

  const handleSubmit = async (isSend: boolean = false) => {
    try {
      await createInvoice.mutateAsync({
        data: {
          ...formData,
          subtotal,
          discount_amount: discountAmount,
          tax_amount: taxAmount,
          total_amount: total,
          created_by: currentUser?.id,
          status: isSend ? 'sent' : 'draft',
          sent_at: isSend ? new Date() : null
        },
        items: items
      });
      navigate('/invoices');
    } catch (err) {}
  };

  const selectedClient = clientsData?.data?.find((c: any) => c.id === formData.client_id);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] overflow-hidden -m-6">
      {/* Form Side */}
      <div className="w-full lg:w-1/3 bg-white border-r border-border overflow-y-auto no-scrollbar flex flex-col">
        <div className="p-6 border-b border-border bg-surface flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/invoices')} className="p-1 hover:bg-white rounded transition-colors"><ArrowLeft size={20} /></button>
             <h2 className="text-lg font-bold">New Invoice</h2>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => handleSubmit(false)} isLoading={createInvoice.isPending}>Save</Button>
             <Button size="sm" onClick={() => handleSubmit(true)} isLoading={createInvoice.isPending}>Send</Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
           <section className="space-y-4">
              <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Client Details</h4>
              <Select 
                label="Client Account" 
                placeholder="Search clients..." 
                options={clientsData?.data?.map((c: any) => ({ label: c.company_name, value: c.id })) || []}
                value={formData.client_id}
                onChange={val => setFormData({ ...formData, client_id: val })}
                required
              />
              {selectedClient && (
                <div className="bg-surface p-3 rounded-lg border border-border space-y-1 animate-in fade-in slide-in-from-top-1">
                   <p className="text-xs font-bold text-textPrimary">{selectedClient.contact_first_name} {selectedClient.contact_last_name}</p>
                   <p className="text-[11px] text-textSecondary">{selectedClient.billing_email}</p>
                   <p className="text-[11px] text-textSecondary">{selectedClient.billing_address_line1}, {selectedClient.billing_city}</p>
                </div>
              )}
              <Select 
                label="Related Deal (Optional)" 
                options={dealsData?.data?.map((d: any) => ({ label: d.name, value: d.id })) || []}
                value={formData.deal_id}
                onChange={val => setFormData({ ...formData, deal_id: val })}
                disabled={!formData.client_id}
              />
           </section>

           <section className="space-y-4">
              <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Invoice Info</h4>
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Invoice #" value={formData.invoice_number} onChange={e => setFormData({ ...formData, invoice_number: e.target.value })} />
                 <Select 
                   label="Currency" 
                   options={[{label: 'USD ($)', value: 'USD'}, {label: 'EUR (€)', value: 'EUR'}, {label: 'GBP (£)', value: 'GBP'}]} 
                   value={formData.currency} 
                   onChange={val => setFormData({...formData, currency: val})} 
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <DatePicker label="Issue Date" value={formData.issue_date} onChange={val => setFormData({ ...formData, issue_date: val })} />
                 <DatePicker label="Due Date" value={formData.due_date} onChange={val => setFormData({ ...formData, due_date: val })} />
              </div>
           </section>

           <section className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2">
                 <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest">Adjustments</h4>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Discount</span>
                    <Toggle checked={formData.use_discount} onChange={v => setFormData({ ...formData, use_discount: v })} />
                 </div>
                 {formData.use_discount && (
                   <div className="flex gap-2 animate-in slide-in-from-right-1 duration-200">
                      <Select 
                        className="w-32" 
                        options={[{label: '%', value: 'percentage'}, {label: 'Fixed', value: 'fixed'}]} 
                        value={formData.discount_type} 
                        onChange={v => setFormData({...formData, discount_type: v})} 
                      />
                      <Input type="number" placeholder="Value" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: parseFloat(e.target.value) || 0})} />
                   </div>
                 )}

                 <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium">Tax</span>
                    <Toggle checked={formData.use_tax} onChange={v => setFormData({ ...formData, use_tax: v })} />
                 </div>
                 {formData.use_tax && (
                    <Input 
                      type="number" 
                      label="Tax Rate (%)" 
                      placeholder="e.g. 15" 
                      value={formData.tax_rate} 
                      onChange={e => setFormData({...formData, tax_rate: parseFloat(e.target.value) || 0})} 
                      className="animate-in slide-in-from-right-1 duration-200"
                    />
                 )}
              </div>
           </section>

           <section className="space-y-4 pb-12">
              <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Public Notes</h4>
              <Textarea 
                label="Client Visible Notes" 
                rows={3} 
                value={formData.notes_client} 
                onChange={e => setFormData({...formData, notes_client: e.target.value})} 
              />
              <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Internal</h4>
              <Textarea 
                label="Internal Memo" 
                rows={2} 
                value={formData.notes_internal} 
                onChange={e => setFormData({...formData, notes_internal: e.target.value})} 
              />
           </section>
        </div>
      </div>

      {/* Editor Side */}
      <div className="flex-1 bg-surface flex flex-col overflow-hidden">
         <div className="p-6 overflow-y-auto no-scrollbar">
            <Card className="mb-8 border-none shadow-lg">
               <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Line Items</h3>
                    <div className="flex gap-2">
                       <Select 
                         placeholder="Quick add service..." 
                         options={services?.map((s: any) => ({ label: s.name, value: s.id })) || []} 
                         value="" 
                         onChange={handleQuickAddService} 
                         className="w-56"
                       />
                       <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={handleAddItem}>Add Item</Button>
                    </div>
                  </div>

                  <Table>
                    <Table.Header>
                      <Table.Row hover={false}>
                        <Table.HeaderCell width="50%">Description</Table.HeaderCell>
                        <Table.HeaderCell width="15%" align="center">Qty</Table.HeaderCell>
                        <Table.HeaderCell width="20%" align="right">Unit Price</Table.HeaderCell>
                        <Table.HeaderCell width="15%" align="right">Total</Table.HeaderCell>
                        <Table.HeaderCell width="50px"></Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {items.map((item, idx) => (
                        <Table.Row key={idx} hover={false}>
                           <Table.Cell>
                              <Input 
                                placeholder="Enter task or service description..." 
                                value={item.description} 
                                onChange={e => handleUpdateItem(idx, 'description', e.target.value)}
                                className="border-none bg-surface/50 py-1"
                              />
                           </Table.Cell>
                           <Table.Cell align="center">
                              <Input 
                                type="number" 
                                value={item.quantity} 
                                onChange={e => handleUpdateItem(idx, 'quantity', parseFloat(e.target.value))}
                                className="border-none bg-surface/50 text-center py-1 w-16 mx-auto"
                              />
                           </Table.Cell>
                           <Table.Cell align="right">
                              <Input 
                                type="number" 
                                value={item.unit_price} 
                                onChange={e => handleUpdateItem(idx, 'unit_price', parseFloat(e.target.value))}
                                className="border-none bg-surface/50 text-right py-1 w-24 ml-auto"
                                leftIcon={<span className="text-[10px]">$</span>}
                              />
                           </Table.Cell>
                           <Table.Cell align="right">
                              <span className="font-bold text-sm text-textPrimary">${(item.quantity * item.unit_price).toLocaleString()}</span>
                           </Table.Cell>
                           <Table.Cell align="right">
                              <button onClick={() => handleRemoveItem(idx)} className="p-1 text-textMuted hover:text-error transition-colors"><Trash2 size={16} /></button>
                           </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>

                  <div className="mt-8 flex justify-end">
                     <div className="w-64 space-y-3 bg-surface p-4 rounded-xl border border-border">
                        <div className="flex justify-between text-xs font-bold text-textSecondary">
                           <span>SUBTOTAL</span>
                           <span>${subtotal.toLocaleString()}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-xs font-bold text-error">
                             <span>DISCOUNT</span>
                             <span>-${discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                        {taxAmount > 0 && (
                          <div className="flex justify-between text-xs font-bold text-textPrimary">
                             <span>TAX ({formData.tax_rate}%)</span>
                             <span>${taxAmount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xl font-black text-primary border-t border-border pt-3">
                           <span>TOTAL</span>
                           <span>${total.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </Card>

            <div className="pb-20">
               <h4 className="text-xs font-black text-textMuted uppercase tracking-widest text-center mb-6">Live Document Preview</h4>
               <InvoicePreview data={{ ...formData, subtotal, discount_amount: discountAmount, tax_amount: taxAmount, total_amount: total, invoice_line_items: items, clients: selectedClient }} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default InvoiceCreate;
