import React from 'react';
import { Mail, Phone, Globe, ExternalLink, Edit3, Copy } from 'lucide-react';
import { Card } from '../ui/Card';
import { useToast } from '../ui/Toast';

interface LeadInfoCardProps {
  lead: any;
  onEdit: () => void;
}

export const LeadInfoCard: React.FC<LeadInfoCardProps> = ({ lead, onEdit }) => {
  const toast = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Card title="Lead Information" headerAction={
      <button className="p-1 hover:bg-surface rounded text-primary" onClick={onEdit}>
        <Edit3 size={16} />
      </button>
    }>
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="group flex items-center justify-between p-2 hover:bg-surface rounded-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail size={16} />
              </div>
              <div onClick={() => window.location.href = `mailto:${lead.email}`} className="cursor-pointer">
                <p className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-textPrimary truncate max-w-[150px]">{lead.email}</p>
              </div>
            </div>
            <button onClick={() => copyToClipboard(lead.email, 'Email')} className="p-1 text-textMuted opacity-0 group-hover:opacity-100 hover:text-primary transition-all">
              <Copy size={14} />
            </button>
          </div>

          <div className="group flex items-center justify-between p-2 hover:bg-surface rounded-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Phone size={16} />
              </div>
              <div onClick={() => lead.phone && (window.location.href = `tel:${lead.phone}`)} className="cursor-pointer">
                <p className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Phone</p>
                <p className="text-sm font-medium text-textPrimary">{lead.phone || 'Not provided'}</p>
              </div>
            </div>
            {lead.phone && (
              <button onClick={() => copyToClipboard(lead.phone, 'Phone')} className="p-1 text-textMuted opacity-0 group-hover:opacity-100 hover:text-primary transition-all">
                <Copy size={14} />
              </button>
            )}
          </div>

          <div className="group flex items-center justify-between p-2 hover:bg-surface rounded-lg transition-all cursor-pointer" onClick={() => lead.website && window.open(lead.website, '_blank')}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Globe size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Website</p>
                <p className="text-sm font-medium text-textPrimary truncate max-w-[150px]">{lead.website || '-'}</p>
              </div>
            </div>
            <ExternalLink size={14} className="text-textMuted opacity-0 group-hover:opacity-100" />
          </div>
        </div>

        <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
           <div>
              <p className="text-[10px] font-bold text-textMuted uppercase">Industry</p>
              <p className="text-xs font-semibold text-textPrimary">{lead.industries?.name || 'Uncategorized'}</p>
           </div>
           <div>
              <p className="text-[10px] font-bold text-textMuted uppercase">Company Size</p>
              <p className="text-xs font-semibold text-textPrimary">{lead.company_size || '-'}</p>
           </div>
           <div>
              <p className="text-[10px] font-bold text-textMuted uppercase">Source</p>
              <p className="text-xs font-semibold text-textPrimary">{lead.lead_sources?.name || '-'}</p>
           </div>
           <div>
              <p className="text-[10px] font-bold text-textMuted uppercase">Est. Value</p>
              <p className="text-xs font-bold text-success">${lead.estimated_value?.toLocaleString() || '0'}</p>
           </div>
        </div>
      </div>
    </Card>
  );
};