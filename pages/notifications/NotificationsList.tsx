import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  Inbox
} from 'lucide-react';
import { 
  useNotifications, 
  useMarkAllAsRead, 
  useUnreadCount 
} from '../../hooks/useNotifications';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { 
  Card, 
  Button, 
  Badge, 
  Spinner, 
  EmptyState, 
  Select, 
  Tabs 
} from '../../components/ui';
import { isToday, isYesterday, isThisWeek } from 'date-fns';

const NotificationsList = () => {
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const { data: notifications, isLoading } = useNotifications({});
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAllRead = useMarkAllAsRead();

  // Filtering Logic
  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    let filtered = [...notifications];
    
    if (filter === 'unread') {
      filtered = filtered.filter((n: any) => !n.is_read);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter((n: any) => n.type.toLowerCase().includes(typeFilter.toLowerCase()));
    }
    
    return filtered;
  }, [notifications, filter, typeFilter]);

  // Grouping Logic
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, any[]> = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Earlier': []
    };

    filteredNotifications.forEach((n: any) => {
      const date = new Date(n.created_at);
      if (isToday(date)) groups['Today'].push(n);
      else if (isYesterday(date)) groups['Yesterday'].push(n);
      else if (isThisWeek(date)) groups['This Week'].push(n);
      else groups['Earlier'].push(n);
    });

    return groups;
  }, [filteredNotifications]);

  if (isLoading) {
    return <div className="h-full flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-light text-primary rounded-2xl">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-textPrimary tracking-tight">Notification Center</h1>
            <p className="text-sm text-textSecondary font-medium">You have <span className="text-primary font-bold">{unreadCount}</span> unread alerts</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          leftIcon={<CheckCheck size={18} />}
          onClick={() => markAllRead.mutate()}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden border-none bg-transparent shadow-none">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
           <Tabs defaultValue="all" className="flex-1" onChange={(val) => setFilter(val)}>
              <Tabs.List className="bg-white p-1 rounded-xl border border-border">
                 <Tabs.Tab value="all">All Alerts</Tabs.Tab>
                 <Tabs.Tab value="unread">
                    Unread 
                    {unreadCount > 0 && <Badge variant="error" size="sm" className="ml-2">{unreadCount}</Badge>}
                 </Tabs.Tab>
              </Tabs.List>
           </Tabs>
           
           <div className="flex items-center gap-3">
              <Select 
                className="w-48 border-none bg-white shadow-sm rounded-xl"
                options={[
                  { label: 'All Categories', value: 'all' },
                  { label: 'Deals', value: 'deal' },
                  { label: 'Leads', value: 'lead' },
                  { label: 'Invoices', value: 'invoice' },
                  { label: 'Commissions', value: 'commission' },
                  { label: 'Tasks', value: 'task' },
                ]}
                value={typeFilter}
                onChange={setTypeFilter}
              />
           </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border py-24 text-center">
            <EmptyState 
              icon={<Inbox size={48} />}
              title="No notifications found"
              description={filter === 'unread' ? "You've addressed all unread alerts. Great job!" : "Your inbox is empty."}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Added explicit type [string, any[]] to resolve 'unknown' property error for items.length and items.map */}
            {Object.entries(groupedNotifications).map(([group, items]: [string, any[]]) => {
              if (items.length === 0) return null;
              return (
                <div key={group} className="space-y-3">
                  <h3 className="text-xs font-black text-textMuted uppercase tracking-widest px-4 flex items-center gap-2">
                    <Calendar size={12} /> {group}
                  </h3>
                  <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    {items.map((n: any) => (
                      <NotificationItem key={n.id} notification={n} showDelete onCloseDropdown={() => {}} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationsList;