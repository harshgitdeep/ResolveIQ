import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { Menu, Plus } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { useCustomer } from '../context/CustomerContext';
import { BrandLogo } from '../components/BrandLogo';

export const CustomerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentCustomer } = useCustomer();

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-zinc-900 flex flex-col lg:flex-row">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden h-14 bg-white border-b border-zinc-200 px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md cursor-pointer"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <NavLink to="/portal" className="flex items-center gap-2">
            <BrandLogo size="xs" showText={true} />
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/portal/tickets/new"
            className="p-1.5 rounded-md bg-zinc-900 text-white hover:bg-black shadow-2xs"
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
