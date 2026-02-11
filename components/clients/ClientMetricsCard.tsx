import React from 'react';
import { Card } from '../ui/Card';

interface ClientMetricsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
  colorClass?: string;
}

export const ClientMetricsCard: React.FC<ClientMetricsCardProps> = ({ label, value, icon, subtext, colorClass = 'text-primary' }) => {
  return (
    <Card padding="sm" className="flex-1">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-surface ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-lg font-black text-textPrimary leading-none">{value}</p>
          {subtext && <p className="text-[10px] text-textSecondary mt-1">{subtext}</p>}
        </div>
      </div>
    </Card>
  );
};