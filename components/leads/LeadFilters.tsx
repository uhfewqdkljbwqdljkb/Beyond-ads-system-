
import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Button, Checkbox, Select, Input } from '../ui';
import { LeadStatus } from '../../types';

interface LeadFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  params: URLSearchParams;
  setParams: (p: URLSearchParams) => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({ isOpen, onClose, params, setParams }) => {
  const [localParams, setLocalParams] = React.useState(new URLSearchParams(params));

  React.useEffect(() => {
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

  const toggleStatus = (status: string) => {
    const current = localParams.get('status') || '';
    if (current === status) localParams.delete('status');
    else localParams.set('status', status);
    setLocalParams(new URLSearchParams(localParams));
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-textPrimary">Filter Leads</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-md text-textMuted"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest">Lead Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {['NEW', 'CONTACTED', 'QUALIFIED', 'NURTURING', 'UNQUALIFIED'].map(status => (
                <Checkbox 
                  key={status}
                  label={status.charAt(0) + status.slice(1).toLowerCase()}
                  checked={localParams.get('status') === status}
                  onChange={() => toggleStatus(status)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest">Assignment</h3>
            <Select 
              placeholder="All Sales Reps"
              options={[
                { label: 'Sarah Miller', value: 'u1' },
                { label: 'James Wilson', value: 'u2' },
              ]}
              value={localParams.get('assigned_to') || ''}
              onChange={(val) => {
                localParams.set('assigned_to', val);
                setLocalParams(new URLSearchParams(localParams));
              }}
            />
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest">Est. Value Range</h3>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder="Min" 
                className="text-sm" 
                leftIcon={<span className="text-[10px] font-bold text-textMuted">$</span>}
              />
              <span className="text-textMuted">-</span>
              <Input 
                type="number" 
                placeholder="Max" 
                className="text-sm"
                leftIcon={<span className="text-[10px] font-bold text-textMuted">$</span>}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest">Lead Score</h3>
             <input type="range" className="w-full accent-primary h-1.5 bg-surface rounded-lg appearance-none cursor-pointer" />
             <div className="flex justify-between text-[10px] text-textMuted font-bold">
               <span>0</span>
               <span>50</span>
               <span>100</span>
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
