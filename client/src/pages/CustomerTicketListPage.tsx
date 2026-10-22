import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterTabs } from '../components/FilterTabs';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import {
  Plus,
  MessageSquare,
  Clock,
  ArrowRight,
  Inbox,
  Sparkles,
  Loader2
} from 'lucide-react';

export const CustomerTicketListPage: React.FC = () => {
  const { customerTickets, loading } = useCustomer();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Open', 'In Progress', 'Resolved'];

  const filteredTickets = customerTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      (ticket.orderId && ticket.orderId.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      activeTab === 'All'
        ? true
        : activeTab === 'Open'
        ? ticket.status === 'Open'
        : activeTab === 'In Progress'
        ? ticket.status === 'In Progress' || ticket.status === 'Waiting'
        : ticket.status === 'Resolved';

    return matchesSearch && matchesStatus;
  });

  const counts = {
    All: customerTickets.length,
    Open: customerTickets.filter((t) => t.status === 'Open').length,
    'In Progress': customerTickets.filter(
      (t) => t.status === 'In Progress' || t.status === 'Waiting'
    ).length,
    Resolved: customerTickets.filter((t) => t.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Support Tickets"
        subtitle="View and manage your conversations with our 24/7 AI resolution team."
        actions={
          <Link to="/portal/tickets/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Create Support Request
            </Button>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="sm:max-w-md w-full">
          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />
        </div>

        <div className="sm:w-72 w-full">
          <SearchInput
            placeholder="Search tickets by topic or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tickets List Card Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Retrieving your tickets...</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50/60 px-2 py-0.5 rounded border border-blue-100">
                      {ticket.id}
                    </span>
                    <StatusBadge status={ticket.status} size="sm" />
                    {ticket.orderId && (
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Order #{ticket.orderId}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/portal/tickets/${ticket.id}`}
                    className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors block truncate"
                  >
                    {ticket.subject}
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Created {ticket.createdAt}
                    </span>
                    <span>•</span>
                    <span>Updated {ticket.lastUpdated}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link to={`/portal/tickets/${ticket.id}`}>
                    <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Conversation
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">No support requests found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {search
                    ? 'No tickets match your search filters.'
                    : 'Need help with a delivery, return, or order inquiry? Our 24/7 AI is ready to help.'}
                </p>
                <div className="pt-2">
                  <Link to="/portal/tickets/new">
                    <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                      New Support Ticket
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
