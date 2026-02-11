import React from 'react';
import { Modal, Button, Badge, Avatar, Card } from '../ui';
import { format } from 'date-fns';
import { 
  DollarSign, Briefcase, FileText, CheckCircle2, 
  History, User, ExternalLink, Calculator, AlertCircle 
} from 'lucide-react';
import { CommissionStatusBadge } from './CommissionStatusBadge';
import { CommissionTypeBadge } from './CommissionTypeBadge';

interface CommissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commission: any;
  userRole: string;
  onApprove?: (id: string) => void;
  onMarkPaid?: (id: string) => void;
}

export const CommissionDetailModal: React.FC<CommissionDetailModalProps> = ({ 
  isOpen, onClose, commission, userRole, onApprove, onMarkPaid 
}) => {
  if (!commission) return null;

  const isManager = ['admin', 'sales_manager'].includes(userRole);
  const isPending = commission.status === 'pending';
  const isApproved = commission.status === 'approved';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Commission Details" size="lg">
      <div className="space-y-8">
        {/* Top Header Section */}
        <div className="flex items-center justify-between p-6 bg-surface rounded-2xl border border-border">
           <div>
              <p className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-1">Commission Payout</p>
              <h2 className="text-4xl font-black text-textPrimary">${commission.commission_amount.toLocaleString()}</h2>
           </div>
           <div className="text-right space-y-2">
              <CommissionStatusBadge status={commission.status} />
              <div className="block"><CommissionTypeBadge type={commission.commission_type} /></div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Deal Context */}
           <div className="space-y-4">
              <h4 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Deal Context</h4>
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={18} /></div>
                    <div>
                       <p className="text-sm font-bold text-textPrimary truncate max-w-[180px]">{commission.deals?.name}</p>
                       <p className="text-xs text-textSecondary">Base Value: ${commission.base_amount.toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><User size={18} /></div>
                    <div>
                       <p className="text-sm font-bold text-textPrimary">{commission.users?.first_name} {commission.users?.last_name}</p>
                       <p className="text-xs text-textSecondary">Sales Representative</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Calculation Breakdown */}
           <div className="space-y-4">
              <h4 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Breakdown</h4>
              <div className="bg-surface/50 rounded-xl p-3 border border-border space-y-2">
                 <div className="flex justify-between text-xs">
                    <span className="text-textSecondary">Base Amount</span>
                    <span className="font-bold">${commission.base_amount.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-textSecondary">Contract Rate</span>
                    <span className="font-bold">{commission.commission_rate}%</span>
                 </div>
                 <div className="pt-2 mt-2 border-t border-border flex justify-between text-sm font-black text-primary uppercase">
                    <span>Total Calculated</span>
                    <span>${commission.commission_amount.toLocaleString()}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
           <h4 className="text-xs font-black text-textMuted uppercase tracking-widest border-b border-border pb-2">Payment Timeline</h4>
           <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
              <div className="relative flex items-center gap-3">
                 <div className="absolute -left-6 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                 <span className="text-xs text-textSecondary">Earned on <span className="font-bold">{format(new Date(commission.earned_date), 'MMM d, yyyy')}</span></span>
              </div>
              {commission.approved_at && (
                <div className="relative flex items-center gap-3">
                   <div className="absolute -left-6 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                   <span className="text-xs text-textSecondary">Approved on <span className="font-bold">{format(new Date(commission.approved_at), 'MMM d, yyyy')}</span></span>
                </div>
              )}
              {commission.paid_at && (
                <div className="relative flex items-center gap-3">
                   <div className="absolute -left-6 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-sm" />
                   <span className="text-xs text-textSecondary font-bold text-emerald-600">Paid out on {format(new Date(commission.paid_at), 'MMM d, yyyy')}</span>
                </div>
              )}
           </div>
        </div>

        {/* Action Bar */}
        <div className="pt-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-white">
           <Button variant="ghost" onClick={onClose}>Close</Button>
           {isManager && isPending && (
             <Button variant="primary" onClick={() => onApprove?.(commission.id)}>Approve for Payout</Button>
           )}
           {isManager && isApproved && (
             <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onMarkPaid?.(commission.id)}>Record Payout</Button>
           )}
        </div>
      </div>
    </Modal>
  );
};