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
  Sparkles
} from 'lucide-react';

export const CustomerTicketListPage: React.FC = () => {
  const { customerTickets, messages } = useCustomer();
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
        ? ticket.status === 'In Progress' || ticket.status === 'Waiting' || ticket.status === 'Waiting for Customer'
        : ticket.status === 'Resolved';

    return matchesSearch && matchesStatus;
  });

  const counts = {
    All: customerTickets.length,
    Open: customerTickets.filter((t) => t.status === 'Open').length,
    'In Progress': customerTickets.filter(
      (t) => t.status === 'In Progress' || t.status === 'Waiting' || t.status === 'Waiting for Customer'
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
            placeholder="Search by ticket ID or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredTickets.map((ticket) => {
            const ticketMessages = messages[ticket.id] || [];
            const lastMessage = ticketMessages[ticketMessages.length - 1];

            return (
              <div
                key={ticket.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {ticket.id}
                    </span>
                    <StatusBadge status={ticket.status} size="sm" />
                    {ticket.orderId && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Order #{ticket.orderId}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      Created {ticket.createdAt}
                    </span>
                  </div>

                  <Link
                    to={`/portal/tickets/${ticket.id}`}
                    className="block text-sm sm:text-base font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {ticket.subject}
                  </Link>

                  {/* Last message preview */}
                  {lastMessage && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700 shrink-0">
                        {lastMessage.senderType === 'agent' ? (
                          <span className="inline-flex items-center gap-1 text-blue-700">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            ResolveIQ AI:
                          </span>
                        ) : (
                          'You:'
                        )}
                      </span>
                      <span className="truncate max-w-lg">
                        {lastMessage.content}
                      </span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5">
                    <Clock className="w-3 h-3" />
                    Last activity {ticket.lastUpdated}
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  <Link to={`/portal/tickets/${ticket.id}`}>
                    <Button variant="secondary" size="sm">
                      Open Conversation <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}

          {filteredTickets.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No support tickets found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {search
                  ? `No tickets match "${search}". Try clearing your search filters.`
                  : "You don't have any support requests under this filter category."}
              </p>
              <div className="pt-2">
                <Link to="/portal/tickets/new">
                  <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                    Create Support Request
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
