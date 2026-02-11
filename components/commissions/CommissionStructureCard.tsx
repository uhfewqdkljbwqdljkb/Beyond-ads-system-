import React from 'react';
import { Card, Badge, Button } from '../ui';
import { Info, Zap, TrendingUp } from 'lucide-react';

interface CommissionStructureCardProps {
  structure: any;
  user: any;
}

export const CommissionStructureCard: React.FC<CommissionStructureCardProps> = ({ structure, user }) => {
  // Mock tier progress
  const currentRevenue = 14500;
  const nextTierAt = 25000;
  const progress = (currentRevenue / nextTierAt) * 100;

  return (
    <Card title="Your Commission Structure" headerAction={<Info size={16} className="text-textMuted" />}>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-bold text-textPrimary">{structure?.name || 'Standard Agency Structure'}</h4>
            <p className="text-xs text-textSecondary mt-1">Type: <span className="font-bold">{structure?.type?.replace('_', ' ')}</span></p>
          </div>
          <Badge variant="primary">Active</Badge>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-border space-y-4">
           <div>
              <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-bold text-textSecondary uppercase">Tier 2 Progress</span>
                 <span className="text-xs font-black text-primary">${(nextTierAt - currentRevenue).toLocaleString()} to next tier</span>
              </div>
              <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                 <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg border border-border shadow-sm">
                 <p className="text-[10px] font-black text-textMuted uppercase">Current Rate</p>
                 <p className="text-xl font-black text-textPrimary">10%</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-border shadow-sm">
                 <p className="text-[10px] font-black text-textMuted uppercase">Next Tier</p>
                 <p className="text-xl font-black text-primary">12.5%</p>
              </div>
           </div>
        </div>

        <div className="space-y-3">
           <div className="flex items-center gap-3 text-xs text-textSecondary">
              <Zap size={14} className="text-amber-500" />
              <span>Commission triggers <span className="font-bold text-textPrimary">on full invoice payment</span>.</span>
           </div>
           <div className="flex items-center gap-3 text-xs text-textSecondary">
              <TrendingUp size={14} className="text-emerald-500" />
              <span>Upsells earn a <span className="font-bold text-textPrimary">flat 5% bonus</span> on top of base rate.</span>
           </div>
        </div>
      </div>
    </Card>
  );
};