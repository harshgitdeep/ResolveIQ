import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu, Bot } from 'lucide-react';
import { Avatar } from '../components/Avatar';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden h-14 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-900 tracking-tight text-sm">
              ResolveIQ
            </span>
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
            AI Core
          </span>
          <Avatar initials="AS" size="sm" bgColor="#e2e8f0" />
        </div>
      </header>

      {/* Desktop / Responsive Drawer Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[240px] min-w-0 min-h-[calc(100vh-3.5rem)] lg:min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
