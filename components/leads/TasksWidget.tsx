import React from 'react';
import { format } from 'date-fns';
import { Plus, Calendar, UserPlus } from 'lucide-react';
import { Button, Badge, Checkbox } from '../ui';
import { useTasks, useCompleteTask } from '../../hooks/useTasks';

interface TasksWidgetProps {
  entityType: 'lead' | 'deal' | 'client';
  entityId: string;
  onAddTask: () => void;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({ entityType, entityId, onAddTask }) => {
  const { data: tasksData, isLoading } = useTasks({ entityType, entityId, status: 'pending' });
  const completeTask = useCompleteTask();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
         <div className="flex gap-2">
           <Badge variant="primary" size="sm">Active Tasks</Badge>
         </div>
         <Button size="sm" variant="ghost" leftIcon={<Plus size={14} />} onClick={onAddTask}>New Task</Button>
      </div>

      {isLoading ? (
        <div className="py-4 text-center text-textMuted">Loading tasks...</div>
      ) : tasksData?.data.length === 0 ? (
        <div className="py-8 text-center text-textMuted italic text-sm">No pending tasks.</div>
      ) : (
        <div className="space-y-3">
          {tasksData?.data.map((task: any) => (
            <div key={task.id} className="flex items-start gap-3 p-3 bg-surface hover:bg-white border border-border rounded-xl transition-all group">
              <Checkbox 
                checked={task.status === 'completed'} 
                onChange={() => completeTask.mutate(task.id)} 
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h6 className="text-sm font-bold truncate text-textPrimary">
                    {task.title}
                  </h6>
                  <Badge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'default'} size="sm">
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-textMuted">
                   <span className="flex items-center gap-1">
                     <Calendar size={12} /> {format(new Date(task.due_date), 'MMM d, h:mm a')}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};