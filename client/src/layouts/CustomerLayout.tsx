import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { Menu, Bot, Plus } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { useCustomer } from '../context/CustomerContext';

export const CustomerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentCustomer } = useCustomer();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden h-14 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <NavLink to="/portal" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-900 tracking-tight text-sm">
              ResolveIQ Support
            </span>
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/portal/tickets/new"
            className="p-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs"
            title="Create support request"
          >
            <Plus className="w-4 h-4" />
          </Link>
          <Avatar initials={currentCustomer.avatarInitials} size="sm" bgColor={currentCustomer.avatarBgColor} />
        </div>
      </header>

      {/* Responsive Customer Sidebar */}
      <CustomerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Customer Portal Content Area */}
      <main className="flex-1 lg:ml-[240px] min-w-0 min-h-[calc(100vh-3.5rem)] lg:min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
