
import React from 'react';
import { Badge } from '../ui/Badge';

interface InvoiceStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'paid': return 'success';
      case 'sent': return 'primary';
      case 'overdue': return 'error';
      case 'draft': return 'default';
      case 'partially_paid': return 'warning';
      case 'cancelled': return 'default';
      default: return 'default' as any;
    }
  };

  return (
    <Badge 
      variant={getVariant(status)} 
      size={size} 
      className={`capitalize font-bold ${className}`}
      dot
    >
      {status.replace('_', ' ')}
    </Badge>
  );
};
