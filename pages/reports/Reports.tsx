import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Download, Filter, Calendar, ChevronDown,
  PieChart as PieIcon, LineChart as LineIcon,
  ArrowUpRight, ArrowDownRight, Target, Clock,
  FileText, Briefcase, Activity, MousePointer2
} from 'lucide-react';
import { 
  Card, Button, StatCard, Badge, Tabs, 
  Select, Table, Avatar, Spinner, Dropdown 
} from '../../components/ui';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell, 
  PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

// --- MOCK DATA GENERATORS ---
const MOCK_REVENUE_DATA = [
  { date: '2023-10', revenue: 42000, target: 40000, mrr: 12000 },
  { date: '2023-11', revenue: 38000, target: 40000, mrr: 14000 },
  { date: '2023-12', revenue: 55000, target: 45000, mrr: 15500 },
  { date: '2024-01', revenue: 48000, target: 45000, mrr: 18000 },
  { date: '2024-02', revenue: 62000, target: 50000, mrr: 19500 },
  { date: '2024-03', revenue: 75000, target: 55000, mrr: 22000 },
];

const MOCK_SALES_REPS = [
  { id: '1', name: 'James Wilson', won: 14, lost: 4, winRate: '77%', revenue: 145000, avgDeal: 10357, cycle: 18, target: 115 },
  { id: '2', name: 'Sarah Miller', won: 12, lost: 2, winRate: '85%', revenue: 112000, avgDeal: 9333, cycle: 14, target: 108 },
  { id: '3', name: 'Robert Chen', won: 8, lost: 6, winRate: '57%', revenue: 98200, avgDeal: 12275, cycle: 24, target: 92 },
  { id: '4', name: 'Elena Rodriguez', won: 5, lost: 5, winRate: '50%', revenue: 64000, avgDeal: 12800, cycle: 28, target: 75 },
];

const MOCK_FUNNEL_DATA = [
  { name: 'Leads', value: 420, color: '#3B82F6' },
  { name: 'Qualified', value: 280, color: '#60A5FA' },
  { name: 'Proposal', value: 145, color: '#93C5FD' },
  { name: 'Negotiation', value: 68, color: '#BFDBFE' },
  { name: 'Won', value: 42, color: '#10B981' },
];

const MOCK_SOURCES = [
  { name: 'LinkedIn Ads', leads: 145, qualified: 82, won: 12, revenue: 84000, conv: '8.2%', valPerLead: 579 },
  { name: 'Google Search', leads: 110, qualified: 54, won: 8, revenue: 56000, conv: '7.2%', valPerLead: 509 },
  { name: 'Referrals', leads: 42, qualified: 38, won: 15, revenue: 120000, conv: '35.7%', valPerLead: 2857 },
  { name: 'Cold Email', leads: 250, qualified: 42, won: 4, revenue: 28000, conv: '1.6%', valPerLead: 112 },
];

const MOCK_COMMISSIONS = [
  { name: 'James Wilson', dealValue: 145000, earned: 14500, pending: 2400, paid: 12100 },
  { name: 'Sarah Miller', dealValue: 112000, earned: 11200, pending: 1500, paid: 9700 },
  { name: 'Robert Chen', dealValue: 98000, earned: 9800, pending: 4200, paid: 5600 },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [dateRange, setDateRange] = useState('this_month');
  const [comparePrevious, setComparePrevious] = useState(true);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* GLOBAL HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-textPrimary tracking-tight">Intelligence Hub</h1>
          <p className="text-textSecondary font-medium">Cross-dimensional agency performance analytics.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border">
             <button 
               onClick={() => setComparePrevious(!comparePrevious)}
               className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${comparePrevious ? 'bg-white shadow-sm text-primary' : 'text-textMuted hover:text-textSecondary'}`}
             >
               Compare to Previous
             </button>
             <div className="w-px h-4 bg-border" />
             <Select 
               className="border-none bg-transparent min-w-[140px]"
               options={[
                 { label: 'This Month', value: 'this_month' },
                 { label: 'Last Month', value: 'last_month' },
                 { label: 'This Quarter', value: 'this_quarter' },
                 { label: 'Last Quarter', value: 'last_quarter' },
                 { label: 'This Year', value: 'this_year' },
               ]}
               value={dateRange}
               onChange={setDateRange}
             />
          </div>

          <Dropdown trigger={<Button variant="outline" leftIcon={<Download size={18} />}>Export</Button>}>
            <Dropdown.Item icon={<FileText size={14} />}>Download CSV</Dropdown.Item>
            <Dropdown.Item icon={<PieIcon size={14} />}>Generate PDF Report</Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <Card padding="none" className="border-none bg-transparent shadow-none">
        <Tabs defaultValue="performance" className="space-y-6" onChange={setActiveTab}>
          <Tabs.List className="bg-white p-1 rounded-2xl border border-border inline-flex shadow-sm">
            <Tabs.Tab value="performance">Performance</Tabs.Tab>
            <Tabs.Tab value="pipeline">Pipeline</Tabs.Tab>
            <Tabs.Tab value="revenue">Revenue</Tabs.Tab>
            <Tabs.Tab value="sources">Lead Sources</Tabs.Tab>
            <Tabs.Tab value="commissions">Commissions</Tabs.Tab>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panels>
            <Tabs.Panel value="performance"><PerformanceReport /></Tabs.Panel>
            <Tabs.Panel value="pipeline"><PipelineReport /></Tabs.Panel>
            <Tabs.Panel value="revenue"><RevenueReport /></Tabs.Panel>
            <Tabs.Panel value="sources"><SourcesReport /></Tabs.Panel>
            <Tabs.Panel value="commissions"><CommissionsReport /></Tabs.Panel>
            <Tabs.Panel value="activity"><ActivityReport /></Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </Card>
    </div>
  );
};

// --- SUB-REPORTS ---

const PerformanceReport = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard label="Deals Closed" value="42" trend={{ value: '12%', direction: 'up' }} icon={<CheckCircle />} />
      <StatCard label="Total Revenue" value="$419k" trend={{ value: '8%', direction: 'up' }} icon={<DollarSign />} />
      <StatCard label="Avg Deal Size" value="$9.8k" trend={{ value: '3%', direction: 'down' }} icon={<Briefcase />} />
      <StatCard label="Overall Win Rate" value="64%" trend={{ value: '5%', direction: 'up' }} icon={<Target />} />
      <StatCard label="Sales Cycle" value="18 Days" trend={{ value: '2 Days', direction: 'down' }} icon={<Clock />} />
    </div>

    <Card title="Sales Performance by Representative" subtitle="Metrics weighted against monthly targets">
      <Table>
        <Table.Header>
          <Table.Row hover={false}>
            <Table.HeaderCell>Salesperson</Table.HeaderCell>
            <Table.HeaderCell align="center">Won</Table.HeaderCell>
            <Table.HeaderCell align="center">Lost</Table.HeaderCell>
            <Table.HeaderCell align="center">Win Rate</Table.HeaderCell>
            <Table.HeaderCell align="right">Revenue</Table.HeaderCell>
            <Table.HeaderCell align="right">Avg Deal</Table.HeaderCell>
            <Table.HeaderCell align="right">Vs Target</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {MOCK_SALES_REPS.map(rep => (
            <Table.Row key={rep.id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <Avatar name={rep.name} size="xs" />
                  <span className="font-bold text-textPrimary">{rep.name}</span>
                </div>
              </Table.Cell>
              <Table.Cell align="center"><Badge variant="success" size="sm">{rep.won}</Badge></Table.Cell>
              <Table.Cell align="center"><Badge variant="default" size="sm">{rep.lost}</Badge></Table.Cell>
              <Table.Cell align="center"><span className="font-semibold">{rep.winRate}</span></Table.Cell>
              <Table.Cell align="right"><span className="font-black">${rep.revenue.toLocaleString()}</span></Table.Cell>
              <Table.Cell align="right">${rep.avgDeal.toLocaleString()}</Table.Cell>
              <Table.Cell align="right">
                <div className="flex items-center justify-end gap-2">
                   <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(100, rep.target)}%` }} />
                   </div>
                   <span className={`text-xs font-bold ${rep.target >= 100 ? 'text-emerald-600' : 'text-textSecondary'}`}>{rep.target}%</span>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Monthly Revenue vs Target">
        <div className="h-80 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                formatter={(v) => [`$${v.toLocaleString()}`]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card title="Individual Contribution" subtitle="Revenue split across team">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_SALES_REPS}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="revenue"
                nameKey="name"
              >
                {MOCK_SALES_REPS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  </div>
);

const PipelineReport = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       <StatCard label="Open Deals" value="142" icon={<Briefcase />} />
       <StatCard label="Pipeline Value" value="$2.84M" icon={<DollarSign />} color="blue" />
       <StatCard label="Weighted Value" value="$1.12M" icon={<Target />} />
       <StatCard label="Avg Age" value="14.2d" icon={<Clock />} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2" title="Conversion Funnel" subtitle="Lead to close conversion efficiency">
        <div className="h-[400px] w-full mt-8">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={MOCK_FUNNEL_DATA} margin={{ left: 60, right: 40 }}>
                 <XAxis type="number" hide />
                 <YAxis 
                   dataKey="name" 
                   type="category" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fontSize: 12, fontWeight: 700, fill: '#111827'}} 
                 />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                    {MOCK_FUNNEL_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4 pt-6 border-t border-border">
           {[
             { label: 'L → Q', val: '66%' },
             { label: 'Q → P', val: '51%' },
             { label: 'P → N', val: '46%' },
             { label: 'N → W', val: '61%' },
           ].map(stat => (
             <div key={stat.label} className="text-center">
                <p className="text-[10px] font-black text-textMuted uppercase">{stat.label}</p>
                <p className="text-sm font-bold text-textPrimary">{stat.val}</p>
             </div>
           ))}
        </div>
      </Card>

      <Card title="Pipeline Movement" subtitle="Last 30 days velocity">
         <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MousePointer2 size={16} /></div>
                  <span className="text-sm font-bold text-textPrimary">Deals Entered</span>
               </div>
               <span className="text-lg font-black">+42</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><TrendingUp size={16} /></div>
                  <span className="text-sm font-bold text-textPrimary">Moved Forward</span>
               </div>
               <span className="text-lg font-black">+28</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Clock size={16} /></div>
                  <span className="text-sm font-bold text-textPrimary">Stale Deals</span>
               </div>
               <span className="text-lg font-black text-error">12</span>
            </div>
            <div className="pt-4 mt-4 border-t border-border text-center">
               <p className="text-[10px] font-black text-textMuted uppercase mb-1">Pipeline Velocity Score</p>
               <h3 className="text-3xl font-black text-primary">8.4/10</h3>
            </div>
         </div>
      </Card>
    </div>
  </div>
);

const RevenueReport = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       <StatCard label="Gross Revenue" value="$642k" trend={{ value: '18%', direction: 'up' }} icon={<DollarSign />} />
       <StatCard label="Current MRR" value="$28.5k" trend={{ value: '4.2%', direction: 'up' }} icon={<Activity />} color="emerald" />
       <StatCard label="Project Revenue" value="$420k" icon={<Briefcase />} />
       <StatCard label="Avg LTV" value="$14.2k" icon={<TrendingUp />} />
    </div>

    <Card title="Revenue Growth Mix" subtitle="Monthly Recurring vs One-time Project Revenue">
       <div className="h-96 w-full mt-8">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={MOCK_REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" name="Project Revenue" fill="#3B82F6" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="mrr" name="Recurring (MRR)" fill="#10B981" stackId="a" radius={[4, 4, 0, 0]} />
             </BarChart>
          </ResponsiveContainer>
       </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <Card title="Revenue by Service Type">
          <div className="space-y-4 mt-4">
             {[
               { label: 'Social Media Retainer', val: '$124,000', perc: 45, color: 'bg-primary' },
               { label: 'Web Development', val: '$82,000', perc: 28, color: 'bg-emerald-500' },
               { label: 'SEO Services', val: '$45,000', perc: 15, color: 'bg-amber-500' },
               { label: 'PPC Management', val: '$32,000', perc: 12, color: 'bg-purple-500' },
             ].map(item => (
               <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="text-textSecondary uppercase tracking-tighter">{item.label}</span>
                     <span className="text-textPrimary">{item.val}</span>
                  </div>
                  <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                     <div className={`h-full ${item.color}`} style={{ width: `${item.perc}%` }} />
                  </div>
               </div>
             ))}
          </div>
       </Card>
       <Card title="Churn & Retention">
          <div className="flex items-center justify-between py-12">
             <div className="text-center">
                <p className="text-[10px] font-black text-textMuted uppercase mb-1">Logo Churn</p>
                <p className="text-4xl font-black text-textPrimary">2.4%</p>
                <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center justify-center gap-1"><ArrowDownRight size={14} /> 0.8%</p>
             </div>
             <div className="w-px h-20 bg-border" />
             <div className="text-center">
                <p className="text-[10px] font-black text-textMuted uppercase mb-1">Net Retention</p>
                <p className="text-4xl font-black text-textPrimary">108%</p>
                <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center justify-center gap-1"><ArrowUpRight size={14} /> 4.2%</p>
             </div>
          </div>
       </Card>
    </div>
  </div>
);

const SourcesReport = () => (
  <div className="space-y-6">
     <Card title="Lead Acquisition Performance" subtitle="Traffic source quality metrics">
        <Table>
          <Table.Header>
            <Table.Row hover={false}>
              <Table.HeaderCell>Source</Table.HeaderCell>
              <Table.HeaderCell align="center">Leads</Table.HeaderCell>
              <Table.HeaderCell align="center">Qualified</Table.HeaderCell>
              <Table.HeaderCell align="center">Won</Table.HeaderCell>
              <Table.HeaderCell align="right">Revenue</Table.HeaderCell>
              <Table.HeaderCell align="right">Conv %</Table.HeaderCell>
              <Table.HeaderCell align="right">Value/Lead</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
             {MOCK_SOURCES.map(source => (
               <Table.Row key={source.name}>
                 <Table.Cell className="font-bold text-textPrimary">{source.name}</Table.Cell>
                 <Table.Cell align="center">{source.leads}</Table.Cell>
                 <Table.Cell align="center">{source.qualified}</Table.Cell>
                 <Table.Cell align="center"><Badge variant="success" size="sm">{source.won}</Badge></Table.Cell>
                 <Table.Cell align="right"><span className="font-black text-textPrimary">${source.revenue.toLocaleString()}</span></Table.Cell>
                 <Table.Cell align="right">{source.conv}</Table.Cell>
                 <Table.Cell align="right"><span className="text-primary font-bold">${source.valPerLead}</span></Table.Cell>
               </Table.Row>
             ))}
          </Table.Body>
        </Table>
     </Card>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Highest Quality Source">
           <div className="flex items-center gap-6 py-6">
              <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl"><TrendingUp size={32} /></div>
              <div>
                 <h4 className="text-2xl font-black text-textPrimary uppercase tracking-tighter">Client Referrals</h4>
                 <p className="text-sm text-textSecondary font-medium mt-1">35.7% Conversion Rate • $2,857 Avg Value per Lead</p>
                 <Badge variant="success" className="mt-3">Primary Growth Channel</Badge>
              </div>
           </div>
        </Card>
        <Card title="Highest Volume Source">
           <div className="flex items-center gap-6 py-6">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><Users size={32} /></div>
              <div>
                 <h4 className="text-2xl font-black text-textPrimary uppercase tracking-tighter">Cold Outreach</h4>
                 <p className="text-sm text-textSecondary font-medium mt-1">250 Leads Generated • 1.6% Conversion Rate</p>
                 <Badge variant="warning" className="mt-3">Optimization Needed</Badge>
              </div>
           </div>
        </Card>
     </div>
  </div>
);

const CommissionsReport = () => (
  <div className="space-y-6">
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Earned" value="$48.2k" icon={<Activity />} />
        <StatCard label="Total Paid" value="$27.4k" icon={<Activity />} color="emerald" />
        <StatCard label="Pending" value="$12.2k" icon={<Clock />} color="amber" />
        <StatCard label="Avg AE Payout" value="$8.4k" icon={<Users />} />
     </div>

     <Card title="Commission Ledger by Salesperson">
        <Table>
           <Table.Header>
              <Table.Row hover={false}>
                 <Table.HeaderCell>Representative</Table.HeaderCell>
                 <Table.HeaderCell align="right">Deal Volume</Table.HeaderCell>
                 <Table.HeaderCell align="right">Total Commission</Table.HeaderCell>
                 <Table.HeaderCell align="right">Pending Payout</Table.HeaderCell>
                 <Table.HeaderCell align="right">Paid Payout</Table.HeaderCell>
                 <Table.HeaderCell align="right">Status</Table.HeaderCell>
              </Table.Row>
           </Table.Header>
           <Table.Body>
              {MOCK_COMMISSIONS.map(comm => (
                <Table.Row key={comm.name}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar name={comm.name} size="xs" />
                      <span className="font-bold text-textPrimary">{comm.name}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell align="right">${comm.dealValue.toLocaleString()}</Table.Cell>
                  <Table.Cell align="right"><span className="font-black">${comm.earned.toLocaleString()}</span></Table.Cell>
                  <Table.Cell align="right" className="text-amber-600 font-bold">${comm.pending.toLocaleString()}</Table.Cell>
                  <Table.Cell align="right" className="text-emerald-600 font-bold">${comm.paid.toLocaleString()}</Table.Cell>
                  <Table.Cell align="right">
                     <div className="w-24 ml-auto h-2 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(comm.paid / comm.earned) * 100}%` }} />
                     </div>
                  </Table.Cell>
                </Table.Row>
              ))}
           </Table.Body>
        </Table>
     </Card>
  </div>
);

const ActivityReport = () => (
  <div className="space-y-6">
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Activities" value="1,248" icon={<Activity />} />
        <StatCard label="Phone Calls" value="482" icon={<Activity />} />
        <StatCard label="Emails Sent" value="614" icon={<Activity />} />
        <StatCard label="Meetings" value="152" icon={<Calendar />} />
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Activity Distribution by Rep">
           <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={MOCK_SALES_REPS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 10}} />
                    <Tooltip />
                    <Bar dataKey="won" name="Meetings Held" fill="#3B82F6" />
                    <Bar dataKey="lost" name="Calls Made" fill="#9CA3AF" />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </Card>
        <Card title="Call Outcome Breakdown">
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={[
                         { name: 'Connected', value: 145 },
                         { name: 'No Answer', value: 82 },
                         { name: 'Voicemail', value: 64 },
                         { name: 'Busy', value: 12 },
                       ]}
                       innerRadius={60}
                       outerRadius={100}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {['#10B981', '#9CA3AF', '#3B82F6', '#EF4444'].map((color, i) => (
                         <Cell key={i} fill={color} />
                       ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                 </PieChart>
              </ResponsiveContainer>
           </div>
        </Card>
     </div>
  </div>
);

// Helpers
const CheckCircle = () => <Activity size={24} />;
const PhoneIcon = () => <Activity size={24} />;
const MailIcon = () => <Activity size={24} />;
const BadgePercentIcon = () => <Activity size={24} />;

export default Reports;