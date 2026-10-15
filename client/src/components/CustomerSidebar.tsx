import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  HelpCircle,
  X,
  Settings,
  LogOut,
  ChevronUp,
  User,
  ShieldCheck
} from 'lucide-react';
import { Avatar } from './Avatar';
import { useCustomer } from '../context/CustomerContext';
import { BrandLogo } from './BrandLogo';

interface CustomerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const customerNavItems = [
  { name: 'Overview', path: '/portal', icon: LayoutDashboard },
  { name: 'My Support Tickets', path: '/portal/tickets', icon: MessageSquare },
  { name: 'My Orders', path: '/portal/orders', icon: Package },
  { name: 'Help Center', path: '/portal/help', icon: HelpCircle },
];

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ isOpen, onClose }) => {
  const { currentCustomer } = useCustomer();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-[240px] h-screen bg-white border-r border-zinc-200 flex flex-col fixed left-0 top-0 z-50 select-none transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Brand / Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-100">
          <NavLink to="/portal" onClick={onClose} className="flex items-center gap-2">
            <BrandLogo size="sm" showText={true} />
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200">
              Portal
            </span>
          </NavLink>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Nav List */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Customer Portal
          </div>
          {customerNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/portal'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-700'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-2">
            <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3 text-xs">
              <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
                AI Support Portal
              </div>
              <p className="text-zinc-500 text-[11px] mt-1 leading-relaxed">
                24/7 instant resolutions powered by ResolveIQ autonomous assistant.
              </p>
            </div>
          </div>
        </nav>

        {/* Switch to Admin Dashboard link for preview ease */}
        <div className="px-3 pb-2">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium text-zinc-900 hover:text-white bg-zinc-100 hover:bg-zinc-900 rounded border border-zinc-200 transition-colors"
          >
            Switch to Agent Dashboard →
          </Link>
        </div>

        {/* Customer Profile & Account Menu */}
        <div className="p-3 border-t border-slate-100 relative">
          {accountMenuOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Account Menu
              </div>
              <button
                type="button"
                onClick={() => setAccountMenuOpen(false)}
                className="w-full px-3 py-1.5 flex items-center gap-2 text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                Profile Details
              </button>
              <button
                type="button"
                onClick={() => setAccountMenuOpen(false)}
                className="w-full px-3 py-1.5 flex items-center gap-2 text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Account Settings
              </button>
              <div className="my-1 border-t border-slate-100" />
              <Link
                to="/login"
                onClick={() => {
                  setAccountMenuOpen(false);
                  onClose();
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Link>
            </div>
          )}

          <div
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center gap-2.5 p-2 rounded-md bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 cursor-pointer transition-colors"
          >
            <Avatar initials={currentCustomer.avatarInitials} size="sm" bgColor={currentCustomer.avatarBgColor} />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {currentCustomer.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {currentCustomer.email}
              </div>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 text-slate-400 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </aside>
    </>
  );
};
