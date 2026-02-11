
import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Upload, LayoutGrid, Users, 
  ArrowLeft, MoreHorizontal, UserPlus, FolderPlus
} from 'lucide-react';

import { 
  Card, Button, Badge, Spinner, EmptyState 
} from '../../components/ui';
import { useLeads } from '../../hooks/useLeads';
import { useLeadGroups, useDeleteGroup, useRemoveLeadFromGroup } from '../../hooks/useLeadGroups';
import { LeadFilters } from '../../components/leads/LeadFilters';
import { AddLeadModal } from '../../components/leads/AddLeadModal';
import { LeadGroupCard } from '../../components/leads/LeadGroupCard';
import { CreateGroupModal } from '../../components/leads/CreateGroupModal';
import { AddLeadsDropdown } from '../../components/leads/AddLeadsDropdown';
import { LeadRow } from '../../components/leads/LeadRow';
import { TableSkeleton } from '../../components/common/TableSkeleton';

const LeadsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for Views
  // activeGroupId: null = Grid View, 'all' = All Leads List, string = Specific Group ID
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  
  // Modal States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);

  // Queries
  const { data: groups, isLoading: groupsLoading } = useLeadGroups();
  const deleteGroup = useDeleteGroup();
  const removeLeadFromGroup = useRemoveLeadFromGroup();

  const filters = useMemo(() => ({
    search: searchParams.get('q') || '',
    status: searchParams.get('status') || '',
    assignedTo: searchParams.get('assigned_to') || '',
    page: parseInt(searchParams.get('page') || '1'),
    groupId: activeGroupId && activeGroupId !== 'all' ? activeGroupId : undefined,
  }), [searchParams, activeGroupId]);

  const { data: leadsData, isLoading: leadsLoading } = useLeads(filters);
  const leads = leadsData?.data || [];
  const totalLeads = leadsData?.count || 0;

  const activeGroupDetails = groups?.find((g: any) => g.id === activeGroupId);

  const handleSearch = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('q', val);
    else newParams.delete('q');
    setSearchParams(newParams);
  };

  // --- RENDER VIEW: GROUPS GRID ---
  if (activeGroupId === null) {
    return (
      <div className="space-y-6 h-full flex flex-col">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-textPrimary">Leads</h1>
            <p className="text-sm text-textSecondary">Organize and manage your sales prospects</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="subtle" size="sm" leftIcon={<Upload size={14} />}>Import</Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => { setEditingGroup(null); setIsCreateGroupOpen(true); }} 
              leftIcon={<FolderPlus size={14} />}
            >
              New Group
            </Button>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-border shadow-sm shrink-0">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-zinc-50 border-none rounded-md focus:bg-white focus:ring-1 focus:ring-primary placeholder:text-zinc-400"
              />
           </div>
        </div>

        {/* GROUPS GRID */}
        {groupsLoading ? (
          <div className="p-6"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {/* Special Card: All Leads */}
            <div 
              onClick={() => setActiveGroupId('all')}
              className="group flex flex-col justify-between bg-white border border-border rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer h-40"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                  <LayoutGrid size={20} />
                </div>
                <Badge variant="default">System</Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors">All Leads</h3>
                <p className="text-xs text-textSecondary mt-1">View master list of all prospects</p>
              </div>
            </div>

            {/* Custom Groups */}
            {groups?.map((group: any) => (
              <LeadGroupCard 
                key={group.id} 
                group={group} 
                onClick={() => setActiveGroupId(group.id)}
                onEdit={() => { setEditingGroup(group); setIsCreateGroupOpen(true); }}
                onDelete={() => deleteGroup.mutate(group.id)}
              />
            ))}

            {/* Empty State Helper */}
            {(!groups || groups.length === 0) && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl">
                <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-textMuted mb-3">
                  <FolderPlus size={24} />
                </div>
                <p className="text-sm font-bold text-textPrimary">No groups created yet</p>
                <p className="text-xs text-textSecondary mb-4">Create your first group to organize leads.</p>
                <Button size="sm" onClick={() => setIsCreateGroupOpen(true)}>Create Group</Button>
              </div>
            )}
          </div>
        )}

        <CreateGroupModal isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)} editGroup={editingGroup} />
      </div>
    );
  }

  // --- RENDER VIEW: GROUP DETAIL / LIST ---
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* GROUP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setActiveGroupId(null)} className="bg-white border border-border h-9 w-9 p-0 flex items-center justify-center rounded-lg">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-textPrimary">{activeGroupId === 'all' ? 'All Leads' : activeGroupDetails?.name}</h1>
              <Badge variant="secondary" size="sm" className="font-bold">{totalLeads} leads</Badge>
            </div>
            {activeGroupId !== 'all' && <p className="text-sm text-textSecondary">{activeGroupDetails?.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeGroupId && activeGroupId !== 'all' ? (
            <AddLeadsDropdown groupId={activeGroupId} groupName={activeGroupDetails?.name || 'Group'} />
          ) : (
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setIsAddLeadOpen(true)}>
              New Lead
            </Button>
          )}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-border shadow-sm shrink-0">
        <div className="flex flex-1 w-full md:max-w-md gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search in this group..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-zinc-50 border-none rounded-md focus:bg-white focus:ring-1 focus:ring-primary focus:shadow-sm transition-all placeholder:text-zinc-400"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsFilterOpen(true)}
            leftIcon={<Filter size={14} />}
            className="border border-border bg-white"
          >
            Filters
          </Button>
        </div>
      </div>

      {/* LEADS LIST */}
      <div className="flex-1 min-h-0 bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {leadsLoading ? (
          <div className="p-6"><TableSkeleton rows={8} cols={5} /></div>
        ) : leads.length === 0 ? (
          <EmptyState 
            icon={<Users size={48} />} 
            title="No leads in this group" 
            description="Add existing leads, create new ones, or import from spreadsheets."
            action={
              <div className="flex gap-2">
                {activeGroupId && activeGroupId !== 'all' && (
                  <AddLeadsDropdown groupId={activeGroupId} groupName={activeGroupDetails?.name || 'Group'} />
                )}
              </div>
            }
          />
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {leads.map((lead: any) => (
              <LeadRow 
                key={lead.id} 
                lead={lead} 
                isInGroup={activeGroupId !== 'all'}
                onRemoveFromGroup={() => activeGroupId && removeLeadFromGroup.mutate({ groupId: activeGroupId, leadId: lead.id })}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      <LeadFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} params={searchParams} setParams={setSearchParams} />
      <AddLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} />
    </div>
  );
};

export default LeadsList;
