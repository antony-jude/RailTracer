
"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { users } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  getUserById: (id: string) => User | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserById = useCallback((id: string): User | undefined => {
    return users.find(u => u.id === id);
  }, []);

  const getUserByEmail = (email: string): User | undefined => {
    return users.find(u => u.email === email);
  };

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem('rail-user-id');
      if (storedUserId) {
        const loggedInUser = getUserById(storedUserId);
        if (loggedInUser) {
          setUser(loggedInUser);
        }
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, [getUserById]);

  const login = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    const foundUser = getUserByEmail(email);
    if (foundUser) {
      setUser(foundUser);
      try {
        localStorage.setItem('rail-user-id', foundUser.id);
      } catch (error) {
        console.error("Could not access localStorage:", error);
      }
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('rail-user-id');
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getUserById }}>
      {children}
    </AuthContext.Provider>
  );
};
