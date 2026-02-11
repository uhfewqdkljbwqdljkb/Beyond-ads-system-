
import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'red';
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  color = 'blue',
  trend,
  onClick,
  className = '',
}) => {
  const colorMaps = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <Card 
      onClick={onClick} 
      hover={!!onClick} 
      padding="md" 
      className={`relative overflow-hidden group transition-all ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-[10px] font-black text-textMuted uppercase tracking-widest leading-none mb-2">{label}</p>
          <h2 className="text-2xl font-black text-textPrimary tracking-tight">{value}</h2>
          
          {(subtext || trend) && (
            <div className="flex items-center mt-3 gap-2">
              {trend && (
                <div className={`flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-full ${trend.direction === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                  {trend.direction === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                  {trend.value}
                </div>
              )}
              {subtext && <span className="text-[10px] font-bold text-textMuted uppercase">{subtext}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-2xl ${colorMaps[color]} ring-4 ring-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            {React.cloneElement(icon as React.ReactElement, { size: 24 })}
          </div>
        )}
      </div>
    </Card>
  );
};
