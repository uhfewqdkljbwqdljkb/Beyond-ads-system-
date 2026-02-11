
import React from 'react';
import { Badge } from '../ui/Badge';

interface LeadStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'new': return 'primary';
      case 'contacted': return 'warning';
      case 'qualified': return 'success';
      case 'nurturing': return 'purple';
      case 'unqualified': return 'error';
      case 'converted': return 'success';
      case 'lost': return 'error';
      default: return 'default' as any;
    }
  };

  return (
    <Badge 
      variant={getVariant(status)} 
      size={size} 
      className={`capitalize ${className}`}
      dot
    >
      {status.replace('_', ' ')}
    </Badge>
  );
};
