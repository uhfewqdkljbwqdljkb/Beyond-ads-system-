import React, { useState } from 'react';
import { Modal, Button, Table, Avatar, Select, Input } from '../ui';
import { useUsers, useUpdateUser } from '../../hooks/useUsers';
import { useCommissionStructures } from '../../hooks/useCommissionStructures';
import { useToast } from '../../components/ui/Toast';

interface ManageTeamStructuresModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageTeamStructuresModal: React.FC<ManageTeamStructuresModalProps> = ({ isOpen, onClose }) => {
  const { data: usersData, isLoading: usersLoading } = useUsers({ role: 'sales_rep' }); // Filter for sales reps
  const { data: structures } = useCommissionStructures();
  const updateUser = useUpdateUser();
  const toast = useToast();

  const handleStructureChange = (userId: string, structureId: string) => {
    updateUser.mutate({ id: userId, commission_structure_id: structureId });
  };

  const handleTargetChange = (userId: string, target: string) => {
    // Only update on blur or Enter key in real app to avoid too many requests
    updateUser.mutate({ id: userId, monthly_target: parseFloat(target) || 0 });
  };

  const structureOptions = structures?.map(s => ({ value: s.id, label: s.name })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Team Commission Rules" size="xl">
      <div className="space-y-4">
        <p className="text-sm text-textSecondary bg-blue-50 border border-blue-100 p-3 rounded-lg">
          Assign commission structures and monthly targets to your sales team. Changes take effect immediately for new deals.
        </p>

        <div className="border border-border rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
          <Table>
            <Table.Header>
              <Table.Row hover={false}>
                <Table.HeaderCell>Sales Representative</Table.HeaderCell>
                <Table.HeaderCell>Commission Structure</Table.HeaderCell>
                <Table.HeaderCell>Monthly Target ($)</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {usersData?.data?.map((user: any) => (
                <Table.Row key={user.id} hover={false}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar name={`${user.first_name} ${user.last_name}`} src={user.avatar_url} size="sm" />
                      <div>
                        <p className="font-bold text-textPrimary">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-textSecondary">{user.email}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Select 
                      options={structureOptions} 
                      value={user.commission_structure_id || ''} 
                      onChange={(val) => handleStructureChange(user.id, val)}
                      className="w-full min-w-[200px]"
                      placeholder="Select Structure"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input 
                      type="number" 
                      defaultValue={user.monthly_target} 
                      onBlur={(e) => handleTargetChange(user.id, e.target.value)}
                      className="w-32"
                      placeholder="0.00"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
};