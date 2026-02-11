import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, Search, Building2, ExternalLink, 
  TrendingUp, Users, DollarSign, Filter, 
  MoreHorizontal, Download, ArrowUpDown, UserX
} from 'lucide-react';

import { 
  Card, Button, Badge, Table, Avatar, 
  Spinner, EmptyState, SearchInput, Select, Dropdown
} from '../../components/ui';
import { useClients } from '../../hooks/useClients';
import { ClientRow } from '../../components/clients/ClientRow';
import { AddClientModal } from '../../components/clients/AddClientModal';

const ClientsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data, isLoading } = useClients({
    search: searchParams.get('q') || '',
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page') || '1')
  });

  const clients = data?.data || [];
  const totalClients = data?.count || 0;

  // Stats
  const activeCount = clients.filter(c => c.status === 'active').length;
  const totalLtv = clients.reduce((s, c) => s + (c.lifetime_value || 0), 0);
  const churnedThisYear = 4; // Mock

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

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-textPrimary">Clients</h1>
            <p className="text-sm text-textSecondary">Manage account relationships and portfolio value.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" leftIcon={<Download size={18} />}>Export</Button>
            <Button leftIcon={<Plus size={18} />} onClick={() => setIsAddModalOpen(true)}>Add Client</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-50/30 border-blue-100">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Active Accounts</p>
                 <h3 className="text-2xl font-black text-textPrimary mt-1">{activeCount}</h3>
               </div>
               <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20} /></div>
             </div>
          </Card>
          <Card className="bg-emerald-50/30 border-emerald-100">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Total LTV</p>
                 <h3 className="text-2xl font-black text-textPrimary mt-1">${totalLtv.toLocaleString()}</h3>
               </div>
               <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign size={20} /></div>
             </div>
          </Card>
          <Card className="bg-purple-50/30 border-purple-100">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">MTD Revenue</p>
                 <h3 className="text-2xl font-black text-textPrimary mt-1">$28,450</h3>
               </div>
               <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp size={20} /></div>
             </div>
          </Card>
          <Card className="bg-red-50/30 border-red-100">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Annual Churn</p>
                 <h3 className="text-2xl font-black text-textPrimary mt-1">{churnedThisYear}</h3>
               </div>
               <div className="p-2 bg-red-100 text-red-600 rounded-lg"><UserX size={20} /></div>
             </div>
          </Card>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-border shadow-sm">
        <div className="flex flex-1 w-full md:max-w-md gap-2">
          <SearchInput 
            value={searchParams.get('q') || ''} 
            onChange={handleSearch} 
            placeholder="Search company or contact..." 
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
             onClick={() => handleStatusFilter('active')}
             className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${searchParams.get('status') === 'active' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-surface text-textSecondary border-border hover:border-emerald-500/50'}`}
           >
             Active
           </button>
           <button 
             onClick={() => handleStatusFilter('churned')}
             className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${searchParams.get('status') === 'churned' ? 'bg-red-500 text-white border-red-500' : 'bg-surface text-textSecondary border-border hover:border-red-500/50'}`}
           >
             Churned
           </button>
           <div className="w-px h-6 bg-border mx-2" />
           <Select 
             placeholder="Sort By" 
             className="w-40 border-none bg-surface" 
             options={[
               { label: 'Highest LTV', value: 'ltv' },
               { label: 'Most Deals', value: 'deals' },
               { label: 'Alphabetical', value: 'name' },
             ]} 
             value="" 
             onChange={() => {}} 
           />
           <Button variant="outline" leftIcon={<Filter size={18} />}>Filters</Button>
        </div>
      </div>

      {/* Directory Table */}
      <Card padding="none" className="overflow-hidden shadow-sm">
        <Table>
          <Table.Header>
            <Table.Row hover={false}>
              <Table.HeaderCell>Client</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Deals</Table.HeaderCell>
              <Table.HeaderCell sortable>LTV</Table.HeaderCell>
              <Table.HeaderCell>AE</Table.HeaderCell>
              <Table.HeaderCell>Contract Period</Table.HeaderCell>
              <Table.HeaderCell align="right"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {clients.map(client => (
              <ClientRow key={client.id} client={client} />
            ))}
          </Table.Body>
        </Table>
        {clients.length === 0 && (
          <EmptyState 
            icon={<Building2 size={48} />} 
            title="No clients found" 
            description="Start building your portfolio by adding new clients or converting leads."
            action={<Button onClick={() => setIsAddModalOpen(true)}>Add First Client</Button>}
          />
        )}
      </Card>

      <AddClientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default ClientsList;