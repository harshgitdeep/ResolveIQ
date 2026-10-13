import { Message } from '../types';

export const mockMessages: Record<string, Message[]> = {
  'TKT-1041': [
    {
      id: 'MSG-001',
      ticketId: 'TKT-1041',
      senderType: 'customer',
      senderName: 'Sarah Jenkins',
      senderInitials: 'SJ',
      timestamp: 'Oct 11, 2026, 09:30 AM',
      content: "Hi team, I received my Mechanical Keyboard (ORD-1041) yesterday, but the package was crushed during delivery. The spacebar is cracked and several switch pins look bent. Could I please get a refund or replacement?",
      attachments: [
        {
          type: 'image',
          name: 'damaged_keyboard_spacebar.png',
          url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
          size: '2.4 MB'
        }
      ]
    },
    {
      id: 'MSG-002',
      ticketId: 'TKT-1041',
      senderType: 'agent',
      senderName: 'ResolveIQ AI Agent',
      senderInitials: 'IQ',
      timestamp: 'Oct 11, 2026, 09:31 AM',
      content: "Hello Sarah, thank you for reaching out and I'm very sorry to hear that your keyboard arrived damaged! I've located your order #ORD-1041 delivered via FedEx yesterday.\n\nAccording to our Damaged Product Policy, you are fully eligible for a full refund or an immediate replacement without any return shipping fee. Could you please confirm if you would prefer a 100% refund to your original Visa ending in 4242 or a replacement unit dispatched right away?",
      attachments: []
    },
    {
      id: 'MSG-003',
      ticketId: 'TKT-1041',
      senderType: 'customer',
      senderName: 'Sarah Jenkins',
      senderInitials: 'SJ',
      timestamp: 'Oct 11, 2026, 09:42 AM',
      content: "Thank you for the quick response! I would prefer a refund to my original card since I already purchased a backup keyboard for my urgent work project.",
      attachments: []
    }
  ]
};
