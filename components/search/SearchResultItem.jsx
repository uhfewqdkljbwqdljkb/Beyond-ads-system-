import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Building2, FileText, ChevronRight } from 'lucide-react';
import { Avatar, Badge } from '../ui';

export const SearchResultItem = ({ item, type, isSelected, onClick }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case 'leads': return <User size={16} />;
      case 'deals': return <Briefcase size={16} />;
      case 'clients': return <Building2 size={16} />;
      case 'invoices': return <FileText size={16} />;
      default: return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'leads': return `${item.first_name} ${item.last_name}`;
      case 'deals': return item.name;
      case 'clients': return item.company_name;
      case 'invoices': return `Invoice #${item.invoice_number}`;
      default: return '';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'leads': return item.company_name || item.email;
      case 'deals': return `${item.clients?.company_name} • $${item.deal_value?.toLocaleString()}`;
      case 'clients': return `${item.contact_first_name} ${item.contact_last_name}`;
      case 'invoices': return `${item.clients?.company_name} • $${item.total_amount?.toLocaleString()}`;
      default: return '';
    }
  };

  const getLink = () => {
    switch (type) {
      case 'leads': return `/leads/${item.id}`;
      case 'deals': return `/deals/${item.id}`;
      case 'clients': return `/clients/${item.id}`;
      case 'invoices': return `/invoices/${item.id}`;
      default: return '#';
    }
  };

  const handleNavigate = () => {
    navigate(getLink());
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleNavigate}
      className={`
        flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
        ${isSelected ? 'bg-primary-light ring-1 ring-primary/20' : 'hover:bg-surface'}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-white text-primary' : 'bg-surface text-textSecondary'}`}>
          {getIcon()}
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-bold truncate ${isSelected ? 'text-primary' : 'text-textPrimary'}`}>
            {getTitle()}
          </p>
          <p className="text-xs text-textSecondary truncate">{getSubtitle()}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge variant="default" size="sm" className="hidden sm:inline-flex uppercase text-[9px] font-black tracking-widest opacity-60">
          {item.status || item.pipeline_stages?.name}
        </Badge>
        <ChevronRight size={14} className={`text-textMuted transition-transform ${isSelected ? 'translate-x-1 text-primary' : ''}`} />
      </div>
    </div>
  );
};
