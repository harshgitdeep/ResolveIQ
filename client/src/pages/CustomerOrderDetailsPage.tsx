import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
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
  MessageSquare
} from 'lucide-react';

export const CustomerOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const id = orderId || 'ORD-1041';

  const { customerOrders, customerTickets, currentCustomer } = useCustomer();
  const order = customerOrders.find((o) => o.id === id) || customerOrders[0];

  if (!order) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-base font-semibold text-slate-900">Order not found</h2>
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
    { label: 'Warehouse Dispatched', completed: true, date: 'Oct 09, 2026' },
    { label: 'In Transit with Courier', completed: true, date: 'Oct 10, 2026' },
    {
      label: order.fulfillmentStatus === 'Delivered' ? 'Delivered' : 'Out for Delivery',
      completed: order.fulfillmentStatus === 'Delivered',
      date: order.tracking.deliveredDate || order.tracking.estimatedDelivery || 'Estimated'
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order #{order.id}</h1>
              <StatusBadge status={order.fulfillmentStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {order.date} • Total: <span className="font-semibold text-slate-900">${order.amount.toFixed(2)}</span>
            </p>
          </div>

          <div>
            <Link to={`/portal/tickets/new?orderId=${order.id}`}>
              <Button variant="primary" icon={<HelpCircle className="w-4 h-4" />}>
                Create Support Request
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Delivery Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Shipment Delivery Progress
        </h3>

        <div className="relative flex flex-col sm:flex-row justify-between gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 flex items-start gap-3 sm:flex-col sm:items-center text-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  step.completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <div className="sm:mt-2 text-left sm:text-center">
                <div className={`text-xs font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{step.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (8 cols): Order Items & Pricing */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Items in this Order ({order.items.length})
            </h3>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                      <div className="text-xs text-slate-400 mt-1">Item ID: {item.id}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-slate-900">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Quantity: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="border-t border-slate-200 pt-4 mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${order.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Standard Express Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Sales Tax</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount Paid</span>
                <span>${order.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Related Support Tickets Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Related Support Tickets for this Order
                </h3>
              </div>
              <Link
                to={`/portal/tickets/new?orderId=${order.id}`}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                + New Request
              </Link>
            </div>

            <div className="pt-3 divide-y divide-slate-100">
              {relatedTickets.map((t) => (
                <div key={t.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <Link
                      to={`/portal/tickets/${t.id}`}
                      className="text-xs font-semibold text-slate-900 hover:text-blue-600"
                    >
                      {t.id}: {t.subject}
                    </Link>
                    <div className="text-[11px] text-slate-400">Created {t.createdAt}</div>
                  </div>
                  <StatusBadge status={t.status} size="sm" />
                </div>
              ))}

              {relatedTickets.length === 0 && (
                <div className="text-xs text-slate-500 py-3 text-center">
                  No support tickets created for this order yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right (4 cols): Tracking & Delivery Address */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tracking Details */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 pb-2 border-b border-slate-100">
              <Truck className="w-4 h-4 text-blue-600" />
              Tracking Information
            </div>

            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-400 block">Courier</span>
                <span className="font-semibold text-slate-800">{order.tracking.carrier}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tracking Number</span>
                <span className="font-mono font-medium text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 block mt-0.5 select-all">
                  {order.tracking.number}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Status</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {order.tracking.status}
                </span>
              </div>
              {order.tracking.deliveredDate && (
                <div>
                  <span className="text-slate-400 block">Delivered On</span>
                  <span className="font-medium text-slate-800">{order.tracking.deliveredDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address (Fictional, privacy safe, no credit cards) */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-blue-600" />
              Delivery Destination
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="block text-slate-900 font-semibold">{currentCustomer.name}</strong>
              {currentCustomer.address ? (
                <>
                  <div>{currentCustomer.address.street}</div>
                  <div>
                    {currentCustomer.address.city}, {currentCustomer.address.state} {currentCustomer.address.zip}
                  </div>
                  <div>{currentCustomer.address.country}</div>
                </>
              ) : (
                <div>742 Evergreen Terrace, Portland, OR 97201, United States</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
