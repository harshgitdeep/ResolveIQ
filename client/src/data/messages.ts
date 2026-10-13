import { Message } from '../types';

export const mockMessages: Record<string, Message[]> = {
  'TKT-1041': [
    {
      id: 'MSG-001',
      ticketId: 'TKT-1041',
      senderType: 'customer',
      senderName: 'Aman Sharma',
      senderInitials: 'AS',
      timestamp: 'Oct 11, 2026, 09:30 AM',
      content: "Hi team, I received my package (ORD-1041) yesterday, but the Wireless Over-Ear Headphones arrived with a cracked headband and the left ear cushion was torn during transit. Could you please help me get a refund or replacement?",
      attachments: [
        {
          type: 'image',
          name: 'cracked_headband_evidence.jpg',
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
          size: '3.1 MB'
        }
      ]
    },
    {
      id: 'MSG-002',
      ticketId: 'TKT-1041',
      senderType: 'agent',
      senderName: 'ResolveIQ AI Support',
      senderInitials: 'IQ',
      timestamp: 'Oct 11, 2026, 09:31 AM',
      content: "Hello Aman, thanks for contacting ResolveIQ Support! I'm really sorry to hear that your headphones arrived damaged. I've verified your order #ORD-1041 delivered via FedEx.\n\nUnder our Damaged Product Policy, you are entitled to a free immediate replacement or a 100% refund without paying any return shipping fees. We've verified your attached photo proof of the cracked headband. Could you please confirm if you would prefer a free replacement unit dispatched today, or a direct refund to your card ending in 4242?",
      attachments: []
    },
    {
      id: 'MSG-003',
      ticketId: 'TKT-1041',
      senderType: 'customer',
      senderName: 'Aman Sharma',
      senderInitials: 'AS',
      timestamp: 'Oct 11, 2026, 09:42 AM',
      content: "Thank you for the fast response! I would prefer a refund to my original card since I needed a replacement immediately for work meetings yesterday.",
      attachments: []
    }
  ]
};
