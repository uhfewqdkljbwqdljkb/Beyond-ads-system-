import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Circle, ArrowRight, ListTodo } from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  entityName: string;
  dueTime?: string;
  priority: 'high' | 'medium' | 'low';
}

export const TasksWidget: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const navigate = useNavigate();

  return (
    <Card 
      title="Tasks Due Today" 
      subtitle={`You have ${tasks.length} items to complete`}
      headerAction={<button onClick={() => navigate('/tasks')} className="text-xs font-bold text-primary hover:underline">View All</button>}
    >
      {tasks.length === 0 ? (
        <div className="py-12 text-center">
           <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3 text-textMuted">
             <CheckCircle2 size={24} />
           </div>
           <p className="text-sm text-textSecondary font-medium">All caught up for today!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="flex items-start gap-3 group">
              <button className="mt-0.5 text-textMuted hover:text-primary transition-colors">
                <Circle size={18} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-textPrimary leading-none truncate group-hover:text-primary transition-colors cursor-pointer">
                  {task.title}
                </p>
                <p className="text-[11px] text-textSecondary mt-1">
                  Rel: <span className="font-semibold text-textPrimary">{task.entityName}</span>
                  {task.dueTime && ` • ${task.dueTime}`}
                </p>
              </div>
              {task.priority === 'high' && <Badge variant="error" size="sm">High</Badge>}
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-border flex justify-center">
        <Button variant="ghost" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
          Manage Daily Schedule
        </Button>
      </div>
    </Card>
  );
};