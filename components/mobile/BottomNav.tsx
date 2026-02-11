
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Search, PlusCircle } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/leads', icon: Users, label: 'Leads' },
    { path: '/deals', icon: Briefcase, label: 'Deals' },
    { path: '/search', icon: Search, label: 'Search' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border flex items-center justify-around px-2 z-40 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center flex-1 py-1 gap-1
            ${isActive ? 'text-primary' : 'text-textMuted'}
          `}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
      <button className="flex flex-col items-center justify-center flex-1 text-primary">
         <PlusCircle size={28} />
      </button>
    </div>
  );
};
