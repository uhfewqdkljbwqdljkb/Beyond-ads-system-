
import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, Search, Filter, Download, 
  ChevronDown, MoreHorizontal, CheckCircle, 
  Clock, AlertCircle, FileText, CreditCard,
  Send, Trash2, X, ArrowUpDown, Receipt
} from 'lucide-react';

import { 
  Card, Button, Badge, Table, Avatar, 
  // Added Checkbox to the UI components import
  Spinner, EmptyState, SearchInput, Select, Dropdown, Checkbox
} from '../../components/ui';
import { useInvoices } from '../../hooks/useInvoices';
import { InvoiceRow } from '../../components/invoices/InvoiceRow';
import { format } from 'date-fns';

const InvoicesList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  
  const { data, isLoading } = useInvoices({
    status: searchParams.get('status') || '',
    clientId: searchParams.get('client_id') || '',
    page: parseInt(searchParams.get('page') || '1')
  });

  const invoices = data?.data || [];
  const count = data?.count || 0;

  // Mock aggregates for stats
  const stats = {
    draft: { total: 12450, count: 5 },
    sent: { total: 48200, count: 12 },
    overdue: { total: 8600, count: 3 },
    paid: { total: 142000, count: 28 }
  };

  const handleSearch = (val: string) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set('q', val); else p.delete('q');
    setSearchParams(p);
  };

  const handleStatusFilter = (status: string) => {
    const p = new URLSearchParams(searchParams);
    if (status && status !== 'all') p.set('status', status); 
    else p.delete('status');
    setSearchParams(p);
  };

  const toggleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) setSelectedInvoices([]);
    else setSelectedInvoices(invoices.map(i => i.id));
  };

  const toggleSelectInvoice = (id: string) => {
    setSelectedInvoices(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Invoices</h1>
          <p className="text-sm text-textSecondary">Manage client billing, payments, and automated reminders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download size={18} />}>Export CSV</Button>
          <Button leftIcon={<Plus size={18} />} onClick={() => navigate('/invoices/new')}>Create Invoice</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface/50">
           <p className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-1">Draft</p>
           <h3 className="text-2xl font-black text-textPrimary">${stats.draft.total.toLocaleString()}</h3>
           <p className="text-xs text-textSecondary mt-1">{stats.draft.count} invoices pending</p>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Sent</p>
           <h3 className="text-2xl font-black text-textPrimary">${stats.sent.total.toLocaleString()}</h3>
           <p className="text-xs text-textSecondary mt-1">{stats.sent.count} invoices active</p>
        </Card>
        <Card className="bg-red-50 border-red-200">
           <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 flex items-center gap-1">
             <AlertCircle size={10} /> Overdue
           </p>
           <h3 className="text-2xl font-black text-red-700">${stats.overdue.total.toLocaleString()}</h3>
           <p className="text-xs text-red-600 font-bold mt-1">{stats.overdue.count} critical follow-ups</p>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Paid (MTD)</p>
           <h3 className="text-2xl font-black text-emerald-700">${stats.paid.total.toLocaleString()}</h3>
           <p className="text-xs text-emerald-600 mt-1">{stats.paid.count} successful collections</p>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-3 rounded-xl border border-border shadow-sm">
        <div className="flex flex-1 w-full md:max-w-md gap-2">
          <SearchInput 
            value={searchParams.get('q') || ''} 
            onChange={handleSearch} 
            placeholder="Search invoice # or client..." 
            className="flex-1"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
           <button 
             onClick={() => handleStatusFilter('all')}
             className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${!searchParams.get('status') ? 'bg-primary text-white border-primary' : 'bg-surface text-textSecondary border-border hover:border-primary/50'}`}
           >
             All
           </button>
           <button 
             onClick={() => handleStatusFilter('sent')}
             className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${searchParams.get('status') === 'sent' ? 'bg-blue-500 text-white border-blue-500' : 'bg-surface text-textSecondary border-border hover:border-blue-500/50'}`}
           >
             Sent
           </button>
           <button 
             onClick={() => handleStatusFilter('paid')}
             className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${searchParams.get('status') === 'paid' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-surface text-textSecondary border-border hover:border-emerald-500/50'}`}
           >
             Paid
           </button>
           <div className="w-px h-6 bg-border mx-2" />
           <Button variant="outline" leftIcon={<Filter size={18} />}>Filters</Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedInvoices.length > 0 && (
        <div className="bg-primary text-white p-3 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-6 px-2">
            <span className="text-sm font-black">{selectedInvoices.length} Selected</span>
            <div className="h-4 w-px bg-white/30" />
            <button className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"><Send size={14} /> Send Reminders</button>
            <button className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"><Download size={14} /> Download Bulk</button>
            <button className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"><CheckCircle size={14} /> Mark Paid</button>
          </div>
          <button onClick={() => setSelectedInvoices([])} className="p-1 hover:bg-white/10 rounded"><X size={18} /></button>
        </div>
      )}

      {/* Main Table */}
      <Card padding="none" className="overflow-hidden shadow-sm">
        <Table>
          <Table.Header>
            <Table.Row hover={false}>
              <Table.HeaderCell width="40px">
                <Checkbox 
                  checked={selectedInvoices.length === invoices.length && invoices.length > 0} 
                  indeterminate={selectedInvoices.length > 0 && selectedInvoices.length < invoices.length}
                  onChange={toggleSelectAll} 
                />
              </Table.HeaderCell>
              <Table.HeaderCell>Invoice #</Table.HeaderCell>
              <Table.HeaderCell>Client</Table.HeaderCell>
              <Table.HeaderCell sortable>Amount</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Issued</Table.HeaderCell>
              <Table.HeaderCell>Due Date</Table.HeaderCell>
              <Table.HeaderCell>Created By</Table.HeaderCell>
              <Table.HeaderCell align="right"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {invoices.map(inv => (
              <InvoiceRow 
                key={inv.id} 
                invoice={inv} 
                isSelected={selectedInvoices.includes(inv.id)}
                onSelect={() => toggleSelectInvoice(inv.id)}
              />
            ))}
          </Table.Body>
        </Table>
        {invoices.length === 0 && (
          <EmptyState 
            icon={<Receipt size={48} />} 
            title="No invoices found" 
            description="Start billing your clients by creating your first invoice."
            action={<Button onClick={() => navigate('/invoices/new')}>Create First Invoice</Button>}
          />
        )}
      </Card>
    </div>
  );
};

export default InvoicesList;
