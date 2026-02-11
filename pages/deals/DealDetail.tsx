import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Check, MoreHorizontal, Edit, Trash, 
  Phone, Mail, MessageSquare, CalendarPlus, FileText,
  Building2, Calendar, Target, Clock, Info, ChevronRight, Briefcase
} from 'lucide-react';
import { 
  Card, Button, Badge, Tabs, Avatar, Dropdown, StatCard
} from '../../components/ui';
import { useDeal, useUpdateDeal } from '../../hooks/useDeals';
import { usePipelineStages } from '../../hooks/usePipeline';
import { format } from 'date-fns';

const DealDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading } = useDeal(id!);
  const { data: stages } = usePipelineStages();
  const [activeTab, setActiveTab] = useState('activity');
  const updateDeal = useUpdateDeal();

  if (isLoading) return <div className="h-full flex items-center justify-center"><Spinner /></div>;
  if (!deal) return <div className="p-12 text-center">Deal not found</div>;

  const currentStageIndex = stages?.findIndex((s: any) => s.id === deal.pipeline_stage_id) || 0;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-zinc-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/deals')} className="p-1.5 -ml-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-md transition-minimal">
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[18px] font-semibold text-zinc-900 tracking-tight">{deal.name}</h1>
                <Badge variant={deal.status === 'won' ? 'success' : deal.status === 'lost' ? 'error' : 'primary'} size="sm" className="uppercase font-black text-[9px] tracking-widest">
                  {deal.status}
                </Badge>
              </div>
              <p className="text-[12px] text-zinc-500 font-medium mt-0.5">{deal.clients?.company_name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[22px] font-black text-zinc-900 leading-none">${deal.deal_value?.toLocaleString()}</p>
              {deal.deal_type === 'retainer' && <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Monthly Recurring</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="subtle" size="sm">Close Won</Button>
              <Button variant="ghost" size="sm">Close Lost</Button>
              <Dropdown trigger={<button className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-md transition-minimal"><MoreHorizontal size={18} /></button>} align="right">
                <Dropdown.Item icon={<Edit size={14} />}>Edit Deal</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item danger icon={<Trash size={14} />}>Delete</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* STAGE PROGRESS BAR */}
        {deal.status === 'open' && (
          <div className="mt-6 flex items-center gap-2 px-1">
            {stages?.map((stage: any, idx: number) => (
              <React.Fragment key={stage.id}>
                <button 
                  onClick={() => updateDeal.mutate({ id: deal.id, pipeline_stage_id: stage.id })}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all
                    ${idx <= currentStageIndex ? 'bg-blue-50 text-blue-600' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}
                  `}
                >
                  {idx < currentStageIndex ? <Check size={12} strokeWidth={3} /> : <span className="w-3 h-3 rounded-full border-2 border-current flex items-center justify-center text-[8px]">{idx + 1}</span>}
                  {stage.name}
                </button>
                {idx < stages.length - 1 && <div className={`flex-1 h-0.5 ${idx < currentStageIndex ? 'bg-blue-200' : 'bg-zinc-100'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden border-r border-zinc-100">
          <div className="px-6 py-3 border-b border-zinc-50 flex items-center gap-2">
            <ActionButton icon={<Phone size={14} />} label="Call" />
            <ActionButton icon={<Mail size={14} />} label="Email" />
            <ActionButton icon={<MessageSquare size={14} />} label="Note" />
            <ActionButton icon={<CalendarPlus size={14} />} label="Task" />
          </div>
          
          <div className="px-6 border-b border-zinc-50">
            <div className="flex items-center gap-6">
              {['Activity', 'Services', 'Invoices', 'Tasks'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-3 text-[13px] font-medium border-b-2 -mb-px transition-minimal ${
                    activeTab === tab.toLowerCase() ? 'border-primary text-primary' : 'border-transparent text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="p-8 text-zinc-400 italic">Content tabs implementation...</div>
          </div>
        </div>
        
        {/* SIDEBAR */}
        <div className="w-80 overflow-y-auto bg-zinc-50/30 no-scrollbar p-4 space-y-4">
          <Card elevated padding="md">
            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Deal Info</h3>
            <div className="space-y-3">
              <DetailRow label="Type"><span className="text-[12px] font-bold text-zinc-700 capitalize">{deal.deal_type}</span></DetailRow>
              <DetailRow label="Confidence"><span className="text-[12px] font-bold text-zinc-700">{deal.win_probability}%</span></DetailRow>
              <DetailRow label="Expected Close"><span className="text-[12px] font-bold text-zinc-700">{deal.expected_close_date ? format(new Date(deal.expected_close_date), 'MMM d, yyyy') : '—'}</span></DetailRow>
            </div>
          </Card>

          <Card elevated padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Commission</h3>
              <Info size={12} className="text-zinc-300" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-zinc-500">Rep Rate</span>
                <span className="font-bold text-zinc-700">10%</span>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex justify-between items-center">
                <span className="text-[12px] font-bold text-zinc-700">Est. Payout</span>
                <span className="text-[16px] font-black text-emerald-600">${(deal.deal_value * 0.1).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-3 italic leading-relaxed">Commission calculated upon full invoice payment.</p>
          </Card>

          <Card elevated padding="md" onClick={() => navigate(`/clients/${deal.client_id}`)} hover>
            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Client</h3>
            <div className="flex items-center gap-3">
              <Avatar name={deal.clients?.company_name} size="sm" />
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-zinc-900 truncate">{deal.clients?.company_name}</p>
                <p className="text-[11px] text-zinc-500 truncate">{deal.clients?.contact_email}</p>
              </div>
              <ChevronRight size={14} className="text-zinc-300 ml-auto" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label }: any) => (
  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50 rounded-md transition-minimal">
    {icon} {label}
  </button>
);

const DetailRow = ({ label, children }: any) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-[11px] font-medium text-zinc-500">{label}</span>
    {children}
  </div>
);

const Spinner = () => <div className="animate-spin rounded-full border-2 border-zinc-200 border-t-primary w-6 h-6" />;

export default DealDetail;