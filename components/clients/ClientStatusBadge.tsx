
import React from 'react';
import { Badge } from '../ui/Badge';

interface ClientStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const ClientStatusBadge: React.FC<ClientStatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'churned': return 'error';
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
      {status}
    </Badge>
  );
};
