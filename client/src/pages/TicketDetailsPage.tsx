import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockTickets } from '../data/tickets';
import { mockMessages } from '../data/messages';
import { mockOrders } from '../data/orders';
import { mockCustomers } from '../data/customers';
import { mockAgentTraces } from '../data/agentTraces';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { InfoCard } from '../components/InfoCard';
import {
  ArrowLeft,
  Paperclip,
  Send,
  CheckCircle,
  UserCheck,
  FileEdit,
  ExternalLink,
  Bot,
  Sparkles,
  ShoppingBag,
  User,
  Activity,
  Code
} from 'lucide-react';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = id || 'TKT-1041';

  const ticket = mockTickets.find((t) => t.id === ticketId) || mockTickets[0];
  const messages = mockMessages[ticket.id] || mockMessages['TKT-1041'];
  const order = mockOrders.find((o) => o.id === ticket.orderId);
  const customer = mockCustomers.find((c) => c.id === ticket.customerId);
  const agentTrace = mockAgentTraces[ticket.id] || mockAgentTraces['TKT-1041'];

  const [activeTab, setActiveTab] = useState<'Conversation' | 'Order Details' | 'Customer Info' | 'Agent Trace'>('Conversation');
  const [replyText, setReplyText] = useState('');

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
            <Link
              to={`/tickets/${ticket.id}/agent-trace`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" /> View Full Agent Trace
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-0.5">
        {[
          { name: 'Conversation', icon: Bot },
          { name: 'Order Details', icon: ShoppingBag },
          { name: 'Customer Info', icon: User },
          { name: 'Agent Trace', icon: Activity },
        ].map((tab) => {
          const isActive = activeTab === tab.name;
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name as any)}
              className={`flex items-center gap-1.5 pb-2.5 text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Main Two-column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Primary Tab Content */}
        <div className="lg:col-span-8 space-y-4">
          {activeTab === 'Conversation' && (
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs flex flex-col min-h-[580px]">
              {/* Message Thread */}
              <div className="p-5 space-y-5 flex-1 overflow-y-auto">
                {messages.map((msg) => {
                  const isAgent = msg.senderType === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 items-start ${
                        isAgent ? 'pl-2' : ''
                      }`}
                    >
                      <Avatar
                        initials={msg.senderInitials || (isAgent ? 'IQ' : 'CU')}
                        size="md"
                        bgColor={isAgent ? '#dbeafe' : undefined}
                      />
                      <div className="flex-1 space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900">
                            {msg.senderName}
                          </span>
                          {isAgent && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                              <Sparkles className="w-2.5 h-2.5" /> AI Autopilot
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                        </div>
                        <div
                          className={`p-3.5 rounded-lg text-sm leading-relaxed border ${
                            isAgent
                              ? 'bg-blue-50/50 border-blue-100/80 text-slate-800'
                              : 'bg-slate-50/80 border-slate-200/80 text-slate-800'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.content}</p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200/60">
                              {msg.attachments.map((att, idx) => (
                                <div
                                  key={idx}
                                  className="border border-slate-200 rounded-md p-2 bg-white flex items-center gap-3 max-w-sm"
                                >
                                  <img
                                    src={att.url}
                                    alt={att.name}
                                    className="w-14 h-14 object-cover rounded bg-slate-100 border border-slate-100"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium text-slate-900 truncate">
                                      {att.name}
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                      {att.size || 'Attached photo'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Composer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-lg">
                <div className="bg-white rounded-md border border-slate-200 p-2 focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all shadow-2xs">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a response or type '/' for macro responses..."
                    className="w-full text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500">
                      <button
                        type="button"
                        title="Attach file"
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-slate-400 ml-2">Visual prototype only</span>
                    </div>
                    <Button variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                      Send Response
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Order Details' && (
            <InfoCard title={`Associated Order: ${ticket.orderId || 'None'}`}>
              {order ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500">Order Placed</div>
                      <div className="text-sm font-medium text-slate-900">{order.date}</div>
                    </div>
                    <StatusBadge status={order.fulfillmentStatus} />
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Items Ordered
                    </div>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded object-cover border border-slate-200"
                          />
                          <div>
                            <div className="text-sm font-medium text-slate-900">{item.name}</div>
                            <div className="text-xs text-slate-500">{item.variant} (Qty: {item.quantity})</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-slate-900">${item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 flex justify-between text-sm font-semibold text-slate-900">
                    <span>Total Paid</span>
                    <span>${order.amount.toFixed(2)}</span>
                  </div>
                  <div className="pt-2">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      View full order details <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No order linked to this ticket.</div>
              )}
            </InfoCard>
          )}

          {activeTab === 'Customer Info' && (
            <InfoCard title="Customer Profile">
              {customer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <Avatar initials={customer.avatarInitials} size="lg" bgColor={customer.avatarBgColor} />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{customer.name}</div>
                      <div className="text-xs text-slate-500">{customer.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Customer Since</span>
                      <span className="font-medium text-slate-800">{customer.joinedDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Phone</span>
                      <span className="font-medium text-slate-800">{customer.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Lifetime Orders</span>
                      <span className="font-medium text-slate-800">{customer.totalOrders}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Lifetime Spent</span>
                      <span className="font-medium text-slate-800">${customer.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      View complete customer profile <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500">Customer details not available.</div>
              )}
            </InfoCard>
          )}

          {activeTab === 'Agent Trace' && (
            <InfoCard
              title="Execution Trace Summary"
              action={
                <Link
                  to={`/tickets/${ticket.id}/agent-trace`}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  Full Trace View <ExternalLink className="w-3 h-3" />
                </Link>
              }
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-3 rounded-md bg-slate-50 border border-slate-100">
                  <div>
                    <div className="text-[11px] text-slate-500">Steps</div>
                    <div className="text-base font-semibold text-slate-900">{agentTrace.totalSteps}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Tool Calls</div>
                    <div className="text-base font-semibold text-slate-900">{agentTrace.toolCalls}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Duration</div>
                    <div className="text-base font-semibold text-slate-900">{agentTrace.duration}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Model</div>
                    <div className="text-xs font-mono font-medium text-slate-800 truncate">Gemini 1.5 Pro</div>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {agentTrace.steps.map((st) => (
                    <div key={st.id} className="py-2.5 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{st.summary}</div>
                        <div className="text-slate-400 font-mono text-[10px]">{st.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </InfoCard>
          )}
        </div>

        {/* Right Column (4 cols): Ticket Details & Actions Card */}
        <div className="lg:col-span-4 space-y-4">
          {/* Ticket Details Card */}
          <InfoCard title="Ticket Details">
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <dt className="text-slate-500">Status</dt>
                <dd><StatusBadge status={ticket.status} size="sm" /></dd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <dt className="text-slate-500">Priority</dt>
                <dd><PriorityBadge priority={ticket.priority} /></dd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <dt className="text-slate-500">Order Reference</dt>
                <dd>
                  {ticket.orderId ? (
                    <Link
                      to={`/orders/${ticket.orderId}`}
                      className="font-mono text-blue-600 hover:underline font-semibold"
                    >
                      {ticket.orderId}
                    </Link>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <dt className="text-slate-500">Customer Name</dt>
                <dd>
                  <Link
                    to={`/customers/${ticket.customerId}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {ticket.customerName}
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <dt className="text-slate-500">Created Date</dt>
                <dd className="text-slate-700">{ticket.createdAt}</dd>
              </div>
              <div className="flex justify-between items-center py-1">
                <dt className="text-slate-500">Last Updated</dt>
                <dd className="text-slate-700">{ticket.lastUpdated}</dd>
              </div>
            </dl>
          </InfoCard>

          {/* Actions Card */}
          <InfoCard title="Actions">
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full justify-center"
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Resolve Ticket
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-center"
                icon={<UserCheck className="w-4 h-4" />}
              >
                Escalate to Human
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center"
                icon={<FileEdit className="w-4 h-4" />}
              >
                Add Note
              </Button>
            </div>
            <div className="text-[11px] text-slate-400 text-center mt-3">
              Prototype mode: actions are visually reactive only.
            </div>
          </InfoCard>

          {/* Quick AI Agent Summary */}
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Agent Insight
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Customer has submitted photo evidence of shipping damage. Policy allows instant $149 replacement or refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
