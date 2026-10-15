import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { CustomerProvider } from './context/CustomerContext';
import { AuthProvider } from './context/AuthContext';

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

// Auth Pages (UI Prototype)
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

export function App() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <BrowserRouter>
          <Routes>
          {/* ========================================================= */}
          {/* Landing / Auth Routes (UI prototype)                      */}
          {/* First page when landing on the website is /login           */}
          {/* ========================================================= */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

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
          {/* 2. Employee / Support Agent Dashboard                     */}
          {/* ========================================================= */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
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
          </Route>

          {/* Direct convenience aliases for existing routes */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/tickets" element={<Navigate to="/app/tickets" replace />} />
          <Route path="/tickets/:id" element={<Navigate to="/app/tickets/:id" replace />} />
          <Route path="/customers" element={<Navigate to="/app/customers" replace />} />
          <Route path="/customers/:id" element={<Navigate to="/app/customers/:id" replace />} />
          <Route path="/orders" element={<Navigate to="/app/orders" replace />} />
          <Route path="/orders/:id" element={<Navigate to="/app/orders/:id" replace />} />
          <Route path="/knowledge-base" element={<Navigate to="/app/knowledge-base" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </CustomerProvider>
  </AuthProvider>
  );
}

export default App;
