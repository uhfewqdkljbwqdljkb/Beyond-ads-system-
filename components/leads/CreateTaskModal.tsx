import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea, DatePicker } from '../ui';
import { useCreateTask } from '../../hooks/useTasks';
import { useUsers } from '../../hooks/useUsers';
import { useAuthStore } from '../../store/authStore';
import { ChevronRight, ArrowLeft, ListTodo, Zap } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType?: 'lead' | 'deal' | 'client';
  entityId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, entityType, entityId }) => {
  const createTask = useCreateTask();
  const { data: users } = useUsers();
  const currentUser = useAuthStore(s => s.user);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    task_type: 'follow_up',
    priority: 'medium',
    due_date: '',
    assigned_to: currentUser?.id || '',
    description: ''
  });

  const handleSubmit = async () => {
    try {
      await createTask.mutateAsync({
        ...formData,
        entity_type: entityType,
        entity_id: entityId,
        status: 'pending',
        created_by: currentUser?.id
      });
      onClose();
      setStep(1);
      setFormData({
        title: '', task_type: 'follow_up', priority: 'medium', due_date: '',
        assigned_to: currentUser?.id || '', description: ''
      });
    } catch (err) {}
  };

  const repOptions = users?.data?.map(u => ({ value: u.id, label: `${u.first_name} ${u.last_name}` })) || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="New Action Item" 
      currentStep={step} 
      totalSteps={2} 
      size="sm"
    >
      <div className="min-h-[300px] flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <ListTodo size={16} className="text-primary" />
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Task Details</span>
              </div>
              <Input 
                label="What needs to be done?" 
                placeholder="e.g. Follow up on Q4 Proposal" 
                required 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
              />
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Category" 
                  options={[
                    {label: 'Call', value: 'call'},
                    {label: 'Email', value: 'email'},
                    {label: 'Meeting', value: 'meeting'},
                    {label: 'Follow up', value: 'follow_up'},
                    {label: 'Research', value: 'other'}
                  ]} 
                  value={formData.task_type} 
                  onChange={val => setFormData({ ...formData, task_type: val })} 
                />
                <Select 
                  label="Priority" 
                  options={[
                    {label: 'Low', value: 'low'},
                    {label: 'Medium', value: 'medium'},
                    {label: 'High', value: 'high'},
                    {label: 'Urgent', value: 'urgent'}
                  ]} 
                  value={formData.priority} 
                  onChange={val => setFormData({ ...formData, priority: val })} 
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-primary" />
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Execution</span>
              </div>
              <DatePicker 
                label="Due Date" 
                required 
                value={formData.due_date} 
                onChange={val => setFormData({ ...formData, due_date: val })} 
              />
              <Select 
                label="Assigned To" 
                options={repOptions} 
                value={formData.assigned_to} 
                onChange={val => setFormData({ ...formData, assigned_to: val })} 
              />
              <Textarea 
                label="Additional Context" 
                rows={3} 
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Specific instructions or notes..."
              />
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={() => setStep(1)} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
              <ArrowLeft size={14} /> Back
            </button>
          ) : <div />}
          
          {step < 2 ? (
            <Button onClick={() => setStep(2)} rightIcon={<ChevronRight size={16} />}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={createTask.isPending}>Create Task</Button>
          )}
        </div>
      </div>
    </Modal>
  );
};