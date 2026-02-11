import React from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Target, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button, Card, Input, Badge, Toggle, Checkbox } from '../../components/ui';
import { usePipelineStages, useUpdateStage } from '../../hooks/usePipeline';
import { useToast } from '../../components/ui/Toast';

const PipelineSettings: React.FC = () => {
  const { data: stages, isLoading } = usePipelineStages();
  const updateStage = useUpdateStage();
  const toast = useToast();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    toast.info('Reordering pipeline stages...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-textPrimary">Pipeline Stages</h1>
          <p className="text-sm text-textSecondary">Manage the lifecycle of your agency's deals</p>
        </div>
        <Button leftIcon={<Plus size={18} />}>Add Stage</Button>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 mb-6">
         <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
         <p className="text-xs text-amber-800 font-medium">
            Standardizing stages helps with reporting. Every pipeline must have exactly one <span className="font-bold">WON</span> and one <span className="font-bold">LOST</span> endpoint.
         </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pipeline-stages">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {stages?.map((stage: any, index: number) => (
                <Draggable key={stage.id} draggableId={stage.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        flex items-center gap-4 p-4 bg-white border rounded-2xl shadow-sm transition-all
                        ${snapshot.isDragging ? 'rotate-1 shadow-lg ring-2 ring-primary/20 z-50' : 'hover:border-primary/50'}
                      `}
                    >
                      <div {...provided.dragHandleProps} className="p-1 text-textMuted cursor-grab active:cursor-grabbing">
                        <GripVertical size={20} />
                      </div>
                      
                      <div className="w-10 h-10 rounded-xl border border-border shrink-0 flex items-center justify-center" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>
                         <Target size={20} />
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input defaultValue={stage.name} className="font-bold border-none bg-surface/50" />
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-bold text-textMuted uppercase whitespace-nowrap">Prob. %</span>
                           <Input type="number" defaultValue={stage.default_probability} className="w-20 border-none bg-surface/50" />
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5">
                              <Checkbox checked={stage.is_won_stage} onChange={() => {}} size="sm" />
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">WON</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Checkbox checked={stage.is_lost_stage} onChange={() => {}} size="sm" />
                              <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">LOST</span>
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-4 border-l border-border">
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-bold text-textMuted uppercase">Deals</span>
                           <span className="text-sm font-black text-textPrimary">0</span>
                        </div>
                        <button className="p-2 text-textMuted hover:text-error transition-colors">
                           <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="pt-6 flex justify-end">
         <Button variant="secondary" onClick={() => toast.success('Pipeline configuration saved')}>Save Pipeline Arrangement</Button>
      </div>
    </div>
  );
};

export default PipelineSettings;