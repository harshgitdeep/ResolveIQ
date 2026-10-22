import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { api } from '../services/api';
import { Order, Ticket } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Loader2
} from 'lucide-react';

export const CustomerOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const id = orderId || 'ORD-1041';

  const { customerTickets } = useCustomer();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await api.getOrderById(id);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Fetching order details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <h2 className="text-base font-semibold text-slate-900">Order not found in database</h2>
        <Link to="/portal/orders" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
          Return to My Orders
        </Link>
      </div>
    );
  }

  // Find related tickets for this order
  const relatedTickets = customerTickets.filter((t) => t.orderId === order.id);

  // Delivery progress steps
  const steps = [
    { label: 'Order Confirmed', completed: true, date: order.date },
    { label: 'Warehouse Dispatched', completed: true, date: 'Recent' },
    { label: 'In Transit with Courier', completed: order.fulfillmentStatus === 'Shipped' || order.fulfillmentStatus === 'Delivered', date: 'In Transit' },
    {
      label: order.fulfillmentStatus === 'Delivered' ? 'Delivered' : 'Estimated Delivery',
      completed: order.fulfillmentStatus === 'Delivered',
      date: order.tracking.deliveredDate || order.tracking.estimatedDelivery || 'In Progress'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div>
        <Link
          to="/portal/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
        </Link>

        {/* Order Header Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                {order.id}
              </span>
              <StatusBadge status={order.fulfillmentStatus} size="sm" />
              <StatusBadge status={order.paymentStatus} size="sm" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Order Details
            </h1>
            <p className="text-xs text-slate-500">
              Placed on {order.date} • Courier Tracking:{' '}
              <span className="font-mono font-medium text-slate-800">{order.tracking.number}</span>
            </p>
          </div>

          <div>
            <Link to={`/portal/tickets/new?orderId=${order.id}`}>
              <Button variant="primary" icon={<MessageSquare className="w-4 h-4" />}>
                Get Help with Order
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Delivery Tracking Visualizer */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">Shipment Status</h2>
          </div>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Carrier: {order.tracking.carrier}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          {steps.map((st, idx) => (
            <div key={idx} className="relative flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    st.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {st.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="text-xs font-semibold text-slate-900">{st.label}</span>
              </div>
              <span className="text-[11px] text-slate-400">{st.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Purchased Items List */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Purchased Items</h2>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-100"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-bold text-slate-900 block">
                  ₹{item.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tickets */}
      {relatedTickets.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Active Support Inquiries for this Order</h2>
          <div className="divide-y divide-slate-100">
            {relatedTickets.map((t) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-blue-600 font-semibold">{t.id}</span>
                  <span className="font-medium text-slate-800">{t.subject}</span>
                </div>
                <Link to={`/portal/tickets/${t.id}`} className="text-blue-600 hover:underline">
                  View Conversation →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
