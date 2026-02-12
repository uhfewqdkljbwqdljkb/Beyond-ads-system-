
import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, FileText, BadgePercent, Settings,
  CheckSquare, Building2, BarChart3, X, LogOut, Layers, Zap
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore.ts';
import { useIsMobile } from '../../hooks/useMediaQuery.ts';
import { useAuthStore } from '../../store/authStore.ts';

const SECTIONS = [
  {
    title: 'SALES ENGINE',
    items: [
      { path: '/dashboard', icon: Zap, label: 'Command Center' },
      { path: '/leads', icon: Users, label: 'Leads' },
      { path: '/deals', icon: Briefcase, label: 'Deals' },
      { path: '/tasks', icon: CheckSquare, label: 'Daily Tasks' },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { path: '/clients', icon: Building2, label: 'Client Accounts' },
      { path: '/projects', icon: Layers, label: 'Project Delivery' },
      { path: '/invoices', icon: FileText, label: 'Billing' },
    ]
  },
  {
    title: 'PERFORMANCE',
    items: [
      { path: '/reports', icon: BarChart3, label: 'Intelligence' },
      { path: '/commissions', icon: BadgePercent, label: 'Payouts' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { path: '/settings', icon: Settings, label: 'Settings' },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const { logout } = useAuthStore();
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    if (isMobile) closeSidebar();
  }, [location.pathname, isMobile, closeSidebar]);

  const sidebarClasses = `
    fixed left-0 top-0 h-full bg-white border-r border-zinc-100 transition-all duration-300 z-[60] flex flex-col
    ${isMobile 
      ? (isSidebarOpen ? 'w-full translate-x-0' : 'w-64 -translate-x-full') 
      : (isSidebarOpen ? 'w-64' : 'w-20 overflow-hidden')
    }
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="h-20 flex items-center px-6 border-b border-transparent shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg ring-4 ring-zinc-50">
             <Zap size={18} fill="currentColor" />
          </div>
          {(isSidebarOpen || isMobile) && (
            <span className="text-xl font-black text-zinc-900 tracking-tighter">Beyond Ads</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-10 no-scrollbar">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            {(isSidebarOpen || isMobile) && (
              <h3 className="px-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 rounded-xl transition-all group relative
                    ${isActive 
                      ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200 font-bold' 
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                    }
                  `}
                >
                  <item.icon size={18} className="shrink-0" />
                  {(isSidebarOpen || isMobile) && (
                    <span className="ml-3 text-[13px] leading-none pt-0.5">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-50">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <LogOut size={18} />
          {(isSidebarOpen || isMobile) && "Sign Out"}
        </button>
      </div>
    </aside>
  );
};