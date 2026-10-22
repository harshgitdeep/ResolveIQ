import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Ticket, Message, Order, Customer, AgentTraceRun } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { InfoCard } from '../components/InfoCard';
import {
  ArrowLeft,
  Send,
  ExternalLink,
  Bot,
  Sparkles,
  ShoppingBag,
  User,
  Activity,
  Loader2
} from 'lucide-react';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = id || 'TKT-1041';

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [agentTrace, setAgentTrace] = useState<AgentTraceRun | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'Conversation' | 'Order Details' | 'Customer Info' | 'Agent Trace'>('Conversation');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const res = await api.getTicketById(ticketId);
      setTicket(res.ticket);
      setMessages(res.messages);

      // Fetch related order if available
      if (res.ticket.orderId) {
        try {
          const ordRes = await api.getOrderById(res.ticket.orderId);
          setOrder(ordRes.order);
        } catch (e) {
          console.warn('Order could not be loaded:', e);
        }
      }

      // Fetch customer details if available
      if (res.ticket.customerId) {
        try {
          const custRes = await api.getCustomerById(res.ticket.customerId);
          setCustomer(custRes.customer);
        } catch (e) {
          console.warn('Customer could not be loaded:', e);
        }
      }

      // Fetch agent trace for this ticket
      try {
        const trace = await api.getAgentTraceForTicket(ticketId);
        setAgentTrace(trace);
      } catch (e) {
        console.warn('Trace could not be loaded:', e);
      }
    } catch (err) {
      console.error('Failed to load ticket details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || sending) return;

    try {
      setSending(true);
      const newMsg = await api.sendMessage(ticketId, replyText.trim(), 'agent');
      setMessages((prev) => [...prev, newMsg]);
      setReplyText('');
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Loading ticket #{ticketId} from database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Workspace Header */}
      <div className="pb-4 border-b border-slate-200">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to tickets
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-base font-bold text-blue-600">{ticket.id}</span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <span className="text-xs text-slate-400">Created {ticket.createdAt}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{ticket.subject}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/tickets/${ticket.id}/agent-trace`}>
              <Button variant="secondary" size="sm" icon={<Activity className="w-4 h-4 text-purple-600" />}>
                Agent Run Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-xs font-medium">
          {(['Conversation', 'Order Details', 'Customer Info', 'Agent Trace'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      {activeTab === 'Conversation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Messages Thread (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-5">
              <div className="space-y-4 divide-y divide-slate-100">
                {messages.map((msg) => {
                  const isAgent = msg.senderType === 'agent';
                  const isSystem = msg.senderType === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="pt-3 text-center">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px]">
                          {msg.content} • {msg.timestamp}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className="pt-4 first:pt-0">
                      <div className="flex items-start gap-3">
                        <Avatar
                          initials={msg.senderInitials || 'IQ'}
                          size="md"
                          bgColor={isAgent ? 'bg-purple-600' : 'bg-blue-600'}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900">
                              {msg.senderName} {isAgent && <span className="text-purple-600 font-normal">(AI / Agent)</span>}
                            </span>
                            <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                          </div>
                          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {messages.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No messages yet on this database ticket.
                  </div>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="mt-6 pt-4 border-t border-slate-200">
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Type an official reply or note..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 p-3 pr-24 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                  <div className="absolute bottom-2.5 right-2.5">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!replyText.trim() || sending}
                      icon={sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    >
                      {sending ? 'Sending...' : 'Reply'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Customer Snapshot
              </h3>
              <div className="flex items-center gap-3">
                <Avatar initials={ticket.customerInitials} size="lg" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{ticket.customerName}</h4>
                  <p className="text-xs text-slate-500">{ticket.customerEmail}</p>
                </div>
              </div>
            </div>

            {order && (
              <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Associated Order
                  </h3>
                  <Link to={`/orders/${order.id}`} className="text-xs text-blue-600 hover:underline">
                    View
                  </Link>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order:</span>
                    <span className="font-mono font-medium text-slate-800">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total:</span>
                    <span className="font-semibold text-slate-900">₹{order.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fulfillment:</span>
                    <StatusBadge status={order.fulfillmentStatus} size="sm" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Order Details' && (
        <div className="bg-white rounded-lg border border-slate-200/90 p-6">
          {order ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Order {order.id}</h3>
                  <p className="text-xs text-slate-500">Placed on {order.date}</p>
                </div>
                <StatusBadge status={order.fulfillmentStatus} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Total Amount</span>
                  <span className="font-semibold text-slate-800 text-sm">₹{order.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tracking Number</span>
                  <span className="font-mono text-slate-800">{order.tracking.number}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Payment Status</span>
                  <StatusBadge status={order.paymentStatus} size="sm" />
                </div>
                <div>
                  <span className="text-slate-400 block">Carrier</span>
                  <span className="font-medium text-slate-800">{order.tracking.carrier}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No order linked directly to this database ticket.</p>
          )}
        </div>
      )}

      {activeTab === 'Customer Info' && (
        <div className="bg-white rounded-lg border border-slate-200/90 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar initials={ticket.customerInitials} size="xl" />
            <div>
              <h3 className="text-base font-bold text-slate-900">{ticket.customerName}</h3>
              <p className="text-xs text-slate-500">{ticket.customerEmail}</p>
              {customer?.phone && <p className="text-xs text-slate-500 mt-1">Phone: {customer.phone}</p>}
            </div>
          </div>
          {customer && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block">Total Orders</span>
                <span className="text-lg font-bold text-slate-900">{customer.totalOrders}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block">Total Spent</span>
                <span className="text-lg font-bold text-slate-900">₹{customer.totalSpent.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block">Open Tickets</span>
                <span className="text-lg font-bold text-slate-900">{customer.openTickets}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Agent Trace' && (
        <div className="bg-white rounded-lg border border-slate-200/90 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Agent Reasoning Steps (Database Trace)</h3>
              <p className="text-xs text-slate-500">Recorded tool calls and decisions executed for this ticket</p>
            </div>
            <Link to={`/tickets/${ticket.id}/agent-trace`}>
              <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                Full Trace View
              </Button>
            </Link>
          </div>

          {agentTrace && agentTrace.steps.length > 0 ? (
            <div className="space-y-3">
              {agentTrace.steps.map((st, i) => (
                <div key={st.id} className="p-3 bg-slate-50 rounded-md border border-slate-200/70 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-blue-700">
                      Step #{i + 1}: {st.eventType} {st.toolName ? `(${st.toolName})` : ''}
                    </span>
                    <span className="text-[11px] text-slate-400">{st.timestamp}</span>
                  </div>
                  <p className="text-slate-700">{st.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              No autonomous agent traces recorded in the database for ticket #{ticket.id} yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
