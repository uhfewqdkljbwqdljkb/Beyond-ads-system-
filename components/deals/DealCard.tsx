import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, RefreshCw, HandCoins } from 'lucide-react';
import { Card, Badge, Avatar } from '../ui';
import { format, differenceInDays } from 'date-fns';

interface DealCardProps {
  deal: any;
  isDragging?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, isDragging }) => {
  const navigate = useNavigate();
  const daysInStage = deal.updated_at ? differenceInDays(new Date(), new Date(deal.updated_at)) : 0;

  return (
    <Card 
      padding="sm" 
      onClick={() => navigate(`/deals/${deal.id}`)}
      className={`
        bg-white border-zinc-100 hover:shadow-sm transition-shadow duration-150
        ${isDragging ? 'shadow-lg ring-1 ring-primary' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[13px] font-bold text-zinc-900 truncate tracking-tight">{deal.name}</p>
          <p className="text-[11px] text-zinc-400 truncate mt-0.5">{deal.clients?.company_name}</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-[9px] font-black text-zinc-500">
           {deal.users?.first_name?.[0]}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-[16px] font-black text-zinc-900">${deal.deal_value?.toLocaleString()}</span>
        {deal.deal_type === 'retainer' && <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">/mo</span>}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`
            px-1.5 py-0.5 text-[10px] font-black uppercase rounded
            ${daysInStage > 14 ? 'bg-red-50 text-red-600' : daysInStage > 7 ? 'bg-amber-50 text-amber-600' : 'bg-zinc-100 text-zinc-500'}
          `}>
            {daysInStage}d
          </span>
          {deal.deal_type === 'retainer' && <RefreshCw size={11} className="text-blue-500" />}
        </div>
        
        <div className="flex items-center gap-1 text-zinc-400">
          <Calendar size={11} />
          <span className="text-[10px] font-bold">{deal.expected_close_date ? format(new Date(deal.expected_close_date), 'MMM d') : 'TBD'}</span>
        </div>
      </div>
      
      <div className="mt-2.5 w-full h-0.5 bg-zinc-50 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${deal.win_probability}%` }} />
      </div>
    </Card>
  );
};