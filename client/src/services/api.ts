import { Customer, Ticket, Order, Message, AgentTraceRun, AgentTraceStep } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Formatting helpers to ensure database records map smoothly to existing frontend interfaces
export const formatInitials = (name?: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const normalizeTicketStatus = (status?: string): 'Open' | 'In Progress' | 'Resolved' | 'Waiting' => {
  if (!status) return 'Open';
  const s = status.toLowerCase().replace(/_/g, ' ');
  if (s === 'open') return 'Open';
  if (s === 'resolved' || s === 'closed') return 'Resolved';
  if (s === 'in progress' || s === 'escalated') return 'In Progress';
  if (s.includes('wait')) return 'Waiting';
  return 'Open';
};

export const normalizePriority = (priority?: string): 'Low' | 'Medium' | 'High' => {
  if (!priority) return 'Medium';
  const p = priority.toLowerCase();
  if (p === 'high' || p === 'urgent') return 'High';
  if (p === 'low') return 'Low';
  return 'Medium';
};

export const normalizeFulfillmentStatus = (status?: string): 'Delivered' | 'Shipped' | 'Cancelled' | 'Processing' => {
  if (!status) return 'Processing';
  const s = status.toLowerCase();
  if (s === 'delivered') return 'Delivered';
  if (s === 'shipped') return 'Shipped';
  if (s === 'cancelled') return 'Cancelled';
  return 'Processing';
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'Recent';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
  } catch {
    return 'Recent';
  }
};

export const mapDbTicket = (raw: any): Ticket => {
  const ticketId = raw.ticket_number || raw.id;
  const custName = raw.customer_name || 'Customer';
  return {
    id: ticketId,
    customerId: raw.customer_id,
    customerName: custName,
    customerEmail: raw.customer_email || '',
    customerInitials: formatInitials(custName),
    subject: raw.subject || 'Support Ticket',
    orderId: raw.order_number || raw.order_id || undefined,
    status: normalizeTicketStatus(raw.status),
    priority: normalizePriority(raw.priority),
    lastUpdated: formatRelativeTime(raw.updated_at || raw.created_at),
    createdAt: formatDate(raw.created_at),
    assignedAgent: raw.assigned_to ? 'Support Agent' : 'ResolveIQ AI Support',
  };
};

export const mapDbCustomer = (raw: any): Customer => {
  return {
    id: raw.id,
    name: raw.name || 'Customer',
    email: raw.email || '',
    phone: raw.phone || undefined,
    avatarInitials: formatInitials(raw.name),
    avatarBgColor: 'bg-blue-600',
    totalOrders: Number(raw.total_orders || 0),
    totalSpent: Number(raw.total_spent || 0),
    openTickets: Number(raw.open_tickets || 0),
    joinedDate: formatDate(raw.created_at),
    address: {
      street: '124 Market Street, Suite 400',
      city: 'Bengaluru',
      state: 'KA',
      zip: '560001',
      country: 'India'
    }
  };
};

export const mapDbOrder = (raw: any): Order => {
  const fulfillment = normalizeFulfillmentStatus(raw.status);
  const total = Number(raw.total_amount || 0);
  const orderNum = raw.order_number || raw.id;

  return {
    id: orderNum,
    customerId: raw.customer_id,
    customerName: raw.customer_name || 'Customer',
    customerEmail: raw.customer_email || '',
    date: formatDate(raw.created_at),
    amount: total,
    paymentStatus: raw.refund_status === 'refunded' ? 'Refunded' : 'Paid',
    fulfillmentStatus: fulfillment,
    items: [
      {
        id: `item-${orderNum}`,
        name: raw.order_number === 'ORD-1041' 
          ? 'Wireless Noise-Cancelling Headphones Pro'
          : raw.order_number === 'ORD-1042'
          ? 'Mechanical Keyboard RGB Edition'
          : raw.order_number === 'ORD-1043'
          ? 'Smart Fitness Watch Series 4'
          : 'High-Precision Ergonomic Mouse',
        variant: 'Standard / Matte Black',
        quantity: 1,
        price: total,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: raw.tracking_number || (fulfillment === 'Processing' ? 'Pending Allocation' : `TRK-${orderNum}`),
      carrier: 'BlueDart Express',
      status: fulfillment === 'Delivered' ? 'Delivered' : fulfillment === 'Shipped' ? 'In Transit' : 'Order Placed',
      estimatedDelivery: raw.estimated_delivery_at ? formatDate(raw.estimated_delivery_at) : undefined,
      deliveredDate: fulfillment === 'Delivered' ? formatDate(raw.updated_at || raw.created_at) : undefined
    },
    payment: {
      method: 'Razorpay UPI / Cards',
      last4: '4242',
      transactionId: `TXN-${orderNum}`,
      paidAt: formatDate(raw.created_at)
    }
  };
};

export const mapDbMessage = (raw: any): Message => {
  const sType = raw.sender_type === 'human' || raw.sender_type === 'support' ? 'agent' : raw.sender_type;
  return {
    id: raw.id,
    ticketId: raw.ticket_id,
    senderType: (sType as 'customer' | 'agent' | 'system') || 'system',
    senderName: raw.sender_name || (sType === 'customer' ? 'Customer' : 'ResolveIQ AI Support'),
    senderInitials: formatInitials(raw.sender_name || (sType === 'customer' ? 'Customer' : 'AI')),
    timestamp: formatRelativeTime(raw.created_at),
    content: raw.content || '',
    attachments: []
  };
};

export const mapDbAgentTraceRun = (ticketNumber: string, dbSteps: any[]): AgentTraceRun => {
  const steps: AgentTraceStep[] = dbSteps.map((st) => ({
    id: st.id,
    ticketId: ticketNumber,
    eventType: (st.event_type as any) || 'tool_call',
    toolName: st.tool_name,
    timestamp: formatRelativeTime(st.created_at),
    summary: st.reason_summary || 'Agent event execution',
    payload: st.output_json || st.input_json || null,
  }));

  const toolCallsCount = steps.filter((s) => s.eventType === 'tool_call').length;

  return {
    ticketId: ticketNumber,
    totalSteps: steps.length,
    toolCalls: toolCallsCount,
    finalOutcome: steps.some((s) => s.eventType === 'escalation') ? 'Human Escalation' : 'Resolution in Progress',
    duration: `${steps.length * 420}ms`,
    model: 'Gemini 1.5 Pro',
    steps,
  };
};

// API Services
export const api = {
  async getTickets(customerId?: string): Promise<Ticket[]> {
    const url = customerId ? `${API_BASE}/tickets?customerId=${customerId}` : `${API_BASE}/tickets`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch tickets');
    return json.data.map(mapDbTicket);
  },

  async getTicketById(ticketId: string): Promise<{ ticket: Ticket; raw: any; messages: Message[] }> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch ticket');
    const ticket = mapDbTicket(json.data);
    const messages = (json.data.messages || []).map(mapDbMessage);
    return { ticket, raw: json.data, messages };
  },

  async createTicket(data: {
    subject: string;
    description: string;
    orderId?: string;
    priority?: string;
    customerId?: string;
  }): Promise<Ticket> {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create ticket');
    return mapDbTicket(json.data);
  },

  async sendMessage(ticketId: string, content: string, senderType = 'customer'): Promise<Message> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, senderType }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to send message');
    return mapDbMessage(json.data);
  },

  async getCustomers(): Promise<Customer[]> {
    const res = await fetch(`${API_BASE}/customers`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch customers');
    return json.data.map(mapDbCustomer);
  },

  async getCustomerById(customerId: string): Promise<{ customer: Customer; raw: any }> {
    const res = await fetch(`${API_BASE}/customers/${customerId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch customer');
    return { customer: mapDbCustomer(json.data), raw: json.data };
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch orders');
    return json.data.map(mapDbOrder);
  },

  async getOrderById(orderId: string): Promise<{ order: Order; raw: any }> {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch order');
    return { order: mapDbOrder(json.data), raw: json.data };
  },

  async getAgentTraces(ticketId?: string): Promise<any[]> {
    const url = ticketId ? `${API_BASE}/traces?ticketId=${ticketId}` : `${API_BASE}/traces`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch agent traces');
    return json.data;
  },

  async getAgentTraceForTicket(ticketId: string): Promise<AgentTraceRun> {
    const res = await fetch(`${API_BASE}/traces/${ticketId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch ticket trace');
    return mapDbAgentTraceRun(ticketId, json.data);
  }
};
