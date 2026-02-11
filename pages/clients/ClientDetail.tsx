import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Globe, Mail, Phone, MapPin, 
  DollarSign, TrendingUp, CreditCard, Clock, 
  ExternalLink, Plus, MessageSquare, History, Briefcase, 
  FileText, Edit3, Trash2, Calendar, ShieldCheck, 
  ChevronRight, Receipt, MoreHorizontal, Info
} from 'lucide-react';

import { 
  Card, Button, Badge, Avatar, Spinner, 
  EmptyState, Tabs, StatCard, Dropdown, Table
} from '../../components/ui';
import { useClient, useUpdateClient } from '../../hooks/useClients';
import { useActivities } from '../../hooks/useActivities';
import { ClientStatusBadge } from '../../components/clients/ClientStatusBadge';
import { ClientMetricsCard } from '../../components/clients/ClientMetricsCard';
import { ClientInfoCard } from '../../components/clients/ClientInfoCard';
import { EditClientModal } from '../../components/clients/EditClientModal';
import { ActivityTimeline } from '../../components/leads/ActivityTimeline';
import { format, differenceInDays } from 'date-fns';

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: client, isLoading, isError } = useClient(id!);
  const { data: activities, isLoading: activitiesLoading } = useActivities('client', id!);
  const updateClient = useUpdateClient();

  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (isError || !client) return <EmptyState icon={<Building2 />} title="Client not found" description="This account may have been merged or deleted." />;

  const activeDeals = client.deals?.filter((d: any) => d.status === 'open') || [];
  const totalRevenue = client.lifetime_value || 0;
  const avgDealSize = client.total_deals > 0 ? totalRevenue / client.total_deals : 0;
  
  const daysRemaining = client.contract_end_date 
    ? differenceInDays(new Date(client.contract_end_date), new Date()) 
    : null;

  const handleStatusChange = (newStatus: string) => {
    updateClient.mutate({ id: client.id, status: newStatus });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} className="bg-white border border-border">
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar name={client.company_name} size="lg" className="border-2 border-white shadow-md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-textPrimary leading-none">{client.company_name}</h1>
                <Dropdown trigger={
                  <div className="cursor-pointer">
                    <ClientStatusBadge status={client.status} className="hover:opacity-80 transition-opacity" />
                  </div>
                }>
                  {['active', 'paused', 'churned'].map(s => (
                    <Dropdown.Item key={s} onClick={() => handleStatusChange(s)}>{s.toUpperCase()}</Dropdown.Item>
                  ))}
                </Dropdown>
              </div>
              <div className="flex items-center gap-3 mt-2 text-textSecondary text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><Building2 size={12} /> {client.industries?.name || 'Sector N/A'}</span>
                {client.website && (
                  <>
                    <span className="w-1 h-1 bg-textMuted rounded-full" />
                    <a href={client.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Globe size={12} /> Website <ExternalLink size={10} />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Edit3 size={18} />} onClick={() => setActiveModal('edit')}>Edit Profile</Button>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => navigate('/deals')}>New Deal</Button>
          <Dropdown trigger={<Button variant="ghost" className="bg-white border border-border p-2"><MoreHorizontal size={20} /></Button>} align="right">
            <Dropdown.Item icon={<Receipt size={14} />}>New Invoice</Dropdown.Item>
            <Dropdown.Item icon={<History size={14} />}>Account History</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item danger icon={<Trash2 size={14} />}>Delete Account</Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <Card padding="none">
        <Tabs defaultValue="overview" className="px-6 pt-2">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="deals">Deals ({client.deals?.length || 0})</Tabs.Tab>
            <Tabs.Tab value="invoices">Invoices ({client.invoices?.length || 0})</Tabs.Tab>
            <Tabs.Tab value="activity">Activity Feed</Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panels>
            <Tabs.Panel value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-2">
                {/* Left Side: Info and Metrics */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ClientMetricsCard label="Lifetime Value" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign size={18} />} colorClass="text-emerald-600" />
                    <ClientMetricsCard label="Total Deals" value={client.total_deals || 0} icon={<Briefcase size={18} />} colorClass="text-blue-600" />
                    <ClientMetricsCard label="Avg. Deal" value={`$${avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={<TrendingUp size={18} />} colorClass="text-purple-600" />
                    <ClientMetricsCard label="Account Age" value={`${differenceInDays(new Date(), new Date(client.created_at))} Days`} icon={<Clock size={18} />} colorClass="text-amber-600" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ClientInfoCard title="Primary Contact" onEdit={() => setActiveModal('edit')}>
                       <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center font-black text-lg">
                           {client.contact_first_name?.[0]}{client.contact_last_name?.[0]}
                         </div>
                         <div>
                           <p className="text-base font-bold text-textPrimary">{client.contact_first_name} {client.contact_last_name}</p>
                           <p className="text-xs text-textSecondary uppercase tracking-widest font-bold">Decision Maker</p>
                         </div>
                       </div>
                       <div className="space-y-2 mt-4">
                         <div className="flex items-center gap-3 text-sm text-textSecondary hover:text-primary transition-colors cursor-pointer group">
                           <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center group-hover:bg-primary-light transition-colors"><Mail size={14} /></div>
                           {client.contact_email}
                         </div>
                         <div className="flex items-center gap-3 text-sm text-textSecondary hover:text-primary transition-colors cursor-pointer group">
                           <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center group-hover:bg-emerald-100 transition-colors"><Phone size={14} /></div>
                           {client.contact_phone || 'No phone listed'}
                         </div>
                       </div>
                    </ClientInfoCard>

                    <ClientInfoCard title="Billing & Tax" onEdit={() => setActiveModal('edit')}>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <MapPin size={16} className="text-textMuted shrink-0 mt-0.5" />
                          <p className="text-sm text-textSecondary leading-relaxed">
                            {client.billing_address_line1 || 'No address line 1'}<br />
                            {client.billing_city}, {client.billing_country} {client.billing_postal_code}
                          </p>
                        </div>
                        <div className="flex gap-3 pt-3 border-t border-border/50">
                          <CreditCard size={16} className="text-textMuted shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-textMuted uppercase">Tax / VAT ID</p>
                            <p className="text-sm font-mono text-textPrimary">{client.tax_id || 'Not on file'}</p>
                          </div>
                        </div>
                      </div>
                    </ClientInfoCard>
                  </div>
                </div>

                {/* Right Side: Attribution & Contract */}
                <div className="space-y-6">
                  <Card title="Account Attribution">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <Avatar name={client.users?.first_name || 'System'} src={client.users?.avatar_url} size="sm" />
                         <div>
                            <p className="text-sm font-bold text-textPrimary">{client.users?.first_name} {client.users?.last_name}</p>
                            <p className="text-[10px] text-textMuted uppercase font-black">Original Salesperson</p>
                         </div>
                      </div>
                      <div className="pt-4 border-t border-border grid grid-cols-1 gap-y-4">
                         <div>
                            <p className="text-[10px] text-textMuted font-bold uppercase">Conversion Date</p>
                            <p className="text-xs font-semibold text-textPrimary">{format(new Date(client.created_at), 'PPP')}</p>
                         </div>
                         <div>
                            <p className="text-[10px] text-textMuted font-bold uppercase">Source Channel</p>
                            <Badge variant="primary" size="sm" className="mt-1">Inbound Request</Badge>
                         </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Contract Status" headerAction={<Info size={14} className="text-textMuted cursor-help" />}>
                     <div className={`p-4 rounded-xl border ${daysRemaining !== null && daysRemaining < 30 ? 'bg-red-50 border-red-100' : 'bg-surface border-border'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">Time Remaining</span>
                          <Badge variant={daysRemaining !== null && daysRemaining < 30 ? 'error' : 'success'} size="sm">
                             {daysRemaining !== null ? `${daysRemaining} Days` : 'Rolling'}
                          </Badge>
                        </div>
                        <div className="w-full bg-border h-1.5 rounded-full mt-2 overflow-hidden">
                           <div className={`h-full ${daysRemaining !== null && daysRemaining < 30 ? 'bg-error' : 'bg-success'}`} style={{ width: '65%' }} />
                        </div>
                        <p className="text-[10px] text-textSecondary mt-3 italic">
                           Renewals trigger automatically 30 days before expiry.
                        </p>
                     </div>
                  </Card>

                  <Card title="Recent Activity" headerAction={<button className="text-[10px] font-bold text-primary hover:underline uppercase">View Feed</button>}>
                     <div className="space-y-4">
                        {activities?.slice(0, 3).map((act: any) => (
                           <div key={act.id} className="flex gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              <div>
                                 <p className="text-xs font-bold text-textPrimary leading-tight">{act.subject || act.activity_type.toUpperCase()}</p>
                                 <p className="text-[10px] text-textMuted mt-1">{format(new Date(act.created_at), 'MMM d, h:mm a')}</p>
                              </div>
                           </div>
                        ))}
                        {(!activities || activities.length === 0) && <p className="text-xs text-textMuted italic">No recent history.</p>}
                     </div>
                  </Card>
                </div>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="deals">
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-textPrimary">Opportunity History</h3>
                  <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => navigate('/deals')}>New Deal</Button>
                </div>
                <Card padding="none" className="overflow-hidden border-border/50">
                  <Table>
                    <Table.Header>
                      <Table.Row hover={false}>
                        <Table.HeaderCell>Deal Name</Table.HeaderCell>
                        <Table.HeaderCell>Value</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Close Date</Table.HeaderCell>
                        <Table.HeaderCell align="right"></Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {client.deals?.map((deal: any) => (
                        <Table.Row key={deal.id} onClick={() => navigate(`/deals/${deal.id}`)}>
                          <Table.Cell className="font-bold">{deal.name}</Table.Cell>
                          <Table.Cell>${deal.deal_value?.toLocaleString()}</Table.Cell>
                          <Table.Cell>
                            <Badge variant={deal.status === 'won' ? 'success' : deal.status === 'lost' ? 'error' : 'primary'} size="sm">{deal.status}</Badge>
                          </Table.Cell>
                          <Table.Cell className="text-xs text-textSecondary">{deal.closed_at ? format(new Date(deal.closed_at), 'MMM d, yyyy') : 'In Pipeline'}</Table.Cell>
                          <Table.Cell align="right"><ChevronRight size={16} className="text-textMuted" /></Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="invoices">
              <div className="space-y-6 py-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-surface">
                    <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Total Invoiced</p>
                    <h4 className="text-xl font-black text-textPrimary mt-1">${totalRevenue.toLocaleString()}</h4>
                  </Card>
                  <Card className="bg-emerald-50/50">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Paid to Date</p>
                    <h4 className="text-xl font-black text-emerald-700 mt-1">${totalRevenue.toLocaleString()}</h4>
                  </Card>
                  <Card className="bg-amber-50/50">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Outstanding</p>
                    <h4 className="text-xl font-black text-amber-700 mt-1">$0</h4>
                  </Card>
                </div>
                <div className="flex justify-between items-center">
                   <h3 className="text-lg font-bold text-textPrimary">Invoice Ledger</h3>
                   <Button size="sm" variant="outline" leftIcon={<Plus size={16} />}>Create Invoice</Button>
                </div>
                <Card padding="none" className="overflow-hidden border-border/50">
                   <Table>
                      <Table.Header>
                        <Table.Row hover={false}>
                           <Table.HeaderCell>Invoice #</Table.HeaderCell>
                           <Table.HeaderCell>Issue Date</Table.HeaderCell>
                           <Table.HeaderCell>Amount</Table.HeaderCell>
                           <Table.HeaderCell>Status</Table.HeaderCell>
                           <Table.HeaderCell align="right"></Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {client.invoices?.map((inv: any) => (
                           <Table.Row key={inv.id} onClick={() => navigate(`/invoices/${inv.id}`)}>
                              <Table.Cell className="font-bold text-primary">#{inv.invoice_number}</Table.Cell>
                              <Table.Cell className="text-xs">{format(new Date(inv.issue_date), 'MMM d, yyyy')}</Table.Cell>
                              <Table.Cell className="font-bold">${inv.total_amount?.toLocaleString()}</Table.Cell>
                              <Table.Cell><Badge variant={inv.status === 'paid' ? 'success' : 'warning'} size="sm">{inv.status}</Badge></Table.Cell>
                              <Table.Cell align="right"><FileText size={16} className="text-textMuted" /></Table.Cell>
                           </Table.Row>
                        ))}
                      </Table.Body>
                   </Table>
                </Card>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="activity">
               <div className="max-w-3xl">
                  <ActivityTimeline activities={activities || []} isLoading={activitiesLoading} />
               </div>
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </Card>

      {/* Modals */}
      <EditClientModal 
        isOpen={activeModal === 'edit'} 
        onClose={() => setActiveModal(null)} 
        client={client} 
      />
    </div>
  );
};

export default ClientDetail;