
import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, Search, List as ListIcon, LayoutGrid, 
  Filter, DollarSign, Target, Calendar,
  BarChart3, RefreshCw, HandCoins, ChevronDown
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

import { 
  Card, Button, Badge, Table, Spinner, EmptyState, Avatar
} from '../../components/ui';
import { useDealsByStage, useMoveDealToStage } from '../../hooks/useDeals';

import { DealCard } from '../../components/deals/DealCard';
import { AddDealModal } from '../../components/deals/AddDealModal';

const DealsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'board' | 'list'>('board');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: stages, isLoading } = useDealsByStage();
  const moveDealMutation = useMoveDealToStage();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    moveDealMutation.mutate({ 
      dealId: result.draggableId, 
      stageId: result.destination.droppableId 
    });
  };

  if (isLoading) return <div className="h-full flex items-center justify-center"><Spinner size="lg" /></div>;

  const totalValue = stages?.reduce((acc: number, stage: any) => 
    acc + (stage.deals?.reduce((s: number, d: any) => s + (d.deal_value || 0), 0) || 0), 0) || 0;
  
  const weightedValue = stages?.reduce((acc: number, stage: any) => 
    acc + (stage.deals?.reduce((s: number, d: any) => s + ((d.deal_value || 0) * (d.win_probability / 100)), 0) || 0), 0) || 0;

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-bold text-textPrimary">Deals</h1>
            <p className="text-sm text-textSecondary">Manage pipeline and sales opportunities</p>
          </div>
          
          {/* Inline Stats */}
          <div className="hidden lg:flex items-center gap-6 text-sm bg-surface/50 px-4 py-2 rounded-xl border border-border/50">
            <div>
              <span className="text-textMuted font-medium text-xs uppercase tracking-wider">Pipeline</span>
              <span className="ml-2 font-bold text-textPrimary">${totalValue.toLocaleString()}</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div>
              <span className="text-textMuted font-medium text-xs uppercase tracking-wider">Weighted</span>
              <span className="ml-2 font-bold text-textPrimary">${weightedValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setIsAddModalOpen(true)}>
          Add Deal
        </Button>
      </div>
      
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-border shadow-sm shrink-0">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search deals..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-zinc-50 border-none rounded-md focus:bg-white focus:ring-1 focus:ring-primary placeholder:text-zinc-400"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-100 rounded-lg p-1">
            <button 
              onClick={() => setView('board')} 
              className={`p-1.5 rounded-md transition-all ${view === 'board' ? 'bg-white shadow-sm text-primary' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button 
              onClick={() => setView('list')} 
              className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <ListIcon size={14} />
            </button>
          </div>
          <div className="w-px h-6 bg-border mx-2" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-textSecondary hover:bg-surface rounded-lg transition-colors border border-transparent hover:border-border">
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>
      
      {/* CONTENT AREA */}
      <div className="flex-1 min-h-0">
        {view === 'board' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="h-full flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {stages?.map((stage: any) => (
                <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-zinc-50/50 rounded-2xl border border-border/60">
                  {/* Column Header */}
                  <div className="px-4 py-3 border-b border-border/50 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: stage.color || '#94a3b8' }} 
                        />
                        <span className="text-xs font-bold text-textPrimary uppercase tracking-wider">{stage.name}</span>
                        <Badge variant="default" size="xs" className="ml-1">{stage.deals?.length || 0}</Badge>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-textSecondary pl-4">
                      ${(stage.deals?.reduce((s:any, d:any) => s + (d.deal_value || 0), 0) || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Container */}
                  <Droppable droppableId={String(stage.id)}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                          flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar transition-colors
                          ${snapshot.isDraggingOver ? 'bg-primary-light/10' : ''}
                        `}
                      >
                        {stage.deals?.map((deal: any, index: number) => (
                          <Draggable key={deal.id} draggableId={String(deal.id)} index={index}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <DealCard deal={deal} isDragging={snapshot.isDragging} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        ) : (
          <div className="p-12 text-center text-textMuted bg-surface rounded-2xl border border-border border-dashed">
            List view coming soon...
          </div>
        )}
      </div>

      <AddDealModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default DealsList;
