
import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, DollarSign, Target, 
  Download, Filter, Calendar, Zap, PieChart, Briefcase
} from 'lucide-react';
import { 
  Card, Button, StatCard, Badge, Tabs, 
  Select, Table, Avatar, Spinner 
} from '../../components/ui';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell 
} from 'recharts';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Intelligence Hub</h1>
          <p className="text-sm text-zinc-500 font-medium">Drill-down into agency performance metrics</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" leftIcon={<Download size={16} />}>Export Data</Button>
           <Select 
             className="w-44 border-zinc-200 bg-white"
             options={[{label: 'Last 30 Days', value: '30d'}, {label: 'This Quarter', value: 'q'}, {label: 'Year to Date', value: 'ytd'}]}
             value="30d"
             onChange={() => {}}
           />
        </div>
      </div>

      <Tabs defaultValue="pipeline" onChange={setActiveTab}>
         <Tabs.List className="bg-white p-1 rounded-xl border border-zinc-100 inline-flex shadow-sm">
            <Tabs.Tab value="pipeline">Pipeline</Tabs.Tab>
            <Tabs.Tab value="sources">Sources</Tabs.Tab>
            <Tabs.Tab value="velocity">Velocity</Tabs.Tab>
            <Tabs.Tab value="team">Performance</Tabs.Tab>
         </Tabs.List>

         <Tabs.Panels className="mt-8">
            <Tabs.Panel value="pipeline">
               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <StatCard label="Pipeline Total" value="$2.84M" icon={<DollarSign size={18} />} color="blue" />
                     <StatCard label="Weighted Total" value="$1.12M" icon={<Target size={18} />} color="emerald" />
                     <StatCard label="Avg. Deal Size" value="$18.4k" icon={<TrendingUp size={18} />} color="purple" />
                     <StatCard label="Active Count" value="142" icon={<Briefcase size={18} />} color="amber" />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <Card title="Value by Stage" subtitle="Total vs Weighted Opportunity">
                        <div className="h-[300px] mt-4">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { name: 'Discovery', total: 420000, weighted: 42000 },
                                { name: 'Proposal', total: 850000, weighted: 340000 },
                                { name: 'Negotiation', total: 640000, weighted: 384000 },
                                { name: 'Contract', total: 320000, weighted: 256000 },
                              ]}>
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={v => `$${v/1000}k`} />
                                 <Tooltip />
                                 <Bar dataKey="total" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                                 <Bar dataKey="weighted" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </Card>

                     <Card title="Conversion Leakage" subtitle="Percentage lost at each stage">
                        <div className="space-y-6 pt-4">
                           {[
                             { stage: 'Discovery → Proposal', rate: '68%', status: 'optimal' },
                             { stage: 'Proposal → Negotiation', rate: '42%', status: 'warning' },
                             { stage: 'Negotiation → Contract', rate: '85%', status: 'optimal' },
                             { stage: 'Contract → Won', rate: '92%', status: 'optimal' },
                           ].map(item => (
                             <div key={item.stage} className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-600 uppercase tracking-tight">{item.stage}</span>
                                <div className="flex items-center gap-3">
                                   <span className="text-lg font-black text-zinc-900">{item.rate}</span>
                                   <Badge variant={item.status === 'optimal' ? 'success' : 'warning'}>{item.status}</Badge>
                                </div>
                             </div>
                           ))}
                        </div>
                     </Card>
                  </div>
               </div>
            </Tabs.Panel>

            <Tabs.Panel value="sources">
               <div className="space-y-6">
                  <Card title="Lead Source Performance">
                     <Table>
                        <Table.Header>
                           <Table.Row hover={false}>
                              <Table.HeaderCell>Source</Table.HeaderCell>
                              <Table.HeaderCell>Lead Count</Table.HeaderCell>
                              <Table.HeaderCell>Conv. Rate</Table.HeaderCell>
                              <Table.HeaderCell>Total Won Value</Table.HeaderCell>
                              <Table.HeaderCell align="right">ROI Rank</Table.HeaderCell>
                           </Table.Row>
                        </Table.Header>
                        <Table.Body>
                           {[
                             { name: 'LinkedIn Ads', count: 142, rate: '8.4%', value: 124000, rank: 1 },
                             { name: 'Referrals', count: 24, rate: '45.2%', value: 185000, rank: 2 },
                             { name: 'Cold Outreach', count: 850, rate: '1.2%', value: 42000, rank: 4 },
                           ].map(row => (
                             <Table.Row key={row.name}>
                                <Table.Cell className="font-bold">{row.name}</Table.Cell>
                                <Table.Cell>{row.count}</Table.Cell>
                                <Table.Cell><span className="font-bold text-primary">{row.rate}</span></Table.Cell>
                                <Table.Cell>${row.value.toLocaleString()}</Table.Cell>
                                <Table.Cell align="right"><Badge variant="default">#{row.rank}</Badge></Table.Cell>
                             </Table.Row>
                           ))}
                        </Table.Body>
                     </Table>
                  </Card>
               </div>
            </Tabs.Panel>
         </Tabs.Panels>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
