import React from 'react';
import { Search, Bell, Plus, Gift, Command } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.ts';
import { useUIStore } from '../../store/uiStore.ts';
import { useIsMobile } from '../../hooks/useMediaQuery.ts';
import { GlobalSearch } from '../search/GlobalSearch.jsx';
import { Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const isMobile = useIsMobile();

  return (
    <header className="h-20 bg-white flex items-center justify-between px-6 shrink-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        {isMobile && (
          <button onClick={toggleSidebar} className="p-2 text-zinc-500 hover:bg-zinc-50 rounded-lg">
            <Menu size={20} />
          </button>
        )}
        
        {/* Search Bar */}
        <div className="max-w-xl w-full hidden md:block">
          <GlobalSearch />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors relative">
          <Gift size={20} />
        </button>
        
        <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors">
          <Plus size={20} />
        </button>

        <div className="h-8 w-px bg-zinc-100 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-zinc-900 leading-none">Young Alaska</p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">Business</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};