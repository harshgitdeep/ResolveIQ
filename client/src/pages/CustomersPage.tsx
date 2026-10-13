import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { mockCustomers } from '../data/customers';
import { UserPlus, ArrowRight } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredCustomers = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        subtitle="Manage customer directories, lifetime spent, and active support issues."
        actions={
          <Button variant="primary" icon={<UserPlus className="w-4 h-4" />}>
            Add Customer
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">
          Total customers: <span className="font-semibold text-slate-800">{mockCustomers.length}</span>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Total Orders</th>
                <th className="py-3 px-4 text-right">Total Spent</th>
                <th className="py-3 px-4 text-center">Open Tickets</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="flex items-center gap-3 group-hover:text-blue-600 transition-colors"
                    >
                      <Avatar
                        initials={customer.avatarInitials}
                        size="md"
                        bgColor={customer.avatarBgColor}
                      />
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-blue-600">
                          {customer.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">{customer.id}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                    {customer.email}
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-slate-900 whitespace-nowrap">
                    {customer.totalOrders}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-900 whitespace-nowrap">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {customer.openTickets > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-700/20">
                        {customer.openTickets} open
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {customer.joinedDate}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="text-xs text-blue-600 font-medium hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      View profile <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                    No customers found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredCustomers.length} of {mockCustomers.length} customers</span>
          <span className="font-medium text-slate-600">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};
