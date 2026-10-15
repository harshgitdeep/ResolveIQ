import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { mockTickets } from '../data/tickets';
import { Inbox, Clock, CheckCircle2, Zap, ArrowRight, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const recentTickets = mockTickets.slice(0, 4);

  // 7-day realistic volume data (Mon - Sun)
  const ticketVolumeData = [
    { day: 'Mon', count: 18, aiHandled: 15 },
    { day: 'Tue', count: 24, aiHandled: 20 },
    { day: 'Wed', count: 22, aiHandled: 19 },
    { day: 'Thu', count: 31, aiHandled: 26 },
    { day: 'Fri', count: 28, aiHandled: 23 },
    { day: 'Sat', count: 14, aiHandled: 12 },
    { day: 'Sun', count: 10, aiHandled: 9 },
  ];

  const maxVolume = Math.max(...ticketVolumeData.map(d => d.count));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Aman"
        subtitle="Here's what's happening with your support today."
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Open Tickets"
          value={12}
          icon={<Inbox className="w-4 h-4 text-blue-600" />}
          comparison={{ text: '-4 from yesterday', trend: 'down' }}
        />
        <MetricCard
          label="In Progress"
          value={8}
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          comparison={{ text: '+2 new claims', trend: 'neutral' }}
        />
        <MetricCard
          label="Resolved"
          value={56}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          comparison={{ text: '+18% vs last week', trend: 'up' }}
        />
        <MetricCard
          label="Avg. Response Time"
          value="2.4h"
          icon={<Zap className="w-4 h-4 text-purple-600" />}
          comparison={{ text: '-35m faster with AI', trend: 'up' }}
        />
      </div>

      {/* Two-column Layout: Ticket Volume Bar Chart + Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Ticket Volume (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Weekly Ticket Volume</h2>
              <p className="text-xs text-slate-500 mt-0.5">Total incoming tickets vs AI resolved breakdown</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900"></span>
                Total
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-300"></span>
                AI Handled
              </span>
            </div>
          </div>

          {/* Minimalist Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-zinc-100">
            {ticketVolumeData.map((item) => {
              const heightPercent = Math.round((item.count / maxVolume) * 100);
              const aiHeightPercent = Math.round((item.aiHandled / maxVolume) * 100);

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-950 transition-colors">
                    {item.count}
                  </div>
                  <div className="w-full max-w-[36px] bg-zinc-100 rounded-t-sm flex flex-col justify-end overflow-hidden" style={{ height: `${heightPercent}%` }}>
                    <div
                      className="w-full bg-zinc-900 group-hover:bg-black transition-all rounded-t-sm"
                      style={{ height: `${(item.aiHandled / item.count) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 mt-1">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> 147 tickets handled this week
            </span>
            <span>Peak on Thursday (31 tickets)</span>
          </div>
        </div>

        {/* Right Section: Recent Tickets (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-zinc-200/80 p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Recent Tickets</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Latest customer inquiries</p>
            </div>
            <Link
              to="/tickets"
              className="text-xs font-medium text-zinc-900 hover:text-black hover:underline flex items-center gap-1 group"
            >
              View all
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 flex-1">
            {recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="py-3 block hover:bg-zinc-50 -mx-2 px-2 rounded-md transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-medium text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">
                      {ticket.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {ticket.customerName}
                    </span>
                  </div>
                  <StatusBadge status={ticket.status} size="sm" />
                </div>
                <div className="text-xs text-slate-600 truncate mt-1.5">
                  {ticket.subject}
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span>{ticket.lastUpdated}</span>
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
