import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea, DatePicker, Checkbox } from '../ui';
import { useCreateDeal } from '../../hooks/useDeals';
import { useClients } from '../../hooks/useClients';
import { useServices } from '../../hooks/useSettings';
import { usePipelineStages } from '../../hooks/usePipeline';
import { useUsers } from '../../hooks/useUsers';
import { useAuthStore } from '../../store/authStore';
import { ChevronRight, ArrowLeft, Target, Briefcase, HandCoins } from 'lucide-react';

export const AddDealModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const currentUser = useAuthStore(s => s.user);
  const createDeal = useCreateDeal();
  const { data: clientsData } = useClients({ limit: 100 });
  const { data: services } = useServices();
  const { data: stages } = usePipelineStages();
  const { data: usersData } = useUsers();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    deal_type: 'retainer',
    pipeline_stage_id: '',
    expected_close_date: '',
    win_probability: 50,
    assigned_to: currentUser?.id || '',
    notes: '',
    deal_value: 0
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (service: any) => {
    const isSelected = selectedServices.includes(service.id);
    const newSelected = isSelected 
      ? selectedServices.filter(id => id !== service.id)
      : [...selectedServices, service.id];
    
    const newValue = isSelected 
      ? formData.deal_value - (service.default_price || 0)
      : formData.deal_value + (service.default_price || 0);

    setSelectedServices(newSelected);
    setFormData(prev => ({ ...prev, deal_value: newValue }));
  };

  const handleCreate = async () => {
    try {
      await createDeal.mutateAsync({
        ...formData,
        status: 'open',
        pipeline_stage_id: formData.pipeline_stage_id || stages?.[0]?.id,
        services: selectedServices // Handled by service layer to create deal_services
      });
      onClose();
      setStep(1);
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Revenue Opportunity" currentStep={step} totalSteps={3} size="lg">
      <div className="min-h-[380px] flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Input 
                label="Opportunity Name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Q4 Website Relaunch" 
              />
              <Select 
                label="Client Account" 
                options={clientsData?.data?.map((c: any) => ({ value: c.id, label: c.company_name })) || []} 
                value={formData.client_id} 
                onChange={val => setFormData({...formData, client_id: val})} 
              />
              <Select 
                label="Contract Type" 
                options={[{label: 'Monthly Retainer', value: 'retainer'}, {label: 'One-time Project', value: 'one_time'}]} 
                value={formData.deal_type} 
                onChange={val => setFormData({...formData, deal_type: val})} 
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-2">Service Catalog</p>
              <div className="grid grid-cols-2 gap-3">
                {services?.map((s: any) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      selectedServices.includes(s.id) 
                        ? 'border-primary bg-primary-light ring-1 ring-primary/20' 
                        : 'border-zinc-100 bg-zinc-50/50 hover:border-zinc-200'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{s.name}</p>
                      <p className="text-[10px] text-zinc-500">${s.default_price?.toLocaleString()}</p>
                    </div>
                    {selectedServices.includes(s.id) && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 bg-zinc-900 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Projected Value</p>
                  <p className="text-xl font-black text-white">${formData.deal_value.toLocaleString()}</p>
                </div>
                <HandCoins className="text-zinc-700" size={24} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Initial Pipeline Stage" 
                  options={stages?.map((s: any) => ({ value: s.id, label: s.name })) || []} 
                  value={formData.pipeline_stage_id} 
                  onChange={val => setFormData({...formData, pipeline_stage_id: val})} 
                />
                <Input 
                  label="Win Confidence (%)" 
                  type="number" 
                  value={formData.win_probability} 
                  onChange={e => setFormData({...formData, win_probability: parseInt(e.target.value)})} 
                />
              </div>
              <DatePicker 
                label="Target Close Date" 
                value={formData.expected_close_date} 
                onChange={val => setFormData({...formData, expected_close_date: val})} 
              />
              <Select 
                label="Opportunity Owner" 
                options={usersData?.data?.map((u: any) => ({ value: u.id, label: u.first_name })) || []} 
                value={formData.assigned_to} 
                onChange={val => setFormData({...formData, assigned_to: val})} 
              />
              <Textarea label="Opportunity Notes" rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Strategic goals..." />
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
              <ArrowLeft size={14} /> Back
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)} rightIcon={<ChevronRight size={16} />}>Continue</Button>
          ) : (
            <Button onClick={handleCreate} isLoading={createDeal.isPending}>Add to Pipeline</Button>
          )}
        </div>
      </div>
    </Modal>
  );
};