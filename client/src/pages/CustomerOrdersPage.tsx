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
  ArrowRight,
  Loader2
} from 'lucide-react';

export const CustomerOrdersPage: React.FC = () => {
  const { customerOrders, loading } = useCustomer();
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
            placeholder="Search by order ID or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Fetching your orders from database...</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Package className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {order.id}
                      </span>
                      <StatusBadge status={order.fulfillmentStatus} size="sm" />
                      <span className="text-xs text-slate-400">Placed on {order.date}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {order.items[0]?.name || 'Purchased Products'}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="font-mono font-medium text-slate-800">
                        ₹{order.amount.toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>Tracking: {order.tracking.number}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/portal/tickets/new?orderId=${order.id}`}>
                    <Button variant="secondary" size="sm" icon={<MessageSquare className="w-3.5 h-3.5" />}>
                      Request Support
                    </Button>
                  </Link>
                  <Link to={`/portal/orders/${order.id}`}>
                    <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Order Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">No orders found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {search
                    ? 'No orders match your current search term.'
                    : 'You do not have any purchases recorded in the system yet.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
