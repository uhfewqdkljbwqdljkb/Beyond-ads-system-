import React from 'react';
import { 
  DollarSign, 
  Briefcase, 
  Target, 
  TrendingUp 
} from 'lucide-react';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { RevenueChart } from '../../components/dashboard/RevenueChart';
import { FunnelChart } from '../../components/dashboard/FunnelChart';
import { TasksWidget } from '../../components/dashboard/TasksWidget';
import { LeadsFollowupWidget } from '../../components/dashboard/LeadsFollowupWidget';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { LeaderboardWidget } from '../../components/dashboard/LeaderboardWidget';
import { useAuthStore } from '../../store/authStore';
import { useTasks } from '../../hooks/useTasks';
import { useLeads } from '../../hooks/useLeads';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  
  // Fetch mock data for widgets
  const { data: tasks } = useTasks({ assignedTo: user?.id, status: 'pending', limit: 5 });
  const { data: leads } = useLeads({ status: 'new', limit: 5 });

  // Transform tasks for widget
  const widgetTasks = tasks?.data?.map((t: any) => ({
    id: t.id,
    title: t.title,
    entityName: 'Deal or Lead', // simplified for mock
    priority: t.priority
  })) || [];

  // Transform leads for widget
  const widgetLeads = leads?.data?.map((l: any) => ({
    id: l.id,
    name: `${l.first_name} ${l.last_name}`,
    company: l.company_name,
    daysSinceActivity: 2 // mock
  })) || [];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-textPrimary tracking-tight">Dashboard</h1>
          <p className="text-sm text-textSecondary">Welcome back, {user?.firstName}</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Total Revenue" 
          value="$142,300" 
          icon={DollarSign} 
          trend={{ value: '12%', direction: 'up' }}
          color="emerald"
        />
        <MetricCard 
          label="Active Deals" 
          value="24" 
          icon={Briefcase} 
          subtext="Value: $482k"
          color="blue"
        />
        <MetricCard 
          label="Win Rate" 
          value="68%" 
          icon={Target} 
          trend={{ value: '4%', direction: 'up' }}
          color="purple"
        />
        <MetricCard 
          label="Avg Deal Size" 
          value="$18,400" 
          icon={TrendingUp} 
          trend={{ value: '2%', direction: 'down' }}
          color="amber"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <FunnelChart />
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <TasksWidget tasks={widgetTasks} />
          <LeadsFollowupWidget leads={widgetLeads} />
        </div>
        <div className="space-y-6">
          <LeaderboardWidget />
        </div>
        <div className="space-y-6">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;