
import React from 'react';
import { Badge } from '../ui/Badge';

interface CommissionTypeBadgeProps {
  type: string;
  size?: 'sm' | 'md';
}

export const CommissionTypeBadge: React.FC<CommissionTypeBadgeProps> = ({ type, size = 'sm' }) => {
  const getVariant = (t: string) => {
    switch (t.toLowerCase()) {
      case 'new_business': return 'primary';
      case 'upsell': return 'purple';
      case 'recurring': return 'success';
      case 'renewal': return 'warning';
      default: return 'default' as any;
    }
  };

  return (
    <Badge 
      variant={getVariant(type)} 
      size={size} 
      className="uppercase tracking-tighter text-[10px]"
    >
      {type.replace('_', ' ')}
    </Badge>
  );
};
