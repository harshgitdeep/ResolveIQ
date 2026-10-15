import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterTabs } from '../components/FilterTabs';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Button } from '../components/Button';
import { mockTickets } from '../data/tickets';
import { Plus, ArrowUpDown } from 'lucide-react';

export const TicketsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filterTabs = ['All', 'Open', 'In Progress', 'Resolved', 'Waiting'];

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      (ticket.orderId && ticket.orderId.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      activeTab === 'All' ? true : ticket.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const counts = {
    All: mockTickets.length,
    Open: mockTickets.filter((t) => t.status === 'Open').length,
    'In Progress': mockTickets.filter((t) => t.status === 'In Progress').length,
    Resolved: mockTickets.filter((t) => t.status === 'Resolved').length,
    Waiting: mockTickets.filter((t) => t.status === 'Waiting').length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tickets"
        subtitle="Manage, review, and collaborate on customer inquiries."
        actions={
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            New Ticket
          </Button>
        }
      />

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="sm:max-w-md w-full">
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />
        </div>
        <div className="sm:w-72 w-full">
          <SearchInput
            placeholder="Search tickets, customers, orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Full-width Data Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">
                  <span className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-700">
                    Last Updated <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-zinc-50 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-zinc-900 whitespace-nowrap">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="hover:underline flex items-center gap-1.5"
                    >
                      {ticket.id}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Link
                      to={`/customers/${ticket.customerId}`}
                      className="font-medium text-zinc-900 hover:underline transition-colors"
                    >
                      {ticket.customerName}
                    </Link>
                    <div className="text-xs text-zinc-400">{ticket.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-zinc-800 font-medium hover:text-black hover:underline transition-colors line-clamp-1"
                    >
                      {ticket.subject}
                    </Link>
                    <div className="text-xs text-zinc-400">{ticket.assignedAgent}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-zinc-600 whitespace-nowrap">
                    {ticket.orderId ? (
                      <Link
                        to={`/orders/${ticket.orderId}`}
                        className="text-zinc-600 hover:text-black hover:underline"
                      >
                        {ticket.orderId}
                      </Link>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-slate-500 whitespace-nowrap">
                    {ticket.lastUpdated}
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                    No tickets found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredTickets.length} of {mockTickets.length} tickets</span>
          <span className="font-medium text-slate-600">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};
