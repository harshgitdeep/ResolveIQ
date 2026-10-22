import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Customer, Order, Ticket } from '../types';
import { Avatar } from '../components/Avatar';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Inbox,
  ArrowRight,
  Loader2
} from 'lucide-react';

export const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const customerId = id || '';

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [customerTickets, setCustomerTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true);
        const [res, allOrds, allTix] = await Promise.all([
          api.getCustomerById(customerId),
          api.getOrders(),
          api.getTickets(),
        ]);
        setCustomer(res.customer);
        setCustomerOrders(allOrds.filter((o) => o.customerId === res.customer.id || o.customerEmail === res.customer.email));
        setCustomerTickets(allTix.filter((t) => t.customerId === res.customer.id || t.customerEmail === res.customer.email));
      } catch (err) {
        console.error('Failed to load customer:', err);
      } finally {
        setLoading(false);
      }
    };
    if (customerId) {
      loadCustomerData();
    }
  }, [customerId]);

  if (loading || !customer) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Loading customer #{customerId} from database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div>
        <Link
          to="/customers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to customers
        </Link>
      </div>

      {/* Customer Header Profile Card */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            initials={customer.avatarInitials}
            size="xl"
            bgColor={customer.avatarBgColor}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{customer.name}</h1>
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-xs">
                {customer.id}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {customer.email}
              </span>
              {customer.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {customer.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Joined {customer.joinedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Orders"
          value={customer.totalOrders}
          icon={<ShoppingBag className="w-4 h-4 text-blue-600" />}
          comparison={{ text: 'Completed orders', trend: 'neutral' }}
        />
        <MetricCard
          label="Total Spent"
          value={`₹${customer.totalSpent.toLocaleString()}`}
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          comparison={{ text: 'Lifetime value', trend: 'up' }}
        />
        <MetricCard
          label="Active Tickets"
          value={customer.openTickets}
          icon={<Inbox className="w-4 h-4 text-amber-600" />}
          comparison={{ text: 'Needing resolution', trend: customer.openTickets > 0 ? 'down' : 'up' }}
        />
      </div>

      {/* Orders and Tickets Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer's Order History */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Order History ({customerOrders.length})</h2>
              <Link to="/orders" className="text-xs text-blue-600 hover:underline">
                View all orders
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {customerOrders.map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-mono font-medium text-blue-600 hover:underline block"
                    >
                      {order.id}
                    </Link>
                    <span className="text-[11px] text-slate-400">{order.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900 block font-mono">
                      ₹{order.amount.toLocaleString()}
                    </span>
                    <StatusBadge status={order.fulfillmentStatus} size="sm" />
                  </div>
                </div>
              ))}
              {customerOrders.length === 0 && (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No orders found in database for this customer.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Customer's Support Tickets */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Support Tickets ({customerTickets.length})</h2>
              <Link to="/tickets" className="text-xs text-blue-600 hover:underline">
                View all tickets
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {customerTickets.map((ticket) => (
                <div key={ticket.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 pr-2">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="font-medium text-slate-900 hover:text-blue-600 truncate block"
                    >
                      {ticket.subject}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[11px] text-blue-600">{ticket.id}</span>
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={ticket.status} size="sm" />
                    <span className="text-[11px] text-slate-400 block mt-1">{ticket.lastUpdated}</span>
                  </div>
                </div>
              ))}
              {customerTickets.length === 0 && (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No tickets on record for this customer.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
