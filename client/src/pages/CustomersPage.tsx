import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { Customer } from '../types';
import { UserPlus, ArrowRight, Loader2 } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await api.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
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
          Total customers: <span className="font-semibold text-slate-800">{customers.length}</span>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Fetching real customers from Neon DB...</span>
          </div>
        ) : (
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
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <Link to={`/customers/${customer.id}`} className="flex items-center gap-2.5">
                        <Avatar
                          initials={customer.avatarInitials}
                          size="sm"
                          bgColor={customer.avatarBgColor}
                        />
                        <div>
                          <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors block text-xs">
                            {customer.name}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 block truncate max-w-[140px]">
                            {customer.id}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {customer.email}
                    </td>
                    <td className="py-3 px-4 text-center text-xs font-medium text-slate-800">
                      {customer.totalOrders}
                    </td>
                    <td className="py-3 px-4 text-right text-xs font-mono font-semibold text-slate-900">
                      ₹{customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          customer.openTickets > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {customer.openTickets}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {customer.joinedDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="inline-flex items-center text-xs font-medium text-slate-500 group-hover:text-blue-600 transition-colors"
                      >
                        View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      No customers found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="py-3 px-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500">
          Showing <strong className="font-semibold text-slate-700">{filteredCustomers.length}</strong> of{' '}
          <strong className="font-semibold text-slate-700">{customers.length}</strong> real customer accounts
        </div>
      </div>
    </div>
  );
};
