
import React from 'react';
import { Badge } from '../ui/Badge';

interface CommissionStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const CommissionStatusBadge: React.FC<CommissionStatusBadgeProps> = ({ status, size = 'md' }) => {
  const getVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'paid': return 'success';
      case 'approved': return 'primary';
      case 'pending': return 'warning';
      case 'clawed_back': return 'error';
      default: return 'default' as any;
    }
  };

  return (
    <Badge 
      variant={getVariant(status)} 
      size={size} 
      className="capitalize font-bold"
      dot
    >
      {status.replace('_', ' ')}
    </Badge>
  );
};
