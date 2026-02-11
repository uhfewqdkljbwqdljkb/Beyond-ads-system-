import React from 'react';
import { Edit3, ExternalLink, Mail, Phone, Globe, MapPin, Receipt } from 'lucide-react';
import { Card } from '../ui/Card';

interface ClientInfoCardProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const ClientInfoCard: React.FC<ClientInfoCardProps> = ({ title, onEdit, children, icon }) => {
  return (
    <Card title={title} headerAction={
      <button className="p-1 hover:bg-surface rounded text-primary" onClick={onEdit}>
        <Edit3 size={16} />
      </button>
    }>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );
};