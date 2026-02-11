import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Search, X, Command, ArrowDown, ArrowUp, CornerDownLeft, Plus, Zap } from 'lucide-react';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { SearchResults } from './SearchResults';
import { Spinner } from '../ui';
import { useNavigate } from 'react-router-dom';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { results, isLoading } = useGlobalSearch(query);
  const navigate = useNavigate();

  const flatResults = Object.values(results).flat();
  // Using a try-catch for local storage to prevent SSR/environment issues, though not strictly necessary in pure SPA
  const getRecentSearches = () => {
    try {
      return JSON.parse(localStorage.getItem('recent_searches') || '[]');
    } catch {
      return [];
    }
  };
  const recentSearches = getRecentSearches();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < flatResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      const selected = flatResults[selectedIndex];
      if (selected) {
        // Save to recent
        const newRecent = [selected.name || `${selected.first_name} ${selected.last_name}`, ...recentSearches.filter(s => s !== (selected.name || `${selected.first_name} ${selected.last_name}`))].slice(0, 5);
        localStorage.setItem('recent_searches', JSON.stringify(newRecent));
        
        // Navigate
        let path = '';
        if (selected.invoice_number) path = `/invoices/${selected.id}`;
        else if (selected.deal_value !== undefined) path = `/deals/${selected.id}`;
        else if (selected.first_name) path = `/leads/${selected.id}`;
        else path = `/clients/${selected.id}`;
        
        navigate(path);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[500] flex items-start justify-center pt-20 sm:pt-32 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200 ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center px-5 py-4 border-b border-zinc-100">
          <Search size={20} className="text-zinc-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-base font-medium text-zinc-900 placeholder:text-zinc-400"
            placeholder="Search leads, deals, clients, invoices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400">
              <X size={16} />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1.5 ml-4 px-2 py-1 bg-zinc-50 rounded border border-zinc-200">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">ESC</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar bg-zinc-50/30">
          {isLoading ? (
            <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
          ) : query.length > 0 ? (
            <SearchResults 
              results={results} 
              query={query} 
              selectedIndex={selectedIndex} 
              onResultClick={onClose} 
            />
          ) : (
            <div className="space-y-8 py-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Recent Searches</h3>
                  <div className="space-y-1">
                    {recentSearches.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => setQuery(s)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all text-sm text-zinc-600 font-medium border border-transparent hover:border-zinc-100"
                      >
                        <HistoryIcon size={14} className="text-zinc-400" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button onClick={() => { navigate('/leads'); onClose(); }} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-white hover:border-primary/30 hover:bg-primary-light/10 transition-all text-left group">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors"><Plus size={16} /></div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Create Lead</p>
                      <p className="text-[10px] text-zinc-500">Add a new sales prospect</p>
                    </div>
                  </button>
                  <button onClick={() => { navigate('/deals'); onClose(); }} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-white hover:border-primary/30 hover:bg-primary-light/10 transition-all text-left group">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Plus size={16} /></div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Create Deal</p>
                      <p className="text-[10px] text-zinc-500">Open a new opportunity</p>
                    </div>
                  </button>
                  <button onClick={() => { navigate('/invoices/new'); onClose(); }} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-white hover:border-primary/30 hover:bg-primary-light/10 transition-all text-left group">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Plus size={16} /></div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Create Invoice</p>
                      <p className="text-[10px] text-zinc-500">Generate billing document</p>
                    </div>
                  </button>
                  <button onClick={() => { navigate('/dashboard'); onClose(); }} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-white hover:border-primary/30 hover:bg-primary-light/10 transition-all text-left group">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors"><Zap size={16} /></div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">View Pipeline</p>
                      <p className="text-[10px] text-zinc-500">Check sales velocity</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 p-3 border-t border-zinc-100 flex items-center justify-between px-5">
          <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5"><CornerDownLeft size={12} /> Select</div>
            <div className="flex items-center gap-1.5"><ArrowUp size={12} /><ArrowDown size={12} /> Navigate</div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-zinc-300">
             BEYOND ADS v2.0
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const HistoryIcon = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);