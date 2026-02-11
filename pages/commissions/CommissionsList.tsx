import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, Search, Filter, Download, 
  HandCoins, FileText, CheckCircle2, 
  ChevronDown, ArrowUpDown, ShieldAlert,
  SearchIcon, X, Wallet, TrendingUp, Users
} from 'lucide-react';

import { 
  Card, Button, Badge, Table, Avatar, 
  Spinner, EmptyState, SearchInput, Select, Dropdown, Checkbox
} from '../../components/ui';

import { useCommissions, useCommissionStats, useApproveCommission } from '../../hooks/useCommissions';
import { useAuth } from '../../hooks/useAuth';
import { CommissionSummaryCards } from '../../components/commissions/CommissionSummaryCards';
import { CommissionRow } from '../../components/commissions/CommissionRow';
import { CommissionDetailModal } from '../../components/commissions/CommissionDetailModal';
import { CommissionStructureCard } from '../../components/commissions/CommissionStructureCard';
import { ManageTeamStructuresModal } from '../../components/commissions/ManageTeamStructuresModal';

const CommissionsList: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedComms, setSelectedComms] = useState<string[]>([]);
  const [detailComm, setDetailComm] = useState<any>(null);
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);

  const isManager = ['admin', 'sales_manager'].includes(user?.role || '');
  const isLead = user?.role === 'team_lead';

  // Fetching
  const { data, isLoading } = useCommissions({
    salespersonId: !isManager && !isLead ? user?.id : searchParams.get('salesperson_id') || undefined,
    status: searchParams.get('status') || undefined,
    page: parseInt(searchParams.get('page') || '1')
  });

  const { data: statsData } = useCommissionStats(user?.id || '');
  const approveMutation = useApproveCommission();

  const commissions = data?.data || [];
  const count = data?.count || 0;

  // Mock aggregates for stats if manager
  const stats = useMemo(() => {
    if (isManager) {
      return { total: 48200, pending: 12400, approved: 8600, paid: 27200 };
    }
    return {
      total: statsData?.total || 0,
      pending: statsData?.pending || 0,
      approved: statsData?.approved || 0,
      paid: statsData?.paid || 0,
    };
  }, [isManager, statsData]);

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
    if (selectedComms.length === commissions.length) setSelectedComms([]);
    else setSelectedComms(commissions.map(c => c.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedComms(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    // Bulk logic would go here
    approveMutation.mutate({ id: selectedComms[0], userId: user?.id || '' });
    setSelectedComms([]);
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Commissions</h1>
          <p className="text-sm text-textSecondary">
            {isManager ? 'Company-wide payout management and liability tracking.' : 'Track your earnings and progress towards your sales goals.'}
          </p>
        </div>
        <div className="flex gap-2">
           {isManager && (
             <Button variant="secondary" leftIcon={<Users size={18} />} onClick={() => setIsManageTeamOpen(true)}>
               Manage Team
             </Button>
           )}
           <Select 
             className="w-44" 
             options={[
               {label: 'This Month', value: 'month'},
               {label: 'This Quarter', value: 'quarter'},
               {label: 'Year to Date', value: 'year'}
             ]} 
             value="month" 
             onChange={() => {}} 
           />
           <Button variant="outline" leftIcon={<Download size={18} />}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Main Content */}
         <div className="lg:col-span-3 space-y-6">
            <CommissionSummaryCards stats={stats} isManager={isManager} />

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-3 rounded-xl border border-border shadow-sm">
              <div className="flex flex-1 w-full md:max-w-md gap-2">
                <SearchInput 
                  value={searchParams.get('q') || ''} 
                  onChange={handleSearch} 
                  placeholder="Search deal or rep..." 
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
                  onClick={() => handleStatusFilter('pending')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${searchParams.get('status') === 'pending' ? 'bg-amber-500 text-white border-amber-500' : 'bg-surface text-textSecondary border-border hover:border-amber-500/50'}`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => handleStatusFilter('approved')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${searchParams.get('status') === 'approved' ? 'bg-blue-500 text-white border-blue-500' : 'bg-surface text-textSecondary border-border hover:border-blue-500/50'}`}
                >
                  Approved
                </button>
                <div className="w-px h-6 bg-border mx-2" />
                <Button variant="outline" leftIcon={<Filter size={18} />}>Filters</Button>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedComms.length > 0 && isManager && (
              <div className="bg-primary text-white p-3 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
                <div className="flex items-center gap-6 px-2">
                  <span className="text-sm font-black">{selectedComms.length} Selected</span>
                  <div className="h-4 w-px bg-white/30" />
                  <button onClick={handleBulkApprove} className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"><CheckCircle2 size={14} /> Approve for Payout</button>
                  <button className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"><HandCoins size={14} /> Record Payment</button>
                </div>
                <button onClick={() => setSelectedComms([])} className="p-1 hover:bg-white/10 rounded"><X size={18} /></button>
              </div>
            )}

            {/* Main Table */}
            <Card padding="none" className="overflow-hidden shadow-sm">
              <Table>
                <Table.Header>
                  <Table.Row hover={false}>
                    <Table.HeaderCell width="40px">
                      <Checkbox 
                        checked={selectedComms.length === commissions.length && commissions.length > 0} 
                        indeterminate={selectedComms.length > 0 && selectedComms.length < commissions.length}
                        onChange={toggleSelectAll} 
                      />
                    </Table.HeaderCell>
                    {isManager && <Table.HeaderCell>Salesperson</Table.HeaderCell>}
                    <Table.HeaderCell>Deal</Table.HeaderCell>
                    <Table.HeaderCell>Commission</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell sortable>Earned Date</Table.HeaderCell>
                    <Table.HeaderCell align="right"></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {commissions.map(comm => (
                    <CommissionRow 
                      key={comm.id} 
                      commission={comm} 
                      showRep={isManager}
                      isSelected={selectedComms.includes(comm.id)}
                      onSelect={() => toggleSelect(comm.id)}
                      onClick={() => setDetailComm(comm)}
                    />
                  ))}
                </Table.Body>
              </Table>
              {commissions.length === 0 && (
                <EmptyState 
                  icon={<HandCoins size={48} />} 
                  title="No commissions found" 
                  description="Earnings will appear once deals are closed and invoices are processed."
                />
              )}
            </Card>
         </div>

         {/* Sidebar Widgets */}
         <div className="space-y-6">
            {!isManager && <CommissionStructureCard user={user} structure={null} />}
            
            <Card title="Payment Liability">
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-textSecondary">Approved (Next Cycle)</span>
                     <span className="text-sm font-bold text-textPrimary">$8,600</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-textSecondary">Pending (Projected)</span>
                     <span className="text-sm font-bold text-textPrimary">$12,400</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between items-center">
                     <span className="text-xs font-black text-textMuted uppercase">Total Obligation</span>
                     <span className="text-lg font-black text-primary">$21,000</span>
                  </div>
               </div>
            </Card>

            <Card title="Quick Resources">
               <div className="space-y-3">
                  <Button variant="ghost" size="sm" fullWidth className="justify-start" leftIcon={<FileText size={16} />}>Commission Policy PDF</Button>
                  <Button variant="ghost" size="sm" fullWidth className="justify-start" leftIcon={<ShieldAlert size={16} />}>Report Discrepancy</Button>
                  <Button variant="ghost" size="sm" fullWidth className="justify-start" leftIcon={<Wallet size={16} />}>Update Banking Info</Button>
               </div>
            </Card>
         </div>
      </div>

      <CommissionDetailModal 
        isOpen={!!detailComm} 
        onClose={() => setDetailComm(null)} 
        commission={detailComm} 
        userRole={user?.role || ''}
        onApprove={(id) => {
          approveMutation.mutate({ id, userId: user?.id || '' });
          setDetailComm(null);
        }}
      />

      <ManageTeamStructuresModal 
        isOpen={isManageTeamOpen}
        onClose={() => setIsManageTeamOpen(false)}
      />
    </div>
  );
};

export default CommissionsList;