import { useCallback } from 'react';
import { apiService } from '@/services/api';

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

// Función para obtener el tiempo restante hasta la expiración (en segundos)
const getTimeUntilExpiration = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return Math.max(0, payload.exp - currentTime);
  } catch (error) {
    console.error('Error getting time until expiration:', error);
    return 0;
  }
};

export const useTokenRefresh = () => {
  // Función para refresh manual de tokens
  const refreshTokens = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔄 Attempting token refresh...');
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('❌ No refresh token found');
        return false;
      }

      // Verificar si el refresh token está expirado
      if (isTokenExpired(refreshToken)) {
        console.log('❌ Refresh token expired');
        return false;
      }

      // Aquí implementarías la llamada a la API para refresh
      // Por ahora, simplemente retornamos false
      // En una implementación real, llamarías a algo como:
      // const response = await apiService.refreshToken(refreshToken);
      // localStorage.setItem('accessToken', response.data.accessToken);
      // localStorage.setItem('refreshToken', response.data.refreshToken);
      
      console.log('⚠️ Token refresh not implemented yet');
      return false;

    } catch (error) {
      console.error('❌ Error refreshing tokens:', error);
      return false;
    }
  }, []);

  // Función para verificar si necesitamos refresh
  const shouldRefreshToken = useCallback((): boolean => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return false;

    // Refresh si el token expira en menos de 5 minutos
    const timeUntilExpiration = getTimeUntilExpiration(accessToken);
    return timeUntilExpiration < 5 * 60; // 5 minutos
  }, []);

  // Función para obtener el token actual (con refresh automático si es necesario)
  const getValidToken = useCallback(async (): Promise<string | null> => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return null;

    if (shouldRefreshToken()) {
      const refreshSuccess = await refreshTokens();
      if (!refreshSuccess) {
        // Si el refresh falla, limpiar tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return null;
      }
      // Obtener el nuevo token
      return localStorage.getItem('accessToken');
    }

    return accessToken;
  }, [shouldRefreshToken, refreshTokens]);

  return {
    refreshTokens,
    shouldRefreshToken,
    getValidToken,
    isTokenExpired,
    getTimeUntilExpiration,
  };
};
