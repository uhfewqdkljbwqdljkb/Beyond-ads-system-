
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../ui';
import { useCreateLead } from '../../hooks/useLeads';
import { useUsers } from '../../hooks/useUsers';
import { useLeadSources } from '../../hooks/useSettings';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../ui/Toast';
import { Mail, Phone, Globe, DollarSign, User, Building2, MapPin, ChevronRight, ArrowLeft, FileText } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const createLead = useCreateLead();
  const { data: usersData } = useUsers({});
  const { data: leadSources } = useLeadSources();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const initialFormState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
    city: '',
    country: '',
    status: 'new',
    estimated_value: '',
    lead_source_id: '',
    assigned_to: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Reset step when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      // Pre-select current user as assignee if available
      if (user?.id) {
        setFormData(prev => ({ ...prev, assigned_to: user.id }));
      }
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLead.mutateAsync({
        ...formData,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : 0,
        // Ensure empty strings for UUIDs are sent as null to prevent DB errors
        assigned_to: formData.assigned_to || null,
        lead_source_id: formData.lead_source_id || null,
        // Set ownership for RLS policies
        created_by: user?.id
      });
      toast.success('Lead created successfully!');
      setFormData(initialFormState);
      setStep(1);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create lead');
    }
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Lost', value: 'lost' },
  ];

  const sourceOptions = leadSources?.map((s: any) => ({ label: s.name, value: s.id })) || [];
  const userOptions = usersData?.data?.map((u: any) => ({ label: `${u.first_name} ${u.last_name}`, value: u.id })) || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add New Lead" 
      size="md"
      currentStep={step}
      totalSteps={totalSteps}
    >
      <form onSubmit={handleSubmit} className="flex flex-col min-h-[400px]">
        <div className="flex-1 py-2">
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
              <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                <User size={18} className="text-primary" />
                <h4 className="text-sm font-bold text-textPrimary">Contact Information</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="e.g. Jane"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  autoFocus
                />
                <Input
                  label="Last Name"
                  placeholder="e.g. Doe"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="jane@example.com"
                required
                leftIcon={<Mail size={16} />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone"
                placeholder="+1 (555) 000-0000"
                leftIcon={<Phone size={16} />}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          )}

          {/* Step 2: Company Details */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
              <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                <Building2 size={18} className="text-primary" />
                <h4 className="text-sm font-bold text-textPrimary">Company Details</h4>
              </div>

              <div className="space-y-4">
                <Input
                  label="Company Name"
                  placeholder="e.g. Acme Corp"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  autoFocus
                />
                <Input
                  label="Website"
                  placeholder="https://acme.com"
                  leftIcon={<Globe size={16} />}
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="San Francisco"
                    leftIcon={<MapPin size={16} />}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="Country"
                    placeholder="USA"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Lead Qualification */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
              <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                <DollarSign size={18} className="text-primary" />
                <h4 className="text-sm font-bold text-textPrimary">Qualification & Value</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                />
                <Input
                  label="Est. Value ($)"
                  type="number"
                  placeholder="0.00"
                  value={formData.estimated_value}
                  onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                />
              </div>
              <Select
                label="Lead Source"
                placeholder="Select source..."
                options={sourceOptions}
                value={formData.lead_source_id}
                onChange={(val) => setFormData({ ...formData, lead_source_id: val })}
              />
              <Select
                label="Assign To"
                placeholder="Select team member..."
                options={userOptions}
                value={formData.assigned_to}
                onChange={(val) => setFormData({ ...formData, assigned_to: val })}
              />
            </div>
          )}

          {/* Step 4: Additional Notes */}
          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
              <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                <FileText size={18} className="text-primary" />
                <h4 className="text-sm font-bold text-textPrimary">Notes & Context</h4>
              </div>

              <Textarea
                label="Additional Notes"
                rows={8}
                placeholder="Enter any background context, specific requirements, or initial thoughts..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              isLoading={createLead.isPending}
            >
              Create Lead
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};
