
import React, { useState } from 'react';
import { Modal, Button, SearchInput, Checkbox, Avatar, Spinner } from '../ui';
import { useLeads } from '../../hooks/useLeads';
import { useAddLeadsToGroup } from '../../hooks/useLeadGroups';
import { useAuthStore } from '../../store/authStore';

interface AddExistingLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

export const AddExistingLeadsModal: React.FC<AddExistingLeadsModalProps> = ({ isOpen, onClose, groupId, groupName }) => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Use specific query to get leads NOT in this group
  const { data: leadsData, isLoading } = useLeads({ 
    search, 
    limit: 20, 
    notInGroupId: groupId 
  });
  
  const addLeads = useAddLeadsToGroup();

  const handleToggle = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    try {
      await addLeads.mutateAsync({
        groupId,
        leadIds: selectedIds,
        userId: user?.id
      });
      onClose();
      setSelectedIds([]);
      setSearch('');
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Existing Leads to "${groupName}"`} size="md">
      <div className="space-y-4">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search available leads..." 
          className="w-full"
        />

        <div className="h-[300px] overflow-y-auto border border-border rounded-xl bg-zinc-50/50 p-2 space-y-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : leadsData?.data?.length === 0 ? (
            <div className="text-center py-10 text-textMuted text-sm">No leads found available to add.</div>
          ) : (
            leadsData?.data?.map((lead: any) => (
              <div 
                key={lead.id} 
                onClick={() => handleToggle(lead.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedIds.includes(lead.id) ? 'bg-primary-light border border-primary/20' : 'hover:bg-white border border-transparent'}`}
              >
                <Checkbox checked={selectedIds.includes(lead.id)} onChange={() => {}} className="pointer-events-none" />
                <Avatar name={`${lead.first_name} ${lead.last_name}`} size="xs" src={lead.avatar_url} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-textPrimary truncate">{lead.first_name} {lead.last_name}</p>
                  <p className="text-[10px] text-textSecondary truncate">{lead.company_name || lead.email}</p>
                </div>
                <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-500 capitalize">{lead.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-xs font-bold text-textSecondary">{selectedIds.length} leads selected</span>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={selectedIds.length === 0} isLoading={addLeads.isPending}>
              {selectedIds.length > 0 ? `Add ${selectedIds.length} Leads` : 'Add Selected'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
