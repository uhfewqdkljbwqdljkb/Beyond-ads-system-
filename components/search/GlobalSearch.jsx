
import React, { useState, useEffect } from 'react';
import { Search, Command, X, ArrowRight, User, Briefcase, Building2, Terminal } from 'lucide-react';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { Spinner, Badge } from '../ui';
import { useNavigate } from 'react-router-dom';

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { results, isLoading } = useGlobalSearch(query);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResultClick = (url) => {
    navigate(url);
    setIsOpen(false);
    setQuery('');
  };

  const hasResults = results.leads.length > 0 || results.deals.length > 0 || results.clients.length > 0;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-between text-zinc-400 hover:border-primary/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <Search size={18} className="group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium">Search records...</span>
        </div>
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-zinc-200 bg-white text-[10px] font-black text-zinc-400">
           <Command size={10} /> K
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-24 px-4">
           <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />
           
           <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-zinc-100 flex items-center gap-3 bg-white">
                 <Search size={22} className="text-primary" />
                 <input 
                   autoFocus
                   type="text"
                   className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-zinc-900 placeholder:text-zinc-300"
                   placeholder="Type to search agency data..."
                   value={query}
                   onChange={e => setQuery(e.target.value)}
                 />
                 <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-zinc-50 rounded-lg text-zinc-400"><X size={20} /></button>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
                 {isLoading ? (
                   <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
                 ) : query.length < 2 ? (
                   <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-300"><Terminal size={32} /></div>
                      <p className="text-zinc-400 text-sm font-medium">Start typing to search across leads, deals, and clients.</p>
                   </div>
                 ) : !hasResults ? (
                   <div className="py-20 text-center">
                      <p className="text-zinc-400 text-sm font-medium">No records found matching "{query}"</p>
                   </div>
                 ) : (
                   <div className="space-y-6">
                      {results.leads.length > 0 && (
                        <div className="space-y-2">
                           <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">👤 Leads</h4>
                           {results.leads.map(l => (
                             <button key={l.id} onClick={() => handleResultClick(`/leads/${l.id}`)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors group">
                                <div className="text-left">
                                   <p className="text-sm font-bold text-zinc-900">{l.first_name} {l.last_name}</p>
                                   <p className="text-xs text-zinc-500">{l.company_name}</p>
                                </div>
                                <ArrowRight size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-all" />
                             </button>
                           ))}
                        </div>
                      )}
                      {results.deals.length > 0 && (
                        <div className="space-y-2">
                           <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">💰 Deals</h4>
                           {results.deals.map(d => (
                             <button key={d.id} onClick={() => handleResultClick(`/deals/${d.id}`)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors group">
                                <div className="text-left">
                                   <p className="text-sm font-bold text-zinc-900">{d.name}</p>
                                   <p className="text-xs text-zinc-500">{d.clients?.company_name}</p>
                                </div>
                                <ArrowRight size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-all" />
                             </button>
                           ))}
                        </div>
                      )}
                      {results.clients.length > 0 && (
                        <div className="space-y-2">
                           <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">🏢 Clients</h4>
                           {results.clients.map(c => (
                             <button key={c.id} onClick={() => handleResultClick(`/clients/${c.id}`)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors group">
                                <div className="text-left">
                                   <p className="text-sm font-bold text-zinc-900">{c.company_name}</p>
                                   <p className="text-xs text-zinc-500">Account</p>
                                </div>
                                <ArrowRight size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-all" />
                             </button>
                           ))}
                        </div>
                      )}
                   </div>
                 )}
              </div>
              
              <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between px-5">
                 <div className="flex gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>↑↓ to navigate</span>
                    <span>⏎ to select</span>
                 </div>
                 <div className="text-[10px] font-black text-zinc-300">BEYOND ADS CRM v2.0</div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
