import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Users,
  ShoppingBag,
  BookOpen,
  Settings,
  Bot
} from 'lucide-react';
import { Avatar } from '../components/Avatar';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Tickets', path: '/tickets', icon: Inbox },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Orders', path: '/orders', icon: ShoppingBag },
  { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[230px] h-screen bg-white border-r border-slate-200/90 flex flex-col fixed left-0 top-0 z-30 select-none">
      {/* Brand / Logo */}
      <div className="h-14 px-4 flex items-center border-b border-slate-100">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight text-[15px]">
            ResolveIQ
          </span>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
            AI Core
          </span>
        </NavLink>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Workspace
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 p-2 rounded-md bg-slate-50/70 border border-slate-100">
          <Avatar initials="AS" size="sm" bgColor="#e2e8f0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 truncate">Aman Sharma</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Admin
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
