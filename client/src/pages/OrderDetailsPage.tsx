import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockOrders } from '../data/orders';
import { mockTickets } from '../data/tickets';
import { StatusBadge } from '../components/StatusBadge';
import { InfoCard } from '../components/InfoCard';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  Inbox,
  Package,
  Truck,
  CreditCard,
  User,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id || 'ORD-1041';

  const order = mockOrders.find((o) => o.id === orderId) || mockOrders[0];
  const relatedTicket = mockTickets.find((t) => t.orderId === order.id);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to orders
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order #{order.id}</h1>
            <StatusBadge status={order.fulfillmentStatus} />
            <StatusBadge status={order.paymentStatus} />
          </div>
          <p className="text-xs text-slate-500">
            Placed on {order.date} • Customer: <span className="text-slate-800 font-medium">{order.customerName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {relatedTicket ? (
            <Link to={`/tickets/${relatedTicket.id}`}>
              <Button variant="primary" size="sm" icon={<Inbox className="w-4 h-4" />}>
                View in Ticket ({relatedTicket.id})
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="sm" icon={<Inbox className="w-4 h-4" />}>
              Create Ticket for Order
            </Button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Order Items */}
        <div className="lg:col-span-8 space-y-6">
          <InfoCard title="Order Items">
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-md border border-slate-200 bg-slate-50"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                      <div className="text-xs text-slate-400 mt-1">Item ID: {item.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 mt-2 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${order.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping (Standard)</span>
                <span>$0.00 (Free)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Taxes</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span>${order.amount.toFixed(2)}</span>
              </div>
            </div>
          </InfoCard>

          {/* Tracking Information Card */}
          <InfoCard title="Tracking Information">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Carrier & Waybill</div>
                    <div className="text-sm font-medium text-slate-900 font-mono">
                      {order.tracking.carrier} • {order.tracking.number}
                    </div>
                  </div>
                </div>
                <StatusBadge status={order.fulfillmentStatus} size="sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Current Delivery Status</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {order.tracking.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Delivered Timestamp</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {order.tracking.deliveredDate || order.tracking.estimatedDelivery || 'In Transit'}
                  </span>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Right Column (4 cols): Customer & Payment */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <InfoCard title="Customer Details">
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Name</span>
                <Link
                  to={`/customers/${order.customerId}`}
                  className="text-sm font-semibold text-blue-600 hover:underline block mt-0.5"
                >
                  {order.customerName}
                </Link>
              </div>
              <div>
                <span className="text-slate-400 block">Email Address</span>
                <span className="font-medium text-slate-800 block mt-0.5">{order.customerEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone</span>
                <span className="font-medium text-slate-800 block mt-0.5">+1 (555) 234-8901</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to={`/customers/${order.customerId}`}
                  className="text-xs text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                >
                  View customer profile <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </InfoCard>

          {/* Payment Information Card */}
          <InfoCard title="Payment Information">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Payment Method</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  {order.payment.method} {order.payment.last4 ? `•••• ${order.payment.last4}` : ''}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400">Payment Status</span>
                <StatusBadge status={order.paymentStatus} size="sm" />
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400">Total Charged</span>
                <span className="font-semibold text-slate-900">${order.amount.toFixed(2)}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block">Transaction ID</span>
                <span className="font-mono text-[11px] text-slate-600 select-all block mt-0.5">
                  {order.payment.transactionId}
                </span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block">Processed At</span>
                <span className="text-slate-700 block mt-0.5">{order.payment.paidAt}</span>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};
