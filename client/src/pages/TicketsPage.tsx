import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterTabs } from '../components/FilterTabs';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { Ticket } from '../types';
import { Plus, ArrowUpDown, Loader2 } from 'lucide-react';

export const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await api.getTickets();
        setTickets(data);
      } catch (err) {
        console.error('Failed to load tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filterTabs = ['All', 'Open', 'In Progress', 'Resolved', 'Waiting'];

  const filteredTickets = tickets.filter((ticket) => {
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
    All: tickets.length,
    Open: tickets.filter((t) => t.status === 'Open').length,
    'In Progress': tickets.filter((t) => t.status === 'In Progress').length,
    Resolved: tickets.filter((t) => t.status === 'Resolved').length,
    Waiting: tickets.filter((t) => t.status === 'Waiting').length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tickets"
        subtitle="Manage, review, and collaborate on customer inquiries from database."
        actions={
          <Link to="/portal/tickets/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              New Ticket
            </Button>
          </Link>
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
            placeholder="Search tickets by ID, subject, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tickets Data Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Fetching real tickets from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="font-mono text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        {ticket.id}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                          {ticket.customerInitials}
                        </div>
                        <div className="truncate max-w-[130px]">
                          <span className="font-medium text-slate-900 block truncate text-xs">
                            {ticket.customerName}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {ticket.customerEmail}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-slate-800 font-medium hover:text-blue-600 line-clamp-1 text-xs"
                      >
                        {ticket.subject}
                      </Link>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {ticket.orderId ? (
                        <Link
                          to={`/orders/${ticket.orderId}`}
                          className="font-mono text-xs text-slate-600 hover:text-blue-600 hover:underline"
                        >
                          {ticket.orderId}
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={ticket.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {ticket.createdAt}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400 text-right whitespace-nowrap">
                      {ticket.lastUpdated}
                    </td>
                  </tr>
                ))}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      No tickets matching your filters found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="py-3 px-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="font-semibold text-slate-700">{filteredTickets.length}</strong> of{' '}
            <strong className="font-semibold text-slate-700">{tickets.length}</strong> real database tickets
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Database connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
