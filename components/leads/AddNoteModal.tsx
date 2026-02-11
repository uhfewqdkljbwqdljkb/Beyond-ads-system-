import React, { useState } from 'react';
import { Modal, Button, Textarea } from '../ui';
import { useLogNote } from '../../hooks/useActivities';
import { useAuthStore } from '../../store/authStore';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'lead' | 'deal' | 'client';
  entityId: string;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, entityType, entityId }) => {
  const [content, setContent] = useState('');
  const logNote = useLogNote();
  const user = useAuthStore(s => s.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await logNote.mutateAsync({
        entityType,
        entityId,
        content,
        userId: user?.id
      });
      setContent('');
      onClose();
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Internal Note" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea 
          label="Note" 
          placeholder="Type your notes here... (Visible only to team members)" 
          rows={4} 
          required 
          value={content} 
          onChange={e => setContent(e.target.value)} 
        />
        <div className="pt-4 flex justify-end gap-3 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={logNote.isPending}>Save Note</Button>
        </div>
      </form>
    </Modal>
  );
};