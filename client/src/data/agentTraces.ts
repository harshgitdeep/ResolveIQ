import { AgentTraceRun } from '../types';

export const mockAgentTraces: Record<string, AgentTraceRun> = {
  'TKT-1041': {
    ticketId: 'TKT-1041',
    totalSteps: 4,
    toolCalls: 2,
    finalOutcome: 'Awaiting customer response',
    duration: '1.8 seconds',
    model: 'gemini-1.5-pro-preview-0514',
    steps: [
      {
        id: 'trace-1',
        ticketId: 'TKT-1041',
        eventType: 'request',
        timestamp: '09:30:12 AM',
        summary: 'Customer message received',
        payload: {
          channel: 'web_portal',
          sender: 'sarah.j@example.com',
          content: 'Hi team, I received my Mechanical Keyboard (ORD-1041) yesterday, but the package was crushed during delivery. The spacebar is cracked and several switch pins look bent. Could I please get a refund or replacement?',
          hasAttachments: true,
          attachmentsCount: 1
        }
      },
      {
        id: 'trace-2',
        ticketId: 'TKT-1041',
        eventType: 'tool_call',
        toolName: 'get_order',
        timestamp: '09:30:13 AM',
        summary: 'Tool called: get_order',
        payload: {
          function: 'get_order',
          arguments: {
            order_id: 'ORD-1041',
            customer_email: 'sarah.j@example.com'
          }
        }
      },
      {
        id: 'trace-3',
        ticketId: 'TKT-1041',
        eventType: 'tool_result',
        toolName: 'get_order',
        timestamp: '09:30:13 AM',
        summary: 'Tool result: Order delivered three days ago',
        payload: {
          order_id: 'ORD-1041',
          status: 'Delivered',
          delivered_at: '2026-10-10T14:15:00Z',
          carrier: 'FedEx Express',
          items: [
            { name: 'Ergonomic Mechanical Keyboard (Pro)', price: 149.00 }
          ],
          total_amount: 189.00,
          payment_method: 'Visa (ending 4242)'
        }
      },
      {
        id: 'trace-4',
        ticketId: 'TKT-1041',
        eventType: 'tool_call',
        toolName: 'search_support_policies',
        timestamp: '09:30:13 AM',
        summary: 'Tool called: search_support_policies',
        payload: {
          function: 'search_support_policies',
          arguments: {
            query: 'damaged keyboard transit refund replacement photo proof',
            category: 'Returns'
          }
        }
      },
      {
        id: 'trace-5',
        ticketId: 'TKT-1041',
        eventType: 'tool_result',
        toolName: 'search_support_policies',
        timestamp: '09:30:14 AM',
        summary: 'Tool result: Damaged-item policy retrieved',
        payload: {
          policy_id: 'POL-003',
          policy_name: 'Damaged Product Policy',
          clause_matched: 'Clause 4.1: Damaged in transit qualifies for full immediate refund or free replacement when photo evidence is submitted within 14 days of delivery.',
          confidence_score: 0.96
        }
      },
      {
        id: 'trace-6',
        ticketId: 'TKT-1041',
        eventType: 'agent_decision',
        timestamp: '09:30:14 AM',
        summary: 'Agent decision: Request customer preference (refund vs replacement)',
        payload: {
          reasoning: 'Customer provided valid photographic proof. Order is within 14-day damage claim window. Amount ($189) is under autonomous threshold ($250). Prepared proactive resolution options.',
          policy_compliance: 'Verified',
          requires_human_approval: false
        }
      },
      {
        id: 'trace-7',
        ticketId: 'TKT-1041',
        eventType: 'reply_prepared',
        timestamp: '09:30:14 AM',
        summary: 'Reply prepared and sent to customer',
        payload: {
          reply_text: 'Hello Sarah, thank you for reaching out and I\'m very sorry to hear that your keyboard arrived damaged! I\'ve located your order #ORD-1041 delivered via FedEx yesterday...',
          status_transition: 'Open -> In Progress',
          tokens_used: 482
        }
      }
    ]
  }
};
