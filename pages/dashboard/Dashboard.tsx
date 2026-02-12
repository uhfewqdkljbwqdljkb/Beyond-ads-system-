import React from 'react';
import { 
  DollarSign, 
  Briefcase, 
  Target, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  ChevronRight,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { MetricCard } from '../../components/dashboard/MetricCard.tsx';
import { RevenueChart } from '../../components/dashboard/RevenueChart.tsx';
import { FunnelChart } from '../../components/dashboard/FunnelChart.tsx';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed.tsx';
import { useAuthStore } from '../../store/authStore.ts';
import { useDashboardSummary } from '../../hooks/useAnalytics.ts';
import { useTasks } from '../../hooks/useTasks.js';
import { Spinner, Button, Card, Badge, Avatar } from '../../components/ui/index.ts';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: tasks } = useTasks({ assigned_to: user?.id, overdue: true, limit: 5 });

  if (isSummaryLoading) return <div className="h-full flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Sales Command</h1>
          <p className="text-sm text-zinc-500 font-medium">Strategic overview for {user?.first_name} {user?.last_name}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="subtle" leftIcon={<Clock size={16} />}>Daily Digest</Button>
          <Button onClick={() => navigate('/leads')} leftIcon={<AlertCircle size={16} />}>Review Stale Leads</Button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Pipeline Value" 
          value={`$${(summary?.pipeline_value || 0).toLocaleString()}`} 
          subtext={`Weighted: $${(summary?.weighted_pipeline || 0).toLocaleString()}`}
          icon={TrendingUp} 
          color="blue"
        />
        <MetricCard 
          label="Active Deals" 
          value={summary?.active_deals || 0} 
          subtext="Closing this month: 4"
          icon={Briefcase} 
          color="emerald"
        />
        <MetricCard 
          label="Target Attainment" 
          value="82%" 
          trend={{ value: '12%', direction: 'up' }}
          icon={Target} 
          color="purple"
        />
        <MetricCard 
          label="Current MRR" 
          value={`$${(summary?.mrr || 0).toLocaleString()}`} 
          subtext="+4.2% Growth"
          icon={DollarSign} 
          color="amber"
        />
      </div>

      {/* Action Required Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Overdue Tasks" headerAction={<Badge variant="error">Critical</Badge>}>
           <div className="space-y-4">
              {tasks?.data?.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-red-50/30 border border-red-100 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0"><ShieldAlert size={16} /></div>
                      <div>
                         <p className="text-xs font-black text-zinc-900 truncate max-w-[150px]">{task.title}</p>
                         <p className="text-[10px] text-red-600 font-bold uppercase">Due 2d ago</p>
                      </div>
                   </div>
                   <button onClick={() => navigate('/tasks')} className="p-1 hover:bg-white rounded"><ChevronRight size={16} /></button>
                </div>
              ))}
              {tasks?.data?.length === 0 && <p className="text-zinc-400 text-center py-6 italic text-sm">No urgent tasks.</p>}
              <Button fullWidth variant="ghost" className="text-primary font-bold">View All Tasks</Button>
           </div>
        </Card>

        <Card title="Stale Leads" subtitle="No activity in 48h+">
           <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                      <Avatar name="Lead Name" size="sm" />
                      <div>
                         <p className="text-xs font-bold text-zinc-900">Johnathan Reeves</p>
                         <p className="text-[10px] text-zinc-500">Acme Innovations</p>
                      </div>
                   </div>
                   <Badge variant="warning">Stale</Badge>
                </div>
              ))}
           </div>
        </Card>

        <Card title="Deals Closing Soon" subtitle="Expected next 7 days">
           <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="p-3 border border-zinc-100 rounded-xl space-y-2">
                   <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-zinc-900">Project Alpha</p>
                      <span className="text-[10px] font-black text-emerald-600">$12,500</span>
                   </div>
                   <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '80%' }} />
                   </div>
                   <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest">80% Probability</p>
                </div>
              ))}
           </div>
        </Card>
      </div>

      {/* Analytics Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart />
        <FunnelChart />
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <ActivityFeed title="Global Intelligence Feed" />
        </div>
        <Card title="Team Contribution">
           <div className="space-y-6">
              {[
                { name: 'Sarah Miller', value: 142000, color: 'bg-primary' },
                { name: 'James Wilson', value: 98000, color: 'bg-emerald-500' },
                { name: 'Elena Rodriguez', value: 45000, color: 'bg-amber-500' }
              ].map(rep => (
                <div key={rep.name} className="space-y-2">
                   <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter">
                      <span className="text-zinc-600">{rep.name}</span>
                      <span className="text-zinc-900">${rep.value.toLocaleString()}</span>
                   </div>
                   <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`${rep.color} h-full`} style={{ width: `${(rep.value / 150000) * 100}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;