import React from 'react';
import { 
  Building2, 
  Receipt, 
  Globe, 
  Upload, 
  Mail, 
  Phone, 
  MapPin,
  DollarSign
} from 'lucide-react';
import { Button, Input, Select, Textarea } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

const CompanySettings: React.FC = () => {
  const toast = useToast();

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Company settings updated');
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Building2 size={20} />
          <h3 className="text-lg font-bold text-textPrimary">Company Information</h3>
        </div>
        
        <form onSubmit={handleSaveCompany} className="space-y-6">
          <div className="flex items-center gap-6 p-6 bg-surface rounded-2xl border border-border">
             <div className="w-24 h-24 bg-white border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-textMuted hover:border-primary hover:text-primary transition-all cursor-pointer">
                <Upload size={24} className="mb-1" />
                <span className="text-[10px] font-bold">LOGO</span>
             </div>
             <div className="flex-1">
                <h4 className="text-sm font-bold text-textPrimary">Company Logo</h4>
                <p className="text-xs text-textSecondary mt-1">Resolution: 512x512px. JPG, PNG or SVG. Max 2MB.</p>
                <div className="flex gap-2 mt-3">
                   <Button size="sm" variant="outline">Upload New</Button>
                   <Button size="sm" variant="ghost" className="text-error">Remove</Button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Agency Name" defaultValue="Beyond Ads Digital" required />
            <Input label="Primary Email" leftIcon={<Mail size={16} />} defaultValue="hello@nexusdigital.com" />
            <Input label="Primary Phone" leftIcon={<Phone size={16} />} defaultValue="+1 (555) 123-4567" />
            <Input label="Website" leftIcon={<Globe size={16} />} defaultValue="https://nexusdigital.com" />
            <Textarea label="Business Address" className="md:col-span-2" rows={3} defaultValue="123 Agency Workspace Dr.&#10;Suite 500&#10;San Francisco, CA 94103" />
          </div>
          <Button type="submit">Save Company Details</Button>
        </form>
      </section>

      <section className="space-y-6 pt-10 border-t border-border">
        <div className="flex items-center gap-2 text-primary">
          <Receipt size={20} />
          <h3 className="text-lg font-bold text-textPrimary">Invoice Settings</h3>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Invoice Prefix" defaultValue="INV-" helperText="Added to the beginning of all invoice numbers." />
          <Input label="Default Due Days" type="number" defaultValue="15" helperText="Days after issue date until invoice is overdue." />
          <Select 
            label="Base Currency" 
            options={[{label: 'USD ($)', value: 'USD'}, {label: 'EUR (€)', value: 'EUR'}, {label: 'GBP (£)', value: 'GBP'}]} 
            value="USD" 
            onChange={() => {}} 
          />
          <Input label="Default Tax Rate (%)" type="number" defaultValue="0" leftIcon={<DollarSign size={16} />} />
          <Textarea label="Invoice Footer Text" className="md:col-span-2" placeholder="e.g. Please make checks payable to Beyond Ads Digital" rows={2} />
          <div className="md:col-span-2">
            <Button variant="secondary">Save Invoice Defaults</Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CompanySettings;