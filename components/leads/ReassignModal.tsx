import React, { useState } from 'react';
import { Modal, Button, Select } from '../ui';
import { useUsers } from '../../hooks/useUsers';
import { useUpdateLead } from '../../hooks/useLeads';

interface ReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  currentAssigneeId?: string;
}

export const ReassignModal: React.FC<ReassignModalProps> = ({ isOpen, onClose, leadId, currentAssigneeId }) => {
  const [newAssignee, setNewAssignee] = useState(currentAssigneeId || '');
  const { data: users } = useUsers();
  const updateLead = useUpdateLead();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignee === currentAssigneeId) {
      onClose();
      return;
    }
    try {
      await updateLead.mutateAsync({ id: leadId, assigned_to: newAssignee });
      onClose();
    } catch (err) {}
  };

  const repOptions = users?.data?.map(u => ({ value: u.id, label: `${u.first_name} ${u.last_name}` })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reassign Lead" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Select 
          label="New Owner" 
          options={repOptions} 
          value={newAssignee} 
          onChange={setNewAssignee} 
          required 
        />
        <div className="pt-4 grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={updateLead.isPending}>Reassign</Button>
        </div>
      </form>
    </Modal>
  );
};