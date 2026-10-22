import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { api } from '../services/api';
import { Ticket, Message, Order } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  Paperclip,
  Send,
  Package,
  ExternalLink,
  ShieldCheck,
  Loader2
} from 'lucide-react';

export const CustomerTicketConversationPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const id = ticketId || 'TKT-1041';

  const { customerOrders } = useCustomer();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  const loadConversation = async () => {
    try {
      setLoading(true);
      const res = await api.getTicketById(id);
      setTicket(res.ticket);
      setMessages(res.messages);

      if (res.ticket.orderId) {
        const ord = customerOrders.find((o) => o.id === res.ticket.orderId);
        if (ord) {
          setOrder(ord);
        } else {
          api.getOrderById(res.ticket.orderId).then((r) => setOrder(r.order)).catch(() => null);
        }
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversation();
  }, [id]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || sending) return;

    try {
      setSending(true);
      const text = messageInput.trim();
      setMessageInput('');
      const saved = await api.sendMessage(id, text, 'customer');
      setMessages((prev) => [...prev, saved]);

      // Refetch after 1.5s in case AI assistant generated a response
      setTimeout(() => {
        api.getTicketById(id).then((r) => setMessages(r.messages)).catch(() => null);
      }, 1500);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading || !ticket) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Opening live ticket conversation...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Ticket Header */}
      <div>
        <Link
          to="/portal/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Tickets
        </Link>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {ticket.id}
              </span>
              <StatusBadge status={ticket.status} size="sm" />
              <span className="text-xs text-slate-400">Created {ticket.createdAt}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {ticket.subject}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI Auto-Resolution Protocol Active</span>
          </div>
        </div>
      </div>

      {/* Main Conversation & Order Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Thread */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200/90 shadow-2xs min-h-[500px]">
          {/* Messages list */}
          <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
            {messages.map((msg) => {
              const isCustomer = msg.senderType === 'customer';
              const isAgent = msg.senderType === 'agent';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {isCustomer ? 'You' : msg.senderName || 'ResolveIQ AI Support'}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      isCustomer
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            })}

            {messages.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                No conversation history yet on this ticket.
              </div>
            )}
          </div>

          {/* Reply composer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-slate-200/80 bg-slate-50/50 rounded-b-xl"
          >
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Write your reply to ResolveIQ Support..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-xs sm:text-sm bg-white rounded-lg border border-slate-200 p-3 pr-24 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none"
              />
              <div className="absolute bottom-2.5 right-2.5">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!messageInput.trim() || sending}
                  icon={sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                >
                  {sending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
              <span>Press Enter to send, Shift + Enter for new line</span>
              <span>ResolveIQ instant response enabled</span>
            </div>
          </form>
        </div>

        {/* Sidebar Order & Context Details */}
        <div className="lg:col-span-4 space-y-4">
          {order ? (
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Linked Order
                  </h3>
                </div>
                <Link
                  to={`/portal/orders/${order.id}`}
                  className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                >
                  Details <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono font-bold text-slate-900">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Date</span>
                  <span className="text-slate-800">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₹{order.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500">Delivery Status</span>
                  <StatusBadge status={order.fulfillmentStatus} size="sm" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs text-center text-xs text-slate-400">
              No specific order linked to this ticket.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
