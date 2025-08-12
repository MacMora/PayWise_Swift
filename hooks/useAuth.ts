// hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { apiService } from '@/services/api';
import { useDeviceFingerprint } from './useDeviceFingerprint';
import { AuthTokens, RegisterRequest, LoginCompleteRequest } from '@/services/types';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthTokens['user'] | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  });

  const { fingerprint } = useDeviceFingerprint();

  const register = useCallback(async (userData: Omit<RegisterRequest, 'deviceFingerprint'>) => {
    if (!fingerprint) {
      throw new Error('Device fingerprint no disponible');
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiService.register({
        ...userData,
        deviceFingerprint: fingerprint,
      });

      return response.data.challengeId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [fingerprint]);

  const login = useCallback(async (mobileNumber: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiService.login(mobileNumber);
      return response.data.challengeId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el login';
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const completeLogin = useCallback(async (loginData: LoginCompleteRequest) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiService.completeLogin(loginData);
      const { accessToken, refreshToken, user } = response.data;

      // Guardar tokens en localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error completando login';
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      await apiService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar tokens y estado
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Aquí podrías validar el token con el backend si es necesario
      setAuthState(prev => ({ ...prev, isAuthenticated: true }));
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    register,
    login,
    completeLogin,
    logout,
    checkAuthStatus,
    clearError,
  };
};
