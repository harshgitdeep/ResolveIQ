import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCustomers } from '../data/customers';
import { mockOrders } from '../data/orders';
import { mockTickets } from '../data/tickets';
import { Avatar } from '../components/Avatar';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Inbox,
  ArrowRight
} from 'lucide-react';

export const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const customerId = id || 'CUST-001';

  const customer = mockCustomers.find((c) => c.id === customerId) || mockCustomers[0];
  const customerOrders = mockOrders.filter((o) => o.customerId === customer.id);
  const customerTickets = mockTickets.filter((t) => t.customerId === customer.id);

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
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
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
                Customer since {customer.joinedDate}
              </span>
              {customer.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {customer.address.city}, {customer.address.country}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            Edit Customer
          </Button>
          <Button variant="primary" size="sm">
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Orders"
          value={customer.totalOrders}
          icon={<ShoppingBag className="w-4 h-4 text-blue-600" />}
        />
        <MetricCard
          label="Total Spent"
          value={`$${customer.totalSpent.toFixed(2)}`}
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
        />
        <MetricCard
          label="Open Tickets"
          value={customer.openTickets}
          icon={<Inbox className="w-4 h-4 text-amber-600" />}
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">Order fulfillment history for {customer.name}</p>
          </div>
          <Link
            to="/orders"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All orders <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Order ID</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Items</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4">Payment</th>
                <th className="py-2.5 px-4">Fulfillment</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {customerOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-600">
                    <Link to={`/orders/${order.id}`} className="hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">{order.date}</td>
                  <td className="py-3 px-4 text-xs text-slate-700">
                    {order.items.map((i) => i.name).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-right text-xs font-medium text-slate-900">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={order.paymentStatus} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={order.fulfillmentStatus} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
              {customerOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-xs text-slate-500">
                    No orders on record for this customer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Support Tickets Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent Support Tickets</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tickets created by or assigned to this customer</p>
          </div>
          <Link
            to="/tickets"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All tickets <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Ticket ID</th>
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Related Order</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4 text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {customerTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-600">
                    <Link to={`/tickets/${ticket.id}`} className="hover:underline">
                      {ticket.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-slate-900">
                    <Link to={`/tickets/${ticket.id}`} className="hover:text-blue-600">
                      {ticket.subject}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">
                    {ticket.orderId ? (
                      <Link to={`/orders/${ticket.orderId}`} className="hover:underline text-blue-600">
                        {ticket.orderId}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={ticket.status} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="py-3 px-4 text-right text-xs text-slate-500">
                    {ticket.lastUpdated}
                  </td>
                </tr>
              ))}
              {customerTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-xs text-slate-500">
                    No tickets on record for this customer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
