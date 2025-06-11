"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Transaction = {
  date: string;
  time: string;
  id: string;
  type: string;
  sender: string;
  senderPhone: string;
  amount: number;
  fee: number;
  credited: number;
  receiver: string;
  receiverPhone: string;
  payout: number;
  message: string;
};

export type User = {
  id: number;
  name: string;
  phone: string;
  usdb: number;
  ttd: number;
  transactions: Transaction[];
};

interface AuthContextType {
  user: User | null;
  login: (phone: string) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const login = async (phone: string) => {
    const found = users.find(u => u.phone === phone);
    setUser(found || null);
    return found || null;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 