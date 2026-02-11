import React, { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../ui';
import { useToast } from '../ui/Toast';

interface LogEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'lead' | 'deal' | 'client';
  entityId: string;
}

export const LogEmailModal: React.FC<LogEmailModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [direction, setDirection] = useState('outbound');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Email logged successfully');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Email" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select 
          label="Direction" 
          options={[{label: 'Sent (Outbound)', value: 'outbound'}, {label: 'Received (Inbound)', value: 'inbound'}]} 
          value={direction} 
          onChange={setDirection} 
        />
        <Input 
          label="Subject" 
          placeholder="e.g. Follow up on proposal" 
          required 
          value={subject} 
          onChange={e => setSubject(e.target.value)} 
        />
        <Textarea 
          label="Email Content" 
          placeholder="Paste email content here..." 
          rows={5} 
          value={content} 
          onChange={e => setContent(e.target.value)} 
        />
        <div className="pt-4 flex justify-end gap-3 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Email</Button>
        </div>
      </form>
    </Modal>
  );
};