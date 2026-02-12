import React, { useState } from 'react';
import { useCurrentUser } from '../../hooks/useAuth.ts';
import { useQuery } from '@tanstack/react-query';
import { salesAnalyticsService } from '../../services/salesAnalyticsService.ts';
import { Card, Badge, StatCard, Avatar, Button, Select } from '../../components/ui/index.ts';
import { 
  DollarSign, Target, TrendingUp, Phone, Mail, 
  CheckCircle2, Clock, ArrowRight, Zap 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SalesDashboard: React.FC = () => {
  const { data: user } = useCurrentUser();
  const [period, setPeriod] = useState('month');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['salesStats', user?.id, period],
    queryFn: () => salesAnalyticsService.getSalesPersonStats(user!.id, period),
    enabled: !!user?.id
  });

  if (isLoading || !stats) return <div className="h-full flex items-center justify-center"><Zap className="animate-pulse text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Sales Command</h1>
          <p className="text-sm text-zinc-500 font-medium">Tracking performance for {user?.first_name}</p>
        </div>
        <Select 
          className="w-40 border-zinc-200"
          options={[{label: 'This Month', value: 'month'}, {label: 'This Week', value: 'week'}, {label: 'Today', value: 'today'}]}
          value={period}
          onChange={setPeriod}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Pipeline Value" value={`$${stats.pipeline_value.toLocaleString()}`} subtext={`Weighted: $${stats.weighted_pipeline.toLocaleString()}`} icon={<TrendingUp size={18} />} color="blue" />
        <StatCard label="Closed Revenue" value={`$${stats.closed_value.toLocaleString()}`} subtext="Total Won Deals" icon={<DollarSign size={18} />} color="emerald" />
        <StatCard label="Win Rate" value={`${stats.win_rate.toFixed(1)}%`} icon={<Target size={18} />} color="purple" />
        <StatCard label="Task Progress" value={`${stats.completed_tasks}/${stats.total_tasks}`} subtext="Action Items" icon={<CheckCircle2 size={18} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Activity Summary">
          <div className="grid grid-cols-3 gap-4 py-4">
             <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100/50">
                <Phone className="mx-auto text-blue-600 mb-2" size={24} />
                <p className="text-2xl font-black text-zinc-900">{stats.calls_made}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Calls</p>
             </div>
             <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100/50">
                <Mail className="mx-auto text-purple-600 mb-2" size={24} />
                <p className="text-2xl font-black text-zinc-900">{stats.emails_sent}</p>
                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mt-1">Emails</p>
             </div>
             <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                <CheckCircle2 className="mx-auto text-emerald-600 mb-2" size={24} />
                <p className="text-2xl font-black text-zinc-900">{stats.completed_tasks}</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Closed Tasks</p>
             </div>
          </div>
        </Card>

        <Card title="Quick Actions">
           <div className="space-y-3">
              <Link to="/leads"><Button fullWidth variant="outline" className="justify-start px-4">Add New Lead</Button></Link>
              <Link to="/deals"><Button fullWidth variant="outline" className="justify-start px-4">Create Deal</Button></Link>
              <Link to="/tasks"><Button fullWidth variant="outline" className="justify-start px-4">New Task</Button></Link>
           </div>
        </Card>
      </div>
    </div>
  );
};