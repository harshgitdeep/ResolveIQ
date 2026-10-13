import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterTabs } from '../components/FilterTabs';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import {
  Package,
  Truck,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Inbox,
  ArrowRight
} from 'lucide-react';

export const CustomerOrdersPage: React.FC = () => {
  const { customerOrders } = useCustomer();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Delivered', 'Shipped', 'Processing'];

  const filteredOrders = customerOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase())) ||
      order.tracking.number.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      activeTab === 'All' ? true : order.fulfillmentStatus === activeTab;

    return matchesSearch && matchesStatus;
  });

  const counts = {
    All: customerOrders.length,
    Delivered: customerOrders.filter((o) => o.fulfillmentStatus === 'Delivered').length,
    Shipped: customerOrders.filter((o) => o.fulfillmentStatus === 'Shipped').length,
    Processing: customerOrders.filter((o) => o.fulfillmentStatus === 'Processing').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        subtitle="Track delivery progress, review purchased items, and request support."
      />

      {/* Filter and Search */}
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
            placeholder="Search by order ID, item name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Order Cards List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 hover:border-slate-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-sm font-bold text-slate-900">
                  Order #{order.id}
                </span>
                <StatusBadge status={order.fulfillmentStatus} size="sm" />
                <span className="text-xs text-slate-500">Placed on {order.date}</span>
              </div>
              <div className="font-semibold text-slate-900 text-sm">
                Total: ${order.amount.toFixed(2)}
              </div>
            </div>

            {/* Items in this order */}
            <div className="py-4 divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.variant} • Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-medium text-slate-900">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking & Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Truck className="w-4 h-4 text-slate-400" />
                <span>
                  {order.tracking.carrier}: <strong className="font-mono font-medium text-slate-800">{order.tracking.number}</strong>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{order.tracking.status}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/portal/orders/${order.id}`}>
                  <Button variant="secondary" size="sm">
                    View Order
                  </Button>
                </Link>
                <Link to={`/portal/tickets/new?orderId=${order.id}`}>
                  <Button variant="outline" size="sm" icon={<HelpCircle className="w-3.5 h-3.5 text-blue-600" />}>
                    Get Help
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No orders found</h3>
            <p className="text-xs text-slate-500">
              No orders matched your selected search or status filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
