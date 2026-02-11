
import React from 'react';
import { Card } from '../ui/Card';
import { ChevronRight } from 'lucide-react';

interface MobileCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  avatar?: React.ReactNode;
  metrics?: { label: string; value: string | number }[];
  onClick?: () => void;
  actions?: React.ReactNode;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  title,
  subtitle,
  badge,
  avatar,
  metrics,
  onClick,
  actions
}) => {
  return (
    <Card 
      onClick={onClick} 
      padding="none" 
      className="active:scale-[0.98] transition-transform shadow-sm overflow-hidden"
    >
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {avatar}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-textPrimary truncate">{title}</h4>
              {badge}
            </div>
            {subtitle && <p className="text-xs text-textSecondary truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {onClick && <ChevronRight size={16} className="text-textMuted shrink-0 mt-1" />}
      </div>

      {metrics && metrics.length > 0 && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-4">
          {metrics.map((m, i) => (
            <div key={i}>
              <p className="text-[10px] font-black text-textMuted uppercase tracking-widest leading-none mb-1">{m.label}</p>
              <p className="text-xs font-bold text-textPrimary">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {actions && (
        <div className="px-4 py-2 bg-surface border-t border-border flex justify-end gap-2">
          {actions}
        </div>
      )}
    </Card>
  );
};
