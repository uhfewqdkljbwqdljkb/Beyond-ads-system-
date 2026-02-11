import React, { useState } from 'react';
import { Modal, Button, Input, DatePicker, Table, Textarea } from '../ui';
import { useCreateInvoice } from '../../hooks/useInvoices';
import { useToast } from '../ui/Toast';
import { Receipt, FileText, Plus, Trash2 } from 'lucide-react';

interface CreateInvoiceFromDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
}

export const CreateInvoiceFromDealModal: React.FC<CreateInvoiceFromDealModalProps> = ({ isOpen, onClose, deal }) => {
  const toast = useToast();
  const createInvoice = useCreateInvoice();

  const [invoiceData, setInvoiceData] = useState({
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes_client: 'Thank you for your business!',
  });

  const [items, setItems] = useState(
    deal?.deal_services?.map((ds: any) => ({
      description: ds.services?.name || 'Service',
      quantity: 1,
      unit_price: ds.price || 0,
      total_price: ds.price || 0,
    })) || [{ description: deal?.name, quantity: 1, unit_price: deal?.deal_value || 0, total_price: deal?.deal_value || 0 }]
  );

  const calculateTotal = () => items.reduce((sum: number, item: any) => sum + item.total_price, 0);

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, unit_price: 0, total_price: 0 }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInvoice.mutateAsync({
        data: {
          client_id: deal.client_id,
          deal_id: deal.id,
          subtotal: calculateTotal(),
          total_amount: calculateTotal(),
          ...invoiceData,
          status: 'draft'
        },
        items: items
      });
      toast.success('Invoice draft created successfully');
      onClose();
    } catch (err) {}
  };

  if (!deal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Invoice from Deal" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-surface rounded-xl border border-border">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Receipt size={24} /></div>
          <div>
            <h4 className="text-sm font-bold text-textPrimary">Invoice Generation</h4>
            <p className="text-xs text-textSecondary">Generating invoice for <span className="font-bold">{deal.clients?.company_name}</span>. Review line items below.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DatePicker 
            label="Issue Date" 
            required 
            value={invoiceData.issue_date} 
            onChange={val => setInvoiceData({...invoiceData, issue_date: val})} 
          />
          <DatePicker 
            label="Due Date" 
            required 
            value={invoiceData.due_date} 
            onChange={val => setInvoiceData({...invoiceData, due_date: val})} 
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-black text-textMuted uppercase tracking-widest">Line Items</h5>
            <Button variant="ghost" size="sm" type="button" leftIcon={<Plus size={14} />} onClick={addItem}>Add Item</Button>
          </div>
          
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <Table.Header>
                <Table.Row hover={false}>
                  <Table.HeaderCell width="50%">Description</Table.HeaderCell>
                  <Table.HeaderCell width="15%" align="center">Qty</Table.HeaderCell>
                  <Table.HeaderCell width="20%" align="right">Unit Price</Table.HeaderCell>
                  <Table.HeaderCell width="15%" align="right"></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {items.map((item: any, idx: number) => (
                  <Table.Row key={idx} hover={false}>
                    <Table.Cell>
                      <Input 
                        value={item.description} 
                        onChange={e => updateItem(idx, 'description', e.target.value)} 
                        className="border-none bg-surface/50 text-xs py-1"
                        placeholder="Item description..."
                      />
                    </Table.Cell>
                    <Table.Cell align="center">
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))} 
                        className="border-none bg-surface/50 text-center text-xs py-1 w-16 mx-auto"
                      />
                    </Table.Cell>
                    <Table.Cell align="right">
                      <Input 
                        type="number" 
                        value={item.unit_price} 
                        onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value))} 
                        className="border-none bg-surface/50 text-right text-xs py-1 w-24 ml-auto"
                        leftIcon={<span className="text-[10px]">$</span>}
                      />
                    </Table.Cell>
                    <Table.Cell align="right">
                      <button onClick={() => removeItem(idx)} className="p-1.5 text-textMuted hover:text-error"><Trash2 size={14} /></button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-surface rounded-xl border border-border">
           <span className="text-sm font-bold text-textSecondary uppercase tracking-widest">Total Invoice Amount</span>
           <span className="text-2xl font-black text-textPrimary">${calculateTotal().toLocaleString()}</span>
        </div>

        <Textarea 
          label="Client Notes (shown on invoice)" 
          value={invoiceData.notes_client}
          onChange={e => setInvoiceData({...invoiceData, notes_client: e.target.value})}
          rows={2}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={createInvoice.isPending} leftIcon={<Receipt size={18} />}>Generate Draft</Button>
        </div>
      </form>
    </Modal>
  );
};