import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Search,
  CheckCircle2,
  Circle,
  Filter,
  ListTodo
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Badge, 
  Checkbox, 
  Avatar, 
  Spinner, 
  EmptyState
} from '../../components/ui';
import { useTasks, useCompleteTask } from '../../hooks/useTasks';
import { useAuthStore } from '../../store/authStore';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { CreateTaskModal } from '../../components/leads/CreateTaskModal';

const TasksList: React.FC = () => {
  const [filter, setFilter] = useState('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: tasksData, isLoading } = useTasks({ 
    status: filter === 'all' ? undefined : filter 
  });
  
  const completeTask = useCompleteTask();

  const tasks = tasksData?.data?.filter((t: any) => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Grouping logic
  const groupedTasks = tasks.reduce((acc: any, task: any) => {
    if (task.status === 'completed') {
      acc.completed.push(task);
      return acc;
    }
    
    const dueDate = new Date(task.due_date);
    if (isPast(dueDate) && !isToday(dueDate)) {
      acc.overdue.push(task);
    } else if (isToday(dueDate)) {
      acc.today.push(task);
    } else if (isTomorrow(dueDate)) {
      acc.tomorrow.push(task);
    } else {
      acc.upcoming.push(task);
    }
    return acc;
  }, { overdue: [], today: [], tomorrow: [], upcoming: [], completed: [] });

  if (isLoading) return <div className="h-full flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-3">
            Tasks <Badge variant="default" size="sm" className="ml-1">{tasks.length}</Badge>
          </h1>
          <p className="text-sm text-textSecondary">Manage your daily activities and follow-ups</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setIsModalOpen(true)}>
          New Task
        </Button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-border shadow-sm shrink-0">
        <div className="flex flex-1 w-full md:max-w-md gap-3 items-center">
          <div className="relative flex-1">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
             <input 
               type="text" 
               placeholder="Search tasks..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-1.5 text-sm bg-zinc-50 border-none rounded-md focus:bg-white focus:ring-1 focus:ring-primary placeholder:text-zinc-400" 
             />
          </div>
          
          <div className="hidden md:flex items-center gap-1 ml-2">
            <button 
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === 'pending' ? 'bg-primary-light text-primary' : 'text-textSecondary hover:bg-zinc-50'}`}
            >
              To Do
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'text-textSecondary hover:bg-zinc-50'}`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
           <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-textSecondary hover:bg-surface rounded-lg transition-colors border border-transparent hover:border-border">
             <Filter size={14} /> Filters
           </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-8 pr-2">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <EmptyState 
              icon={<CheckSquare size={48} />} 
              title="No tasks found" 
              description={filter === 'pending' ? "You're all caught up! Enjoy your free time." : "No completed tasks yet."}
              action={<Button onClick={() => setIsModalOpen(true)}>Create Task</Button>}
            />
          </div>
        ) : (
          <>
            {filter === 'pending' && (
              <>
                {groupedTasks.overdue.length > 0 && (
                  <TaskGroup title="Overdue" tasks={groupedTasks.overdue} color="text-error" />
                )}
                {groupedTasks.today.length > 0 && (
                  <TaskGroup title="Due Today" tasks={groupedTasks.today} color="text-primary" />
                )}
                {groupedTasks.tomorrow.length > 0 && (
                  <TaskGroup title="Tomorrow" tasks={groupedTasks.tomorrow} color="text-textPrimary" />
                )}
                {groupedTasks.upcoming.length > 0 && (
                  <TaskGroup title="Upcoming" tasks={groupedTasks.upcoming} color="text-textSecondary" />
                )}
              </>
            )}
            
            {filter === 'completed' && (
              <TaskGroup title="Completed" tasks={groupedTasks.completed} color="text-emerald-600" isCompleted />
            )}
          </>
        )}
      </div>

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const TaskGroup = ({ title, tasks, color, isCompleted = false }: any) => {
  const completeTask = useCompleteTask();

  return (
    <div className="space-y-3">
      <h3 className={`text-xs font-black uppercase tracking-widest ${color} flex items-center gap-2 pl-1`}>
        {title} <Badge size="xs" variant="default">{tasks.length}</Badge>
      </h3>
      <div className="grid gap-3">
        {tasks.map((task: any) => (
          <div key={task.id} className="flex items-start gap-4 p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
            <button 
              onClick={() => !isCompleted && completeTask.mutate(task.id)}
              disabled={isCompleted}
              className={`mt-0.5 shrink-0 ${isCompleted ? 'text-emerald-500 cursor-default' : 'text-textMuted hover:text-emerald-500 transition-colors'}`}
            >
              {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className={`text-sm font-bold text-textPrimary leading-tight ${isCompleted ? 'line-through text-textMuted' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-textSecondary mt-1 line-clamp-2">
                    {task.description || 'No additional details'}
                  </p>
                </div>
                {task.priority === 'high' && !isCompleted && (
                  <Badge variant="error" size="xs" className="uppercase tracking-wider font-bold">High Priority</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-3">
                <div className={`flex items-center gap-1.5 text-xs font-medium ${isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && !isCompleted ? 'text-error' : 'text-textMuted'}`}>
                  <Calendar size={12} />
                  {format(new Date(task.due_date), 'MMM d, h:mm a')}
                </div>
                
                {task.entity_type && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary-light/50 px-2 py-0.5 rounded border border-primary/10">
                    <span className="capitalize">{task.entity_type}:</span>
                    <span className="font-black">#{task.entity_id.substring(0, 4)}</span>
                  </div>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <Avatar name={task.users?.first_name || 'U'} size="xs" src={task.users?.avatar_url} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksList;