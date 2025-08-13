"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiService } from '@/services/api';
import { User, AuthTokens } from '@/services/types';

// Tipos de transacciones (mantenidos para compatibilidad)
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

// Extender User con campos adicionales si es necesario
export interface ExtendedUser extends User {
  usdb?: number;
  ttd?: number;
  transactions?: Transaction[];
}

interface AuthContextType {
  user: ExtendedUser | null;
  login: (userData: ExtendedUser) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para obtener tokens del localStorage
const getStoredTokens = () => {
  if (typeof window === 'undefined') return null;
  
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userData = localStorage.getItem('user');
  
  if (!accessToken || !refreshToken || !userData) return null;
  
  try {
    const user = JSON.parse(userData);
    return { accessToken, refreshToken, user };
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
};

// Función para limpiar tokens del localStorage
const clearStoredTokens = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('loginChallengeId');
  localStorage.removeItem('loginPhone');
  localStorage.removeItem('registrationChallengeId');
  localStorage.removeItem('registrationPhone');
};

// Función para verificar si un token está expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Considerar como expirado si hay error
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la app
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔍 Checking authentication status...');
      
      const storedData = getStoredTokens();
      if (!storedData) {
        console.log('❌ No stored tokens found');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      const { accessToken, refreshToken, user: storedUser } = storedData;

      // Verificar si el access token está expirado
      if (isTokenExpired(accessToken)) {
        console.log('⚠️ Access token expired, attempting refresh...');
        
        // Intentar refresh del token
        try {
          // Aquí podrías implementar la lógica de refresh token
          // Por ahora, simplemente limpiaremos los tokens expirados
          console.log('🔄 Token expired, clearing stored data');
          clearStoredTokens();
          setIsAuthenticated(false);
          setUser(null);
          return false;
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          clearStoredTokens();
          setIsAuthenticated(false);
          setUser(null);
          return false;
        }
      }

      // Token válido, establecer usuario autenticado
      console.log('✅ Valid authentication found');
      setUser(storedUser);
      setIsAuthenticated(true);
      return true;

    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      clearStoredTokens();
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  }, []);

  // Refresh de autenticación
  const refreshAuth = useCallback(async (): Promise<void> => {
    try {
      console.log('🔄 Refreshing authentication...');
      await checkAuthStatus();
    } catch (error) {
      console.error('❌ Error refreshing auth:', error);
      await logout();
    }
  }, [checkAuthStatus]);

  // Login manual (para casos donde ya tenemos los datos del usuario)
  const login = useCallback((userData: ExtendedUser) => {
    console.log('🔐 Manual login with user data:', userData);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Logout completo
  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log('🚪 Logging out...');
      
      // Llamar a la API para logout si hay token válido
      const storedData = getStoredTokens();
      if (storedData && !isTokenExpired(storedData.accessToken)) {
        try {
          await apiService.logout();
          console.log('✅ Logout API call successful');
        } catch (apiError) {
          console.warn('⚠️ Logout API call failed, but continuing with local cleanup:', apiError);
        }
      }

      // Limpiar estado local
      clearStoredTokens();
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('✅ Logout completed');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Asegurar limpieza incluso si hay error
      clearStoredTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Verificar autenticación al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        await checkAuthStatus();
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [checkAuthStatus]);

  // Verificar tokens periódicamente (cada 5 minutos)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const storedData = getStoredTokens();
        if (storedData && isTokenExpired(storedData.accessToken)) {
          console.log('🔄 Token expired during periodic check, refreshing...');
          await refreshAuth();
        }
      } catch (error) {
        console.error('❌ Error in periodic token check:', error);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshAuth]);

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    refreshAuth,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 