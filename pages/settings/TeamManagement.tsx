import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit3, 
  UserX, 
  ShieldCheck, 
  Mail,
  UserPlus
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Table, 
  Avatar, 
  Badge, 
  Dropdown, 
  Modal, 
  Input, 
  Select, 
  Tabs 
} from '../../components/ui';
import { useUsers } from '../../hooks/useUsers';
import { useCommissionStructures } from '../../hooks/useCommissionStructures';

const TeamManagement: React.FC = () => {
  const { data: usersData, isLoading } = useUsers();
  const { data: structures } = useCommissionStructures();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Sales Manager', value: 'sales_manager' },
    { label: 'Team Lead', value: 'team_lead' },
    { label: 'Sales Rep', value: 'sales_rep' },
  ];

  const commOptions = structures?.map(s => ({ value: s.id, label: s.name })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-textPrimary">Team Management</h1>
          <p className="text-sm text-textSecondary">Manage your sales organization and hierarchy</p>
        </div>
        <Button leftIcon={<UserPlus size={18} />} onClick={() => setIsAddModalOpen(true)}>Add Team Member</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs defaultValue="all" className="flex-1">
          <Tabs.List>
            <Tabs.Tab value="all">All Members</Tabs.Tab>
            <Tabs.Tab value="sales_rep">Sales Reps</Tabs.Tab>
            <Tabs.Tab value="management">Management</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <div className="relative w-full md:w-64">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
           <input className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Search team..." />
        </div>
      </div>

      <Card padding="none" className="overflow-hidden border-border/50">
        <Table>
          <Table.Header>
            <Table.Row hover={false}>
              <Table.HeaderCell>Member</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Commission Structure</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell align="right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {usersData?.data?.map((u: any) => (
              <Table.Row key={u.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <Avatar name={`${u.first_name} ${u.last_name}`} src={u.avatar_url} size="sm" />
                    <div>
                      <p className="font-bold text-textPrimary">{u.first_name} {u.last_name}</p>
                      <p className="text-[11px] text-textSecondary">{u.email}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={u.role === 'admin' ? 'purple' : 'primary'}>{u.role.replace('_', ' ')}</Badge>
                </Table.Cell>
                <Table.Cell>
                   <span className="text-xs font-medium text-textPrimary">{structures?.find(s => s.id === u.commission_structure_id)?.name || 'Default Structure'}</span>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={u.status === 'active' ? 'success' : 'warning'} size="sm" dot>{u.status}</Badge>
                </Table.Cell>
                <Table.Cell align="right">
                  <Dropdown trigger={<button className="p-1 hover:bg-surface rounded-md"><MoreHorizontal size={16} /></button>} align="right">
                    <Dropdown.Item icon={<Edit3 size={14} />}>Edit User</Dropdown.Item>
                    <Dropdown.Item icon={<ShieldCheck size={14} />}>Change Role</Dropdown.Item>
                    <Dropdown.Item icon={<Mail size={14} />}>Resend Credentials</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item danger icon={<UserX size={14} />}>Deactivate</Dropdown.Item>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Invite Team Member" size="lg">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <Input label="First Name" required />
             <Input label="Last Name" required />
          </div>
          <Input label="Email Address" type="email" required />
          <div className="grid grid-cols-2 gap-4">
             <Select label="Role" options={roles} value="sales_rep" onChange={() => {}} />
             <Select label="Commission Structure" options={commOptions} value="" onChange={() => {}} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Input label="Monthly Target ($)" type="number" placeholder="0.00" />
             <Input label="Start Date" type="date" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Invite Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamManagement;