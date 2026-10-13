export interface Customer {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarBgColor?: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  openTickets: number;
  joinedDate: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Waiting';
export type TicketPriority = 'Low' | 'Medium' | 'High';

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerInitials: string;
  subject: string;
  orderId?: string;
  status: TicketStatus;
  priority: TicketPriority;
  lastUpdated: string;
  createdAt: string;
  assignedAgent?: string;
}

export interface Message {
  id: string;
  ticketId: string;
  senderType: 'customer' | 'agent' | 'system';
  senderName: string;
  senderAvatar?: string;
  senderInitials?: string;
  timestamp: string;
  content: string;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: string;
  }[];
}

export type PaymentStatus = 'Paid' | 'Refunded' | 'Pending';
export type FulfillmentStatus = 'Delivered' | 'Shipped' | 'Cancelled' | 'Processing';

export interface OrderItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  amount: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  tracking: {
    number: string;
    carrier: string;
    status: string;
    estimatedDelivery?: string;
    deliveredDate?: string;
  };
  payment: {
    method: string;
    last4?: string;
    transactionId: string;
    paidAt: string;
  };
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: 'Returns' | 'Shipping' | 'Payments' | 'General' | 'Warranty';
  version: string;
  lastUpdated: string;
  status: 'Active' | 'Draft' | 'Archived';
  description: string;
  excerpt: string;
}

export interface AgentTraceStep {
  id: string;
  ticketId: string;
  eventType: 'request' | 'tool_call' | 'tool_result' | 'agent_decision' | 'reply_prepared';
  toolName?: string;
  timestamp: string;
  summary: string;
  payload?: any;
}

export interface AgentTraceRun {
  ticketId: string;
  totalSteps: number;
  toolCalls: number;
  finalOutcome: string;
  duration: string;
  model: string;
  steps: AgentTraceStep[];
}
