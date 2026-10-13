import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  Paperclip,
  Send,
  Bot,
  Package,
  ExternalLink,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const CustomerTicketConversationPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const id = ticketId || 'TKT-1041';

  const { customerTickets, customerOrders, messages, sendMessage, currentCustomer } = useCustomer();

  const ticket = customerTickets.find((t) => t.id === id) || customerTickets[0];
  const ticketMessages = ticket ? messages[ticket.id] || [] : [];
  const relatedOrder = ticket ? customerOrders.find((o) => o.id === ticket.orderId) : null;

  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    url: string;
    size: string;
  } | null>(null);

  const handleSimulateFileSelect = () => {
    // Simulate attaching a replacement photo/evidence
    setSelectedFile({
      name: 'headphone_serial_box.jpg',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      size: '1.8 MB'
    });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() && !selectedFile) return;

    sendMessage(
      ticket.id,
      messageInput.trim() || 'Uploaded requested verification photo.',
      selectedFile || undefined
    );

    setMessageInput('');
    setSelectedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!ticket) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-base font-semibold text-slate-900">Ticket not found</h2>
        <Link to="/portal/tickets" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
          Return to My Support Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-200">
        <Link
          to="/portal/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Support Tickets
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-base font-bold text-blue-600">{ticket.id}</span>
              <StatusBadge status={ticket.status} />
              {ticket.orderId && (
                <Link
                  to={`/portal/orders/${ticket.orderId}`}
                  className="text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                >
                  Order #{ticket.orderId}
                </Link>
              )}
              <span className="text-xs text-slate-400">Created {ticket.createdAt}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{ticket.subject}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              AI Autopilot Active
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Conversation Thread + Composer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs flex flex-col min-h-[560px]">
            {/* Conversation Messages */}
            <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto max-h-[640px]">
              {/* System Security Notice */}
              <div className="text-center my-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  Conversation protected by ResolveIQ Autonomous Support
                </span>
              </div>

              {ticketMessages.map((msg) => {
                const isCustomer = msg.senderType === 'customer';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
                      {!isCustomer && (
                        <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
                          <Bot className="w-3 h-3 text-blue-600" />
                          ResolveIQ AI Support
                        </span>
                      )}
                      {isCustomer && (
                        <span className="font-medium text-slate-700">
                          You ({currentCustomer.name})
                        </span>
                      )}
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`rounded-2xl p-4 max-w-xl text-sm leading-relaxed shadow-2xs ${
                        isCustomer
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-slate-50 text-slate-900 border border-slate-200/80 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Message Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          {msg.attachments.map((att, idx) => (
                            <div
                              key={idx}
                              className={`rounded-lg p-2.5 flex items-center gap-3 border ${
                                isCustomer
                                  ? 'bg-blue-700/60 border-blue-500/50 text-white'
                                  : 'bg-white border-slate-200 text-slate-900'
                              }`}
                            >
                              <img
                                src={att.url}
                                alt={att.name}
                                className="w-14 h-14 object-cover rounded bg-slate-100 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold truncate">
                                  {att.name}
                                </div>
                                <div
                                  className={`text-[11px] ${
                                    isCustomer ? 'text-blue-100' : 'text-slate-400'
                                  }`}
                                >
                                  {att.size || 'Photo evidence attached'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-lg">
              {/* Attachment Preview Chip */}
              {selectedFile && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.name}
                      className="w-8 h-8 rounded object-cover border border-blue-300"
                    />
                    <div>
                      <span className="font-semibold block truncate">{selectedFile.name}</span>
                      <span className="text-[10px] text-blue-600">{selectedFile.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1 hover:bg-blue-100 rounded text-blue-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="bg-white rounded-lg border border-slate-200 p-2.5 focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600 shadow-2xs">
                <textarea
                  rows={3}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message to ResolveIQ Support (Press Enter to send, Shift+Enter for new line)..."
                  className="w-full text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSimulateFileSelect}
                      title="Attach photo proof"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      Attach Evidence
                    </button>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      Simulate photo upload
                    </span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={<Send className="w-3.5 h-3.5" />}
                    disabled={!messageInput.trim() && !selectedFile}
                  >
                    Send Reply
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Order Context Panel */}
        <div className="lg:col-span-4 space-y-4">
          {relatedOrder ? (
            <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Related Order
                    </h3>
                    <div className="font-mono text-sm font-bold text-slate-900">
                      #{relatedOrder.id}
                    </div>
                  </div>
                </div>
                <StatusBadge status={relatedOrder.fulfillmentStatus} size="sm" />
              </div>

              {/* Primary Item Preview */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-700">Products in this Order</div>
                {relatedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover border border-slate-200 bg-white"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.variant} • Qty {item.quantity}
                      </div>
                      <div className="text-xs font-medium text-slate-900 mt-0.5">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Metadata */}
              <dl className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <dt className="text-slate-500">Order Date</dt>
                  <dd className="font-medium text-slate-800">{relatedOrder.date}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <dt className="text-slate-500">Order Total</dt>
                  <dd className="font-semibold text-slate-900">${relatedOrder.amount.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <dt className="text-slate-500">Tracking Number</dt>
                  <dd className="font-mono text-slate-700">{relatedOrder.tracking.number}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-slate-500">Courier Carrier</dt>
                  <dd className="font-medium text-slate-800">{relatedOrder.tracking.carrier}</dd>
                </div>
              </dl>

              <div className="pt-2">
                <Link
                  to={`/portal/orders/${relatedOrder.id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 transition-colors"
                >
                  View Complete Order Details <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs text-xs text-slate-500 text-center">
              No specific order linked to this ticket.
            </div>
          )}

          {/* Customer next step guidance */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3.5 space-y-1.5">
            <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              What happens next?
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              ResolveIQ AI has verified your damaged item proof. Reply in the conversation thread whether you prefer a free replacement or a 100% refund to conclude this claim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
