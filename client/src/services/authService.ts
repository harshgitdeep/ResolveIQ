const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support_agent' | 'customer' | string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  resetToken?: string;
}

export const authService = {
  getToken(): string | null {
    return localStorage.getItem('resolveiq_token');
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('resolveiq_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: User) {
    localStorage.setItem('resolveiq_token', token);
    localStorage.setItem('resolveiq_user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('resolveiq_token');
    localStorage.removeItem('resolveiq_user');
  },

  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Registration failed');
    }
    if (result.token && result.user) {
      this.setAuth(result.token, result.user);
    }
    return result;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Login failed');
    }
    if (result.token && result.user) {
      this.setAuth(result.token, result.user);
    }
    return result;
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Request failed');
    }
    return result;
  },

  async resetPassword(data: { token: string; newPassword: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Password reset failed');
    }
    return result;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (!res.ok) {
      this.clearAuth();
      throw new Error(result.message || 'Session expired');
    }
    if (result.user) {
      localStorage.setItem('resolveiq_user', JSON.stringify(result.user));
    }
    return result;
  },
};
