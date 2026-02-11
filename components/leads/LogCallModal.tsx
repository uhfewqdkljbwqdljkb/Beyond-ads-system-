import React, { useState } from 'react';
import { Modal, Button, Input, Textarea } from '../ui';
import { useToast } from '../ui/Toast';
import { PhoneCall, Clock, CheckCircle2 } from 'lucide-react';

interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'lead' | 'deal' | 'client';
  entityId: string;
  onSuccess?: () => void;
}

export const LogCallModal: React.FC<LogCallModalProps> = ({ isOpen, onClose, entityId }) => {
  const toast = useToast();
  const [outcome, setOutcome] = useState('Connected');
  const [duration, setDuration] = useState('5');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Call activity recorded');
    onClose();
  };

  const outcomes = ['Connected', 'No Answer', 'Voicemail', 'Gatekeeper', 'Wrong Number'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Sales Call" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" />
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Outcome</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {outcomes.map(o => (
              <button 
                type="button" 
                key={o} 
                onClick={() => setOutcome(o)}
                className={`px-3 py-2 text-[12px] font-bold border rounded-xl transition-all ${
                  outcome === o 
                    ? 'border-primary bg-primary-light text-primary shadow-sm ring-1 ring-primary/20' 
                    : 'border-zinc-100 bg-zinc-50/50 hover:border-zinc-200 text-zinc-500'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Duration</span>
              </div>
              <Input 
                type="number" 
                value={duration} 
                onChange={e => setDuration(e.target.value)} 
                rightIcon={<span className="text-[10px] font-black text-zinc-400 mr-2">MIN</span>}
              />
           </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <PhoneCall size={16} className="text-primary" />
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Call Notes</span>
          </div>
          <Textarea 
            placeholder="Discussed pricing tiers and onboarding timeline..." 
            rows={4} 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
          />
        </div>
        
        <div className="pt-4 flex justify-end gap-3 border-t border-zinc-50">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Log Call</Button>
        </div>
      </form>
    </Modal>
  );
};