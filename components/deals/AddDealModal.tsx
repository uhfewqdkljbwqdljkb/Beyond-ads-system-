
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea, DatePicker } from '../ui';
import { useCreateDeal } from '../../hooks/useDeals';
import { useClients } from '../../hooks/useClients';
import { usePipelineStages } from '../../hooks/usePipeline';
import { useUsers } from '../../hooks/useUsers';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../ui/Toast';
import { DollarSign, Briefcase, Calendar, User, FileText, ChevronRight, ArrowLeft, Target } from 'lucide-react';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDealModal: React.FC<AddDealModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const createDeal = useCreateDeal();
  const { data: clientsData } = useClients({ limit: 100 });
  const { data: stages } = usePipelineStages();
  const { data: usersData } = useUsers({});
  const toast = useToast();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const initialFormState = {
    name: '',
    client_id: '',
    deal_value: '',
    deal_type: 'project',
    pipeline_stage_id: '',
    expected_close_date: '',
    win_probability: 50,
    assigned_to: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Reset form and set default assignee when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData(initialFormState);
      if (user?.id) {
        setFormData(prev => ({ ...prev, assigned_to: user.id }));
      }
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDeal.mutateAsync({
        ...formData,
        deal_value: parseFloat(formData.deal_value) || 0,
        win_probability: Number(formData.win_probability),
        client_id: formData.client_id || null,
        pipeline_stage_id: formData.pipeline_stage_id || null,
        assigned_to: formData.assigned_to || null,
        created_by: user?.id
      });
      toast.success('Deal created successfully!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create deal');
    }
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const dealTypeOptions = [
    { label: 'Project', value: 'project' },
    { label: 'Retainer', value: 'retainer' },
    { label: 'Hybrid', value: 'hybrid' },
  ];

  const clientOptions = clientsData?.data?.map((c: any) => ({ label: c.company_name, value: c.id })) || [];
  const stageOptions = stages?.map((s: any) => ({ label: s.name, value: s.id })) || [];
  const userOptions = usersData?.data?.map((u: any) => ({ label: `${u.first_name} ${u.last_name}`, value: u.id })) || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add New Deal" 
      size="md"
      currentStep={step}
      totalSteps={totalSteps}
    >
      <form onSubmit={handleSubmit} className="flex flex-col min-h-[400px]">
        <div className="flex-1 py-2">
          
          {/* Step 1: Deal Essentials */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
              <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                <Briefcase size={18} className="text-primary" />
                <h4 className="text-sm font-bold text-textPrimary">Deal Essentials</h4>
              </div>

              <Input
                label="Deal Name"
                placeholder="e.g. Q4 Marketing Campaign"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoFocus
              />
              
              <Select
                label="Client"
                placeholder="Select client..."
                required
                options={clientOptions}
                value={formData.client_id}
                onChange={(val) => setFormData({ ...formData, client_id: val })}
              />

              <Select
                label="Deal Type"
                required
                options={dealTypeOptions}
                value={formData.deal_type}
                onChange={(val) => setFormData({ ...formData, deal_type: val })}
              />
            </div>
          )}

          {/* Step 2: Financials & Timeline */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
              <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                <DollarSign size={18} className="text-primary" />
                <h4 className="text-sm font-bold text-textPrimary">Value & Timeline</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Deal Value ($)"
                  type="number"
                  placeholder="0.00"
                  required
                  value={formData.deal_value}
                  onChange={(e) => setFormData({ ...formData, deal_value: e.target.value })}
                  autoFocus
                />
                <Select
                  label="Pipeline Stage"
                  placeholder="Select stage..."
                  required
                  options={stageOptions}
                  value={formData.pipeline_stage_id}
                  onChange={(val) => setFormData({ ...formData, pipeline_stage_id: val })}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs font-medium text-zinc-700">Win Probability</label>
                  <span className="text-xs font-bold text-primary">{formData.win_probability}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  value={formData.win_probability}
                  onChange={(e) => setFormData({ ...formData, win_probability: Number(e.target.value) })}
                />
                <div className="flex justify-between text-[10px] text-textMuted px-1">
                  <span>Low</span>
                  <span>Likely</span>
                  <span>Won</span>
                </div>
              </div>

              <DatePicker
                label="Expected Close Date"
                value={formData.expected_close_date}
                onChange={(val) => setFormData({ ...formData, expected_close_date: val })}
              />
            </div>
          )}

          {/* Step 3: Ownership & Context */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
              <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                <User size={18} className="text-primary" />
                <h4 className="text-sm font-bold text-textPrimary">Ownership & Context</h4>
              </div>

              <Select
                label="Deal Owner"
                placeholder="Select owner..."
                options={userOptions}
                value={formData.assigned_to}
                onChange={(val) => setFormData({ ...formData, assigned_to: val })}
              />

              <Textarea
                label="Description & Notes"
                rows={6}
                placeholder="Enter scope details, key requirements, or next steps..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-6 mt-2 border-t border-border">
          {step > 1 ? (
            <Button 
              variant="ghost" 
              type="button" 
              onClick={handleBack} 
              leftIcon={<ArrowLeft size={16} />}
            >
              Back
            </Button>
          ) : (
            <div /> // Spacer
          )}
          
          {step < totalSteps ? (
            <Button 
              type="button" 
              onClick={handleNext} 
              rightIcon={<ChevronRight size={16} />}
            >
              Next Step
            </Button>
          ) : (
            <Button 
              type="submit" 
              isLoading={createDeal.isPending}
            >
              Create Deal
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};
