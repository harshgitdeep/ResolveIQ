import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = authService.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        if (res.user) {
          setUser(res.user);
        }
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await authService.login({ email, password });
    if (!res.user || !res.token) {
      throw new Error('Authentication response was incomplete');
    }
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    const res = await authService.register({ name, email, password });
    if (!res.user || !res.token) {
      throw new Error('Registration response was incomplete');
    }
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const logout = () => {
    authService.clearAuth();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
