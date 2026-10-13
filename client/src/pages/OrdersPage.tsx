import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterTabs } from '../components/FilterTabs';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { mockOrders } from '../data/orders';
import { Download, ArrowUpDown, ArrowRight } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filterTabs = ['All', 'Delivered', 'Shipped', 'Processing', 'Cancelled'];

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.tracking.number.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      activeTab === 'All' ? true : order.fulfillmentStatus === activeTab;

    return matchesSearch && matchesStatus;
  });

  const counts = {
    All: mockOrders.length,
    Delivered: mockOrders.filter((o) => o.fulfillmentStatus === 'Delivered').length,
    Shipped: mockOrders.filter((o) => o.fulfillmentStatus === 'Shipped').length,
    Processing: mockOrders.filter((o) => o.fulfillmentStatus === 'Processing').length,
    Cancelled: mockOrders.filter((o) => o.fulfillmentStatus === 'Cancelled').length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        subtitle="Track incoming store purchases, payment records, and courier delivery status."
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

      {/* Orders Data Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-blue-600 whitespace-nowrap">
                    <Link to={`/orders/${order.id}`} className="hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Link
                      to={`/customers/${order.customerId}`}
                      className="font-medium text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {order.customerName}
                    </Link>
                    <div className="text-xs text-slate-400">{order.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-900 whitespace-nowrap">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={order.fulfillmentStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-xs text-blue-600 font-medium hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                    No orders found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredOrders.length} of {mockOrders.length} orders</span>
          <span className="font-medium text-slate-600">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};
