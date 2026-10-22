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
  ChevronRight,
  Loader2
} from 'lucide-react';

export const CustomerOverviewPage: React.FC = () => {
  const { currentCustomer, customerTickets, customerOrders, loading } = useCustomer();

  if (loading || !currentCustomer) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Connecting to customer portal...</span>
      </div>
    );
  }

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
          label="Open Inquiries"
          value={openTicketsCount}
          icon={<MessageSquare className="w-4 h-4 text-blue-600" />}
          comparison={{ text: 'Active with AI agent', trend: 'neutral' }}
        />
        <MetricCard
          label="My Orders"
          value={customerOrders.length}
          icon={<Package className="w-4 h-4 text-purple-600" />}
          comparison={{ text: 'Purchases recorded', trend: 'neutral' }}
        />
        <MetricCard
          label="Resolved Tickets"
          value={resolvedTicketsCount}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          comparison={{ text: 'Successfully closed', trend: 'up' }}
        />
      </div>

      {/* Two Column Layout: Active Inquiries & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Tickets (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Recent Support Requests</h2>
              <Link to="/portal/tickets" className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
                View all ({customerTickets.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/portal/tickets/${ticket.id}`}
                  className="py-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors block"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-blue-600">{ticket.id}</span>
                      <StatusBadge status={ticket.status} size="sm" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 truncate">{ticket.subject}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Updated {ticket.lastUpdated}</span>
                      {ticket.orderId && <span>Order: {ticket.orderId}</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                </Link>
              ))}

              {recentTickets.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-xs text-slate-500">You don’t have any active support tickets right now.</p>
                  <Link to="/portal/tickets/new" className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline">
                    Create your first ticket →
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/portal/tickets/new"
              className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Start New Support Request
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Orders (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Your Recent Orders</h2>
              <Link to="/portal/orders" className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
                All Orders ({customerOrders.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/portal/orders/${order.id}`}
                  className="py-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors block"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-900">{order.id}</span>
                      <StatusBadge status={order.fulfillmentStatus} size="sm" />
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {order.items[0]?.name || 'Purchased Item'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      ₹{order.amount.toLocaleString()} • {order.date}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                </Link>
              ))}

              {recentOrders.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No orders found in your account history.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/portal/orders"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              View Order Tracking & Delivery
            </Link>
          </div>
        </div>
      </div>

      {/* Helpful FAQs Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <Link to="/portal/help" className="text-xs font-medium text-blue-600 hover:underline">
            Visit Help Center →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {commonFAQs.map((faq) => (
            <div key={faq.id} className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-semibold uppercase text-blue-600 tracking-wider">
                {faq.category}
              </span>
              <h3 className="text-xs font-bold text-slate-900">{faq.question}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
