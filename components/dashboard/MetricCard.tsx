import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'red';
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  color = 'blue',
  trend,
  onClick,
}) => {
  const colorMaps = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <Card 
      onClick={onClick} 
      hover={!!onClick}
      className={`relative overflow-hidden group transition-all duration-300 border-none ring-1 ring-border shadow-sm`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">{label}</p>
          <h2 className="text-3xl font-black text-textPrimary tracking-tight">{value}</h2>
          
          <div className="flex items-center gap-2 pt-2">
            {trend && (
              <div className={`flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded ${trend.direction === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                {trend.direction === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                {trend.value}
              </div>
            )}
            {subtext && <span className="text-[11px] font-medium text-textSecondary">{subtext}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${colorMaps[color]} ring-4 ring-white shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
};