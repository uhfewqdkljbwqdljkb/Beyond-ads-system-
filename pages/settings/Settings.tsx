import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Users, 
  BadgePercent, 
  Briefcase, 
  GitMerge, 
  Link2,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { path: '/settings/profile', icon: User, label: 'My Profile', description: 'Personal details and security', adminOnly: false },
    { path: '/settings/company', icon: Building2, label: 'Company Info', description: 'Agency details and branding', adminOnly: true },
    { path: '/settings/team', icon: Users, label: 'Team Management', description: 'User roles and permissions', adminOnly: true },
    { path: '/settings/commissions', icon: BadgePercent, label: 'Commission Rules', description: 'Payout structures and tiers', adminOnly: true },
    { path: '/settings/services', icon: Briefcase, label: 'Services', description: 'Agency offerings and pricing', adminOnly: true },
    { path: '/settings/pipeline', icon: GitMerge, label: 'Pipeline Stages', description: 'Deal lifecycle stages', adminOnly: true },
    { path: '/settings/lead-sources', icon: Link2, label: 'Lead Sources', description: 'Inbound channel tracking', adminOnly: true },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="sticky top-6 space-y-1">
            <h1 className="text-2xl font-bold text-textPrimary px-4 mb-6">Settings</h1>
            <nav className="space-y-1">
              {navItems.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-start p-3 rounded-xl transition-all group
                      ${isActive 
                        ? 'bg-white shadow-sm border border-border ring-1 ring-primary/5 text-primary' 
                        : 'text-textSecondary hover:bg-white/50 hover:text-textPrimary border border-transparent'
                      }
                    `}
                  >
                    <div className={`p-2 rounded-lg mr-3 transition-colors ${location.pathname === item.path ? 'bg-primary text-white' : 'bg-surface text-textMuted group-hover:bg-primary-light group-hover:text-primary'}`}>
                      <item.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-tight">{item.label}</p>
                      <p className="text-[10px] text-textMuted mt-0.5 truncate">{item.description}</p>
                    </div>
                    <ChevronRight size={14} className={`mt-2 transition-opacity ${location.pathname === item.path ? 'opacity-100' : 'opacity-0'}`} />
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Settings Content Area */}
        <main className="flex-1 min-w-0">
          <Card className="min-h-[600px] border-none shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-black/5" padding="none">
            <div className="p-8">
              <Outlet />
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;