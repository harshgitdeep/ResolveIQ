import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { BrandLogo } from '../components/BrandLogo';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-zinc-900 flex flex-col lg:flex-row">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden h-14 bg-white border-b border-zinc-200 px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <BrandLogo size="xs" showText={true} />
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200">
            Agent
          </span>
          <Avatar initials="AS" size="sm" bgColor="#e4e4e7" />
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
