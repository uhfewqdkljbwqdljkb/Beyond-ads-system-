import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  BadgePercent, 
  Settings,
  CheckSquare,
  Building2,
  BarChart3,
  X,
  LogOut
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useAuthStore } from '../../store/authStore';

const SECTIONS = [
  {
    title: 'GENERAL',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/leads', icon: Users, label: 'Leads' },
      { path: '/deals', icon: Briefcase, label: 'Deals' },
      { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { path: '/clients', icon: Building2, label: 'Clients' },
      { path: '/invoices', icon: FileText, label: 'Invoices' },
      { path: '/commissions', icon: BadgePercent, label: 'Commissions' },
    ]
  },
  {
    title: 'INSIGHTS',
    items: [
      { path: '/reports', icon: BarChart3, label: 'Reports' },
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
    <>
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm" onClick={closeSidebar} />
      )}

      <aside className={sidebarClasses}>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {(isSidebarOpen || isMobile) && (
              <span className="text-xl font-bold text-zinc-900 tracking-tight whitespace-nowrap">Beyond Ads</span>
            )}
          </div>
          {isMobile && (
            <button onClick={closeSidebar} className="ml-auto p-2 text-zinc-400">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 no-scrollbar">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              {(isSidebarOpen || isMobile) && (
                <h3 className="px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2.5 rounded-xl transition-all group relative
                      ${isActive 
                        ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                      }
                    `}
                  >
                    <item.icon size={20} strokeWidth={2} className="shrink-0" />
                    
                    {(isSidebarOpen || isMobile) && (
                      <span className="ml-3 text-[13px]">{item.label}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-zinc-50">
          {(isSidebarOpen || isMobile) ? (
            <div className="space-y-2">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all text-[13px] font-medium"
              >
                <LogOut size={20} strokeWidth={2} />
                Sign Out
              </button>
              <p className="text-[10px] text-center text-zinc-300 font-medium pt-2">
                v2.4.0
              </p>
            </div>
          ) : (
            <button 
              onClick={logout}
              className="w-full flex justify-center p-2 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} strokeWidth={2} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};