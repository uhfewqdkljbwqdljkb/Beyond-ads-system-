import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea, DatePicker } from '../ui';
import { useToast } from '../ui/Toast';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    duration: '30',
    location: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Meeting scheduled successfully');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Meeting" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Meeting Title" 
          placeholder="e.g. Discovery Call" 
          required 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <DatePicker 
            label="Date & Time" 
            required 
            value={formData.date} 
            onChange={val => setFormData({...formData, date: val})} 
          />
          <Select 
            label="Duration" 
            options={[
              {label: '15 min', value: '15'},
              {label: '30 min', value: '30'},
              {label: '45 min', value: '45'},
              {label: '1 hour', value: '60'},
              {label: '1.5 hours', value: '90'}
            ]} 
            value={formData.duration} 
            onChange={val => setFormData({...formData, duration: val})} 
          />
        </div>

        <Input 
          label="Location / Link" 
          placeholder="Google Meet or Office Address" 
          value={formData.location} 
          onChange={e => setFormData({...formData, location: e.target.value})} 
        />
        
        <Textarea 
          label="Description" 
          rows={3} 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
        />

        <div className="pt-4 flex justify-end gap-3 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Schedule</Button>
        </div>
      </form>
    </Modal>
  );
};