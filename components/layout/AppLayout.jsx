import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { BottomNav } from '../mobile/BottomNav.jsx';
import { useUIStore } from '../../store/uiStore.js';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import { BeyondAI } from '../ai/BeyondAI.jsx';
import { Sparkles } from 'lucide-react';

export const AppLayout = () => {
  const { isSidebarOpen } = useUIStore();
  const isMobile = useIsMobile();
  const [isAIOpen, setIsAIOpen] = useState(false);

  const mainClasses = `
    flex-1 flex flex-col transition-all duration-300
    ${isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-64' : 'ml-20')}
  `;

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans antialiased">
      <Sidebar />
      
      <div className={mainClasses}>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-white">
          <Outlet />
        </main>
        <BottomNav />
      </div>

      {/* Global AI Trigger */}
      <button 
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group border border-white/10"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
      </button>

      <BeyondAI isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};