import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Order, Ticket } from '../types';
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
  ExternalLink,
  Loader2
} from 'lucide-react';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id || 'ORD-1041';

  const [order, setOrder] = useState<Order | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        setLoading(true);
        const [ordRes, allTix] = await Promise.all([
          api.getOrderById(orderId),
          api.getTickets(),
        ]);
        setOrder(ordRes.order);
        setTickets(allTix.filter((t) => t.orderId === ordRes.order.id));
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrderData();
  }, [orderId]);

  if (loading || !order) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Loading order #{orderId} from database...</span>
      </div>
    );
  }

  const relatedTicket = tickets[0];

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
            Placed on {order.date} • Customer:{' '}
            <Link
              to={`/customers/${order.customerId}`}
              className="text-slate-800 font-medium hover:text-blue-600 underline"
            >
              {order.customerName}
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {relatedTicket ? (
            <Link to={`/tickets/${relatedTicket.id}`}>
              <Button variant="primary" size="sm" icon={<Inbox className="w-4 h-4" />}>
                View Ticket ({relatedTicket.id})
              </Button>
            </Link>
          ) : (
            <Link to={`/portal/tickets/new?orderId=${order.id}`}>
              <Button variant="secondary" size="sm" icon={<Inbox className="w-4 h-4" />}>
                Open Ticket for Order
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          title="Customer Details"
          icon={<User className="w-4 h-4 text-blue-600" />}
          items={[
            { label: 'Name', value: order.customerName },
            { label: 'Email', value: order.customerEmail },
            { label: 'Account ID', value: order.customerId },
          ]}
        />

        <InfoCard
          title="Delivery & Fulfillment"
          icon={<Truck className="w-4 h-4 text-emerald-600" />}
          items={[
            { label: 'Carrier', value: order.tracking.carrier },
            { label: 'Tracking #', value: order.tracking.number },
            { label: 'Status', value: order.tracking.status },
          ]}
        />

        <InfoCard
          title="Payment Settlement"
          icon={<CreditCard className="w-4 h-4 text-purple-600" />}
          items={[
            { label: 'Method', value: order.payment.method },
            { label: 'Transaction ID', value: order.payment.transactionId },
            { label: 'Amount Paid', value: `₹${order.amount.toLocaleString()}` },
          ]}
        />
      </div>

      {/* Items in order */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Purchased Items</h2>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover border border-slate-100"
                />
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{item.name}</h4>
                  <span className="text-[11px] text-slate-500">{item.variant}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-900 block font-mono">
                  ₹{item.price.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400">Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
