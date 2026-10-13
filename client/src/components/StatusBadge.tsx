import React from 'react';
import { TicketStatus, PaymentStatus, FulfillmentStatus } from '../types';

interface StatusBadgeProps {
  status: TicketStatus | PaymentStatus | FulfillmentStatus | 'Active' | 'Draft' | 'Archived' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs font-medium';

  // Ticket Statuses: Open: light blue, In Progress: light amber, Resolved: light green, Waiting: light purple
  switch (status) {
    case 'Open':
      return (
        <span className={`inline-flex items-center rounded-md bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
          Open
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-700/10 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          In Progress
        </span>
      );
    case 'Resolved':
    case 'Delivered':
    case 'Paid':
    case 'Active':
      return (
        <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-700/10 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
          {status}
        </span>
      );
    case 'Waiting':
    case 'Waiting for Customer':
      return (
        <span className={`inline-flex items-center rounded-md bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5"></span>
          {status}
        </span>
      );

    case 'Refunded':
    case 'Cancelled':
      return (
        <span className={`inline-flex items-center rounded-md bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-700/10 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
          {status}
        </span>
      );
    case 'Pending':
    case 'Processing':
    case 'Draft':
      return (
        <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-700/10 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          {status}
        </span>
      );
    case 'Shipped':
      return (
        <span className={`inline-flex items-center rounded-md bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-700/10 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5"></span>
          Shipped
        </span>
      );
    case 'Archived':
      return (
        <span className={`inline-flex items-center rounded-md bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-600/10 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
          Archived
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-md bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-700/10 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
