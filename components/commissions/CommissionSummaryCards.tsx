import React from 'react';
import { Card } from '../ui/Card';
import { HandCoins, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CommissionSummaryCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    paid: number;
  };
  isManager: boolean;
}

export const CommissionSummaryCards: React.FC<CommissionSummaryCardsProps> = ({ stats, isManager }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white">
         <div className="flex justify-between items-start">
            <div>
               <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">Total Earned</p>
               <h3 className="text-2xl font-black text-textPrimary mt-1">${stats.total.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-surface text-textSecondary rounded-lg"><HandCoins size={20} /></div>
         </div>
      </Card>
      
      <Card className="bg-amber-50/30 border-amber-100">
         <div className="flex justify-between items-start">
            <div>
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending Payment</p>
               <h3 className="text-2xl font-black text-textPrimary mt-1">${stats.pending.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Clock size={20} /></div>
         </div>
      </Card>

      <Card className="bg-blue-50/30 border-blue-100">
         <div className="flex justify-between items-start">
            <div>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Approved</p>
               <h3 className="text-2xl font-black text-textPrimary mt-1">${stats.approved.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><CheckCircle2 size={20} /></div>
         </div>
      </Card>

      <Card className="bg-emerald-50/30 border-emerald-100">
         <div className="flex justify-between items-start">
            <div>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Received / Paid</p>
               <h3 className="text-2xl font-black text-textPrimary mt-1">${stats.paid.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 size={20} /></div>
         </div>
      </Card>
    </div>
  );
};