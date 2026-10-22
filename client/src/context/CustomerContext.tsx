import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, Ticket, Order, Message } from '../types';
import { api } from '../services/api';

interface CustomerContextType {
  currentCustomer: Customer | null;
  allCustomers: Customer[];
  setCurrentCustomer: (c: Customer) => void;
  customerTickets: Ticket[];
  customerOrders: Order[];
  messages: Record<string, Message[]>;
  loading: boolean;
  refreshData: () => Promise<void>;
  createTicket: (ticket: {
    category: string;
    orderId?: string;
    subject: string;
    description: string;
    attachment?: { name: string; url: string; size?: string };
  }) => Promise<Ticket>;
  sendMessage: (
    ticketId: string,
    content: string,
    attachment?: { name: string; url: string; size?: string }
  ) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [custs, tix, ords] = await Promise.all([
        api.getCustomers(),
        api.getTickets(),
        api.getOrders(),
      ]);

      setAllCustomers(custs);
      setAllTickets(tix);
      setAllOrders(ords);

      // Default active customer is the first customer with tickets/orders (e.g. Harsh or Neha)
      if (!currentCustomer && custs.length > 0) {
        const found = custs.find((c) => c.name.toLowerCase().includes('harsh')) || custs[0];
        setCurrentCustomer(found);
      }
    } catch (err) {
      console.error('Failed to load real data from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter for the current active customer
  const customerTickets = currentCustomer
    ? allTickets.filter((t) => t.customerId === currentCustomer.id || t.customerEmail === currentCustomer.email)
    : [];

  const customerOrders = currentCustomer
    ? allOrders.filter((o) => o.customerId === currentCustomer.id || o.customerEmail === currentCustomer.email)
    : [];

  const createTicket = async ({
    category,
    orderId,
    subject,
    description,
  }: {
    category: string;
    orderId?: string;
    subject: string;
    description: string;
    attachment?: { name: string; url: string; size?: string };
  }) => {
    const priority = category === 'Damaged Product' ? 'High' : 'Medium';
    const newTicket = await api.createTicket({
      subject,
      description,
      orderId: orderId || undefined,
      priority,
      customerId: currentCustomer?.id,
    });

    await refreshData();
    return newTicket;
  };

  const sendMessage = async (
    ticketId: string,
    content: string,
  ) => {
    try {
      const savedMsg = await api.sendMessage(ticketId, content, 'customer');

      setMessages((prev) => {
        const currentList = prev[ticketId] || [];
        return {
          ...prev,
          [ticketId]: [...currentList, savedMsg],
        };
      });

      // Refetch ticket details to keep synchronization
      await refreshData();
    } catch (err) {
      console.error('Error sending message to database:', err);
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        currentCustomer,
        allCustomers,
        setCurrentCustomer,
        customerTickets,
        customerOrders,
        messages,
        loading,
        refreshData,
        createTicket,
        sendMessage,
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
