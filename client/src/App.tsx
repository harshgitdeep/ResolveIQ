import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { CustomerProvider } from './context/CustomerContext';

// Employee Dashboard Pages
import { DashboardPage } from './pages/DashboardPage';
import { TicketsPage } from './pages/TicketsPage';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailsPage } from './pages/CustomerDetailsPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { SettingsPage } from './pages/SettingsPage';
import { AgentTracePage } from './pages/AgentTracePage';

// Customer Support Portal Pages
import { CustomerOverviewPage } from './pages/CustomerOverviewPage';
import { CustomerTicketListPage } from './pages/CustomerTicketListPage';
import { CustomerTicketConversationPage } from './pages/CustomerTicketConversationPage';
import { CreateSupportRequestPage } from './pages/CreateSupportRequestPage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { CustomerOrderDetailsPage } from './pages/CustomerOrderDetailsPage';
import { CustomerHelpCenterPage } from './pages/CustomerHelpCenterPage';

export function App() {
  return (
    <CustomerProvider>
      <BrowserRouter>
        <Routes>
          {/* ========================================================= */}
          {/* 1. Dedicated Customer-Facing Support Portal (/portal/...) */}
          {/* ========================================================= */}
          <Route path="/portal" element={<CustomerLayout />}>
            <Route index element={<CustomerOverviewPage />} />
            <Route path="tickets" element={<CustomerTicketListPage />} />
            <Route path="tickets/new" element={<CreateSupportRequestPage />} />
            <Route path="tickets/:ticketId" element={<CustomerTicketConversationPage />} />
            <Route path="orders" element={<CustomerOrdersPage />} />
            <Route path="orders/:orderId" element={<CustomerOrderDetailsPage />} />
            <Route path="help" element={<CustomerHelpCenterPage />} />
          </Route>

          {/* ========================================================= */}
          {/* 2. Employee / Support Agent Dashboard (preserved intact) */}
          {/* ========================================================= */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="tickets/:id" element={<TicketDetailsPage />} />
            <Route path="tickets/:id/agent-trace" element={<AgentTracePage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CustomerProvider>
  );
}

export default App;
