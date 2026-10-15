import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { mockFAQs } from '../data/faqs';
import {
  Plus,
  MessageSquare,
  Package,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const CustomerOverviewPage: React.FC = () => {
  const { currentCustomer, customerTickets, customerOrders } = useCustomer();

  const openTicketsCount = customerTickets.filter(
    (t) => t.status === 'Open' || t.status === 'In Progress' || t.status === 'Waiting'
  ).length;

  const resolvedTicketsCount = customerTickets.filter((t) => t.status === 'Resolved').length;

  const recentTickets = customerTickets.slice(0, 3);
  const recentOrders = customerOrders.slice(0, 2);
  const commonFAQs = mockFAQs.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header Greeting Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-2">
            <Sparkles className="w-3 h-3" />
            ResolveIQ Support Assistance
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Hi, {currentCustomer.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            How can we help you today? Track your active inquiries or start a new request.
          </p>
        </div>

        <div>
          <Link to="/portal/tickets/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Create Support Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Open Tickets"
          value={openTicketsCount}
          icon={<MessageSquare className="w-4 h-4 text-amber-600" />}
          comparison={{ text: 'Actively in review', trend: 'neutral' }}
        />
        <MetricCard
          label="Resolved Tickets"
          value={resolvedTicketsCount}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          comparison={{ text: '100% resolution rate', trend: 'up' }}
        />
        <MetricCard
          label="Recent Orders"
          value={customerOrders.length}
          icon={<Package className="w-4 h-4 text-blue-600" />}
          comparison={{ text: 'Active purchases', trend: 'neutral' }}
        />
      </div>

      {/* Two-Column: Recent Tickets & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Recent Support Tickets */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Your Support Tickets</h2>
              <p className="text-xs text-slate-500 mt-0.5">Track real-time status and agent conversations</p>
            </div>
            <Link
              to="/portal/tickets"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              View all ({customerTickets.length})
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/portal/tickets/${ticket.id}`}
                className="p-4 block hover:bg-slate-50/80 transition-colors group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {ticket.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {ticket.orderId ? `Order #${ticket.orderId}` : 'General Inquiry'}
                    </span>
                  </div>
                  <StatusBadge status={ticket.status} size="sm" />
                </div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mt-2">
                  {ticket.subject}
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Updated {ticket.lastUpdated}
                  </span>
                  <span className="text-blue-600 font-medium group-hover:underline inline-flex items-center gap-0.5">
                    Open thread <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}

            {recentTickets.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                You have no active support tickets.
              </div>
            )}
          </div>
        </div>

        {/* Right (5 cols): Recent Orders */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
              <p className="text-xs text-slate-500 mt-0.5">Delivered and in-transit items</p>
            </div>
            <Link
              to="/portal/orders"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              All orders ({customerOrders.length})
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => {
              const primaryItem = order.items[0];
              return (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      #{order.id}
                    </span>
                    <StatusBadge status={order.fulfillmentStatus} size="sm" />
                  </div>

                  <div className="flex items-center gap-3">
                    {primaryItem && (
                      <img
                        src={primaryItem.image}
                        alt={primaryItem.name}
                        className="w-12 h-12 rounded object-cover border border-slate-200 bg-slate-50"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {primaryItem?.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {order.date} • ${order.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      to={`/portal/orders/${order.id}`}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                    >
                      View Order
                    </Link>
                    <Link
                      to={`/portal/tickets/new?orderId=${order.id}`}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Get Help →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Help Center Section */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Help Center & Common Questions</h2>
              <p className="text-xs text-slate-500">Quick answers regarding shipping, replacements, and returns</p>
            </div>
          </div>
          <Link
            to="/portal/help"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            Browse all topics <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {commonFAQs.map((faq) => (
            <Link
              key={faq.id}
              to="/portal/help"
              className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition-colors block"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1">
                {faq.category}
              </div>
              <h3 className="text-xs font-semibold text-slate-900 line-clamp-2">
                {faq.question}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {faq.answer}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
