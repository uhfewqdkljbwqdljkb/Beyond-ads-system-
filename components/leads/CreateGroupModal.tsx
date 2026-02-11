import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea } from '../ui';
import { useCreateGroup, useLeadGroups } from '../../hooks/useLeadGroups';
import { useAuthStore } from '../../store/authStore';
import { FolderPlus } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  editGroup?: any; // If passed, we are editing
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, editGroup }) => {
  const { user } = useAuthStore();
  const createGroup = useCreateGroup();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    is_shared: false,
  });

  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#F97316', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#6B7280', // Gray
    '#EC4899', // Pink
  ];

  useEffect(() => {
    if (editGroup) {
      setFormData({
        name: editGroup.name,
        description: editGroup.description || '',
        color: editGroup.color || '#3B82F6',
        is_shared: editGroup.is_shared || false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        is_shared: false,
      });
    }
  }, [editGroup, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editGroup) {
        // Handle update logic here if we add useUpdateGroup
        // await updateGroup.mutateAsync({ id: editGroup.id, ...formData });
      } else {
        await createGroup.mutateAsync({
          ...formData,
          created_by: user?.id,
        });
      }
      onClose();
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editGroup ? 'Edit Group' : 'Create Lead Group'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 p-3 bg-primary-light/20 rounded-xl border border-primary/10">
          <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
            <FolderPlus size={20} />
          </div>
          <p className="text-xs text-textSecondary">
            Groups allow you to organize leads into specific segments or campaigns.
          </p>
        </div>

        <Input 
          label="Group Name" 
          required 
          placeholder="e.g. Q1 Hot Leads" 
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />

        <Textarea 
          label="Description (Optional)" 
          rows={2} 
          placeholder="What is this group for?" 
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />

        <div>
          <label className="text-xs font-bold text-textSecondary mb-2 block uppercase tracking-wider">Color Label</label>
          <div className="flex flex-wrap gap-3">
            {colors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData({ ...formData, color: c })}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${formData.color === c ? 'ring-2 ring-offset-2 ring-zinc-400 scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }}
              >
                {formData.color === c && <div className="w-2 h-2 bg-white rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={createGroup.isPending}>
            {editGroup ? 'Save Changes' : 'Create Group'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};