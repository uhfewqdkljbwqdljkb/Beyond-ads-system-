import React, { useState, useEffect } from 'react';
import { Search, Command } from 'lucide-react';
import { SearchModal } from './SearchModal';

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative w-full h-11 pl-11 pr-12 bg-white border border-zinc-100 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100 focus:border-zinc-300 transition-all shadow-sm text-left flex items-center group"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors" size={18} />
        <span className="text-zinc-400 group-hover:text-zinc-600">Search leads, deals...</span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-400 group-hover:border-zinc-300 group-hover:text-zinc-500">
          <Command size={10} /> K
        </div>
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};