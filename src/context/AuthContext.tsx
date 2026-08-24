import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isLoading: true,
});

const normalizeUser = (rawUser: any): User | null => {
  if (!rawUser) return null;
  return {
    id: rawUser.id || rawUser._id,
    name: rawUser.name,
    email: rawUser.email,
    role: rawUser.role || 'user',
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await apiClient.get('/auth/me');
        setUser(normalizeUser(data));
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (credentials: any) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    setUser(normalizeUser(data));
    setIsAuthenticated(true);
  };

  const register = async (data: any) => {
    const { data: userData } = await apiClient.post('/auth/register', data);
    setUser(normalizeUser(userData));
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isAdmin: user?.role === 'admin', 
      login, 
      register, 
      logout,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
