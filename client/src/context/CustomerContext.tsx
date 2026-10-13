import React, { createContext, useContext, useState } from 'react';
import { Customer, Ticket, Order, Message } from '../types';
import { mockCustomers } from '../data/customers';
import { mockTickets } from '../data/tickets';
import { mockOrders } from '../data/orders';
import { mockMessages } from '../data/messages';

interface CustomerContextType {
  currentCustomer: Customer;
  customerTickets: Ticket[];
  customerOrders: Order[];
  messages: Record<string, Message[]>;
  createTicket: (ticket: {
    category: string;
    orderId?: string;
    subject: string;
    description: string;
    attachment?: { name: string; url: string; size?: string };
  }) => Ticket;
  sendMessage: (
    ticketId: string,
    content: string,
    attachment?: { name: string; url: string; size?: string }
  ) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in customer is Aman Sharma (CUST-001)
  const currentCustomer = mockCustomers[0];

  // Local state for tickets so user can create tickets and see them update in real-time
  const [allTickets, setAllTickets] = useState<Ticket[]>(mockTickets);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(mockMessages);

  // Tickets belonging to current logged in customer
  const customerTickets = allTickets.filter((t) => t.customerId === currentCustomer.id);

  // Orders belonging to current logged in customer
  const customerOrders = mockOrders.filter((o) => o.customerId === currentCustomer.id);

  const createTicket = ({
    category,
    orderId,
    subject,
    description,
    attachment
  }: {
    category: string;
    orderId?: string;
    subject: string;
    description: string;
    attachment?: { name: string; url: string; size?: string };
  }) => {
    const newId = `TKT-${Math.floor(1042 + Math.random() * 900)}`;
    const newTicket: Ticket = {
      id: newId,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerEmail: currentCustomer.email,
      customerInitials: currentCustomer.avatarInitials,
      subject,
      orderId: orderId || undefined,
      status: 'Open',
      priority: category === 'Damaged Product' ? 'High' : 'Medium',
      createdAt: 'Just now',
      lastUpdated: 'Just now',
      assignedAgent: 'ResolveIQ AI Support'
    };

    const initialMessage: Message = {
      id: `MSG-${Date.now()}`,
      ticketId: newId,
      senderType: 'customer',
      senderName: currentCustomer.name,
      senderInitials: currentCustomer.avatarInitials,
      timestamp: 'Just now',
      content: description,
      attachments: attachment ? [{ type: 'image', ...attachment }] : []
    };

    // Simulate instant AI auto-acknowledgment
    const aiAutoReply: Message = {
      id: `MSG-${Date.now() + 1}`,
      ticketId: newId,
      senderType: 'agent',
      senderName: 'ResolveIQ AI Support',
      senderInitials: 'IQ',
      timestamp: 'Just now',
      content: `Hello ${currentCustomer.name.split(' ')[0]}, thank you for reaching out! We've received your inquiry regarding "${subject}". Our AI assistant has reviewed your details and is actively assessing your claim based on our policy standards.`,
      attachments: []
    };

    setAllTickets((prev) => [newTicket, ...prev]);
    setAllMessages((prev) => ({
      ...prev,
      [newId]: [initialMessage, aiAutoReply]
    }));

    return newTicket;
  };

  const sendMessage = (
    ticketId: string,
    content: string,
    attachment?: { name: string; url: string; size?: string }
  ) => {
    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      ticketId,
      senderType: 'customer',
      senderName: currentCustomer.name,
      senderInitials: currentCustomer.avatarInitials,
      timestamp: 'Just now',
      content,
      attachments: attachment ? [{ type: 'image', ...attachment }] : []
    };

    setAllMessages((prev) => {
      const existing = prev[ticketId] || [];
      return {
        ...prev,
        [ticketId]: [...existing, newMessage]
      };
    });

    // Update ticket last updated timestamp
    setAllTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, lastUpdated: 'Just now', status: 'In Progress' }
          : t
      )
    );

    // Simulate reactive AI assistant confirmation response after 1 second
    setTimeout(() => {
      const aiReply: Message = {
        id: `MSG-${Date.now() + 10}`,
        ticketId,
        senderType: 'agent',
        senderName: 'ResolveIQ AI Support',
        senderInitials: 'IQ',
        timestamp: 'Just now',
        content: `Thanks for the follow-up, ${currentCustomer.name.split(' ')[0]}. I've noted this update on your ticket and refreshed your resolution status.`,
        attachments: []
      };

      setAllMessages((prev) => {
        const existing = prev[ticketId] || [];
        return {
          ...prev,
          [ticketId]: [...existing, aiReply]
        };
      });
    }, 1200);
  };

  return (
    <CustomerContext.Provider
      value={{
        currentCustomer,
        customerTickets,
        customerOrders,
        messages: allMessages,
        createTicket,
        sendMessage
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
