
import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Filter } from 'lucide-react';
import { Button, Checkbox, Select, Input, Badge } from '../ui';
import { usePipelineStages } from '../../hooks/usePipeline';
import { useUsers } from '../../hooks/useUsers';

interface DealFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  params: URLSearchParams;
  setParams: (p: URLSearchParams) => void;
}

export const DealFilters: React.FC<DealFiltersProps> = ({ isOpen, onClose, params, setParams }) => {
  const [localParams, setLocalParams] = useState(new URLSearchParams(params));
  const { data: stages } = usePipelineStages();
  const { data: usersData } = useUsers();

  useEffect(() => {
    setLocalParams(new URLSearchParams(params));
  }, [params, isOpen]);

  const handleApply = () => {
    setParams(localParams);
    onClose();
  };

  const handleClear = () => {
    const clearParams = new URLSearchParams();
    setLocalParams(clearParams);
    setParams(clearParams);
    onClose();
  };

  if (!isOpen) return null;

  const repOptions = usersData?.data?.map((u: any) => ({ value: u.id, label: `${u.first_name} ${u.last_name}` })) || [];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-textPrimary">Filter Deals</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-md text-textMuted"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section className="space-y-3">
            <h3 className="text-xs font-black text-textMuted uppercase tracking-widest">Pipeline Stage</h3>
            <div className="grid grid-cols-1 gap-2">
              {stages?.map((stage: any) => (
                <Checkbox 
                  key={stage.id}
                  label={stage.name}
                  checked={localParams.get('stage') === stage.id}
                  onChange={() => {
                    if (localParams.get('stage') === stage.id) localParams.delete('stage');
                    else localParams.set('stage', stage.id);
                    setLocalParams(new URLSearchParams(localParams));
                  }}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-black text-textMuted uppercase tracking-widest">Deal Owner</h3>
            <Select 
              placeholder="All Reps"
              options={repOptions}
              value={localParams.get('assigned_to') || ''}
              onChange={(val) => {
                localParams.set('assigned_to', val);
                setLocalParams(new URLSearchParams(localParams));
              }}
            />
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-black text-textMuted uppercase tracking-widest">Deal Type</h3>
            <div className="flex flex-wrap gap-2">
              {['one_time', 'retainer', 'contract'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    if (localParams.get('type') === type) localParams.delete('type');
                    else localParams.set('type', type);
                    setLocalParams(new URLSearchParams(localParams));
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                    localParams.get('type') === type 
                      ? 'bg-primary border-primary text-white' 
                      : 'bg-surface border-border text-textSecondary hover:border-primary/50'
                  }`}
                >
                  {type.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-black text-textMuted uppercase tracking-widest">Value Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Min $" type="number" className="text-xs" />
              <Input placeholder="Max $" type="number" className="text-xs" />
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-border bg-surface flex items-center gap-3">
          <Button variant="ghost" className="flex-1" onClick={handleClear} leftIcon={<RotateCcw size={16} />}>
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};
