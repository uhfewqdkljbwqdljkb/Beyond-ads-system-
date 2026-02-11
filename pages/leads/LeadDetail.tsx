import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Building2, Calendar, 
  Edit, Trash, Star, MoreHorizontal, PhoneCall, 
  MessageSquare, CalendarPlus, Video, Globe, MapPin, 
  Copy, ExternalLink, CheckCircle, RefreshCw, FileText
} from 'lucide-react';
import { 
  Card, Button, Badge, Tabs, Avatar, Dropdown 
} from '../../components/ui';
import { useLead, useUpdateLead } from '../../hooks/useLeads';
import { useActivities } from '../../hooks/useActivities';
import { LeadStatusBadge } from '../../components/leads/LeadStatusBadge';
import { format } from 'date-fns';

const LeadDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: lead, isLoading } = useLead(id!);
  const [activeTab, setActiveTab] = useState('activity');
  const updateLead = useUpdateLead();

  if (isLoading) return <div className="h-full flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!lead) return <div className="p-12 text-center">Lead not found</div>;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-zinc-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/leads')}
              className="p-1.5 -ml-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-md transition-minimal"
            >
              <ArrowLeft size={18} />
            </button>
            
            <div className="flex items-center gap-3">
              <Avatar name={`${lead.first_name} ${lead.last_name}`} src={lead.avatar_url} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[18px] font-semibold text-zinc-900 tracking-tight">
                    {lead.first_name} {lead.last_name}
                  </h1>
                  <button className="text-zinc-300 hover:text-amber-400 transition-colors">
                    <Star size={16} />
                  </button>
                </div>
                <p className="text-[12px] text-zinc-500 font-medium">{lead.company_name || 'Individual'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Dropdown trigger={
               <button className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest border border-zinc-100 rounded-md hover:bg-zinc-50 flex items-center gap-1.5">
                 {lead.status} <ChevronDown size={12} />
               </button>
            }>
               {['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'].map(s => (
                 <Dropdown.Item key={s} onClick={() => updateLead.mutate({ id: lead.id, status: s })}>{s}</Dropdown.Item>
               ))}
            </Dropdown>
            <Button variant="primary" size="sm">Convert to Deal</Button>
            <Dropdown trigger={<button className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-md transition-minimal"><MoreHorizontal size={18} /></button>} align="right">
              <Dropdown.Item icon={<Edit size={14} />}>Edit Lead</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item danger icon={<Trash size={14} />}>Delete</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN - MAIN CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-zinc-100">
          {/* QUICK ACTIONS */}
          <div className="px-6 py-3 border-b border-zinc-50 flex items-center gap-2">
            <ActionButton icon={<Phone size={14} />} label="Call" />
            <ActionButton icon={<Mail size={14} />} label="Email" />
            <ActionButton icon={<MessageSquare size={14} />} label="Note" />
            <ActionButton icon={<CalendarPlus size={14} />} label="Task" />
            <ActionButton icon={<Video size={14} />} label="Meeting" />
          </div>
          
          {/* TABS */}
          <div className="px-6 border-b border-zinc-50">
            <div className="flex items-center gap-6">
              {['Activity', 'Tasks', 'Files'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-3 text-[13px] font-medium border-b-2 -mb-px transition-minimal ${
                    activeTab === tab.toLowerCase()
                      ? 'border-primary text-primary'
                      : 'border-transparent text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {activeTab === 'activity' && <ActivityTab leadId={id!} />}
            {activeTab === 'tasks' && <div className="p-6 text-zinc-400 italic">Task management interface...</div>}
            {activeTab === 'files' && <div className="p-6 text-zinc-400 italic">File repository...</div>}
          </div>
        </div>
        
        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="w-80 overflow-y-auto bg-zinc-50/30 no-scrollbar">
          <div className="p-4 space-y-4">
            <Card elevated padding="md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em]">Contact Info</h3>
                <button className="text-[11px] font-bold text-primary hover:underline">Edit</button>
              </div>
              <div className="space-y-4">
                <ContactRow icon={<Mail size={14} />} value={lead.email} label="Email" />
                <ContactRow icon={<Phone size={14} />} value={lead.phone || '—'} label="Phone" />
                <ContactRow icon={<Globe size={14} />} value={lead.website || '—'} label="Website" />
                <ContactRow icon={<MapPin size={14} />} value={lead.city || '—'} label="Location" />
              </div>
            </Card>
            
            <Card elevated padding="md">
              <h3 className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Lead Details</h3>
              <div className="space-y-3">
                <DetailRow label="Current Status"><LeadStatusBadge status={lead.status} size="sm" /></DetailRow>
                <DetailRow label="Est. Value"><span className="text-[13px] font-bold text-zinc-900">${lead.estimated_value?.toLocaleString()}</span></DetailRow>
                <DetailRow label="Lead Score">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${lead.lead_score}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-600">{lead.lead_score}</span>
                  </div>
                </DetailRow>
                <DetailRow label="Owner">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center text-[9px] font-black text-zinc-600">
                      {lead.users?.first_name?.[0]}
                    </div>
                    <span className="text-[12px] text-zinc-700">{lead.users?.first_name}</span>
                  </div>
                </DetailRow>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50 rounded-md transition-minimal">
    {icon} {label}
  </button>
);

const ContactRow = ({ icon, value, label }: any) => (
  <div className="group flex items-center gap-3">
    <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-primary-light group-hover:text-primary transition-minimal">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter leading-none mb-0.5">{label}</p>
      <p className="text-[12px] font-medium text-zinc-900 truncate">{value}</p>
    </div>
  </div>
);

const DetailRow = ({ label, children }: any) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-[11px] font-medium text-zinc-500">{label}</span>
    {children}
  </div>
);

const ActivityTab = ({ leadId }: { leadId: string }) => {
  const { data: activities, isLoading } = useActivities('lead', leadId);
  if (isLoading) return <div className="p-6"><Spinner /></div>;
  
  return (
    <div className="p-8 max-w-2xl">
      <div className="relative">
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-zinc-100" />
        <div className="space-y-8">
          {activities?.map((activity: any, idx: number) => (
            <div key={activity.id} className="relative flex gap-6 group">
              <div className={`
                relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-xs
                ${activity.activity_type === 'call' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}
              `}>
                {activity.activity_type === 'call' ? <PhoneCall size={14} /> : <FileText size={14} />}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-[13px] font-bold text-zinc-900">{activity.subject || activity.activity_type.toUpperCase()}</h4>
                  <span className="text-[11px] text-zinc-400">{format(new Date(activity.created_at), 'MMM d, h:mm a')}</span>
                </div>
                {activity.content && <p className="text-[12px] text-zinc-600 mt-1 leading-relaxed">{activity.content}</p>}
                <p className="text-[10px] text-zinc-400 mt-2 font-medium">Logged by James Wilson</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChevronDown = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Spinner = ({ size = 'md' }: any) => <div className={`animate-spin rounded-full border-2 border-zinc-200 border-t-primary ${size === 'lg' ? 'w-8 h-8' : 'w-4 h-4'}`} />;

export default LeadDetail;