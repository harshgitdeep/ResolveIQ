import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Users,
  ShoppingBag,
  BookOpen,
  Settings,
  Bot,
  X
} from 'lucide-react';
import { Avatar } from '../components/Avatar';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Tickets', path: '/tickets', icon: Inbox },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Orders', path: '/orders', icon: ShoppingBag },
  { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar element */}
      <aside
        className={`w-[240px] h-screen bg-white border-r border-slate-200/90 flex flex-col fixed left-0 top-0 z-50 select-none transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100">
          <NavLink to="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-900 tracking-tight text-[15px]">
              ResolveIQ
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
              AI Core
            </span>
          </NavLink>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
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
                onClick={onClose}
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
    </>
  );
};
