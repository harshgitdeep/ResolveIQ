import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterTabs } from '../components/FilterTabs';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { Order } from '../types';
import { Download, ArrowRight, Loader2 } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filterTabs = ['All', 'Delivered', 'Shipped', 'Processing'];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.tracking.number.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      activeTab === 'All' ? true : order.fulfillmentStatus === activeTab;

    return matchesSearch && matchesStatus;
  });

  const counts = {
    All: orders.length,
    Delivered: orders.filter((o) => o.fulfillmentStatus === 'Delivered').length,
    Shipped: orders.filter((o) => o.fulfillmentStatus === 'Shipped').length,
    Processing: orders.filter((o) => o.fulfillmentStatus === 'Processing').length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        subtitle="Track store purchases, payment records, and courier delivery status directly from database."
        actions={
          <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
            Export CSV
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="sm:max-w-md w-full">
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />
        </div>
        <div className="sm:w-72 w-full">
          <SearchInput
            placeholder="Search orders, customers, tracking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Fetching real orders from Neon DB...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Tracking Waybill</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Link
                        to={`/orders/${order.id}`}
                        className="font-mono text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 block text-xs">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[130px]">
                        {order.customerEmail}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono font-semibold text-slate-900 whitespace-nowrap">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={order.fulfillmentStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={order.paymentStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-slate-600">
                        {order.tracking.number}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center text-xs font-medium text-slate-500 group-hover:text-blue-600 transition-colors"
                      >
                        View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      No orders found in database matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="py-3 px-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500">
          Showing <strong className="font-semibold text-slate-700">{filteredOrders.length}</strong> of{' '}
          <strong className="font-semibold text-slate-700">{orders.length}</strong> real database orders
        </div>
      </div>
    </div>
  );
};
