import React from 'react';
import { Badge } from '../ui/Badge';

interface LeadScoreBadgeProps {
  score: number;
  showBar?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({ 
  score, 
  showBar = false, 
  size = 'md',
  className = ''
}) => {
  const getVariant = (val: number) => {
    if (val >= 70) return 'success';
    if (val >= 40) return 'warning';
    return 'error';
  };

  const getBarColor = (val: number) => {
    if (val >= 70) return 'bg-success';
    if (val >= 40) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <Badge variant={getVariant(score)} size={size} className="font-bold">
          {score}
        </Badge>
        {showBar && <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Score</span>}
      </div>
      
      {showBar && (
        <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden border border-border/50">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${getBarColor(score)}`} 
            style={{ width: `${score}%` }} 
          />
        </div>
      )}
    </div>
  );
};