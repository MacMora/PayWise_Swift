// examples/auth-context-demo.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

export default function AuthContextDemo() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    refreshAuth, 
    checkAuthStatus 
  } = useAuth();
  
  const {
    refreshTokens,
    shouldRefreshToken,
    getValidToken,
    isTokenExpired,
    getTimeUntilExpiration,
  } = useTokenRefresh();

  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  // Simular datos de usuario para demo
  const mockUser = {
    id: 'user_123',
    firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '+1234567890',
    email: 'john.doe@example.com',
    isVerified: true,
    mfaEnabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    usdb: 1000.50,
    ttd: 500.25,
    transactions: [
      {
        date: '2024-01-15',
        time: '14:30:00',
        id: 'txn_001',
        type: 'transfer',
        sender: 'John Doe',
        senderPhone: '+1234567890',
        amount: 100,
        fee: 2.50,
        credited: 97.50,
        receiver: 'Jane Smith',
        receiverPhone: '+0987654321',
        payout: 97.50,
        message: 'Payment for services'
      }
    ]
  };

  // Simular tokens JWT para demo
  const generateMockTokens = () => {
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExp = now + 3600; // 1 hora
    const refreshTokenExp = now + 86400; // 24 horas

    const accessTokenPayload = {
      sub: 'user_123',
      iat: now,
      exp: accessTokenExp,
      iss: 'paywise-api',
      type: 'access'
    };

    const refreshTokenPayload = {
      sub: 'user_123',
      iat: now,
      exp: refreshTokenExp,
      iss: 'paywise-api',
      type: 'refresh'
    };

    // Simular JWT (no es un JWT real, solo para demo)
    const accessToken = btoa(JSON.stringify(accessTokenPayload));
    const refreshToken = btoa(JSON.stringify(refreshTokenPayload));

    return { accessToken, refreshToken, accessTokenExp, refreshTokenExp };
  };

  // Función para simular login
  const handleDemoLogin = async () => {
    setDemoState('loading');
    
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generar tokens mock
      const tokens = generateMockTokens();
      
      // Guardar en localStorage
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Actualizar AuthContext
      login(mockUser);
      
      setDemoState('success');
      console.log('🧪 Demo: Login successful with tokens:', tokens);
      
    } catch (error) {
      console.error('❌ Demo: Login failed:', error);
      setDemoState('error');
    }
  };

  // Función para simular logout
  const handleDemoLogout = async () => {
    setDemoState('loading');
    
    try {
      await logout();
      setDemoState('success');
      console.log('🧪 Demo: Logout successful');
    } catch (error) {
      console.error('❌ Demo: Logout failed:', error);
      setDemoState('error');
    }
  };

  // Función para verificar estado de autenticación
  const handleCheckAuth = async () => {
    setDemoState('loading');
    
    try {
      const isAuth = await checkAuthStatus();
      setDemoState('success');
      console.log('🧪 Demo: Auth check result:', isAuth);
    } catch (error) {
      console.error('❌ Demo: Auth check failed:', error);
      setDemoState('error');
    }
  };

  // Función para refresh de autenticación
  const handleRefreshAuth = async () => {
    setDemoState('loading');
    
    try {
      await refreshAuth();
      setDemoState('success');
      console.log('🧪 Demo: Auth refresh successful');
    } catch (error) {
      console.error('❌ Demo: Auth refresh failed:', error);
      setDemoState('error');
    }
  };

  // Función para analizar tokens
  const analyzeTokens = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!accessToken || !refreshToken) {
      setTokenInfo(null);
      return;
    }

    try {
      const accessPayload = JSON.parse(atob(accessToken));
      const refreshPayload = JSON.parse(atob(refreshToken));
      
      const now = Math.floor(Date.now() / 1000);
      
      setTokenInfo({
        accessToken: {
          payload: accessPayload,
          isExpired: isTokenExpired(accessToken),
          timeUntilExpiration: getTimeUntilExpiration(accessToken),
          expiresIn: accessPayload.exp - now
        },
        refreshToken: {
          payload: refreshPayload,
          isExpired: isTokenExpired(refreshToken),
          timeUntilExpiration: getTimeUntilExpiration(refreshToken),
          expiresIn: refreshPayload.exp - now
        },
        shouldRefresh: shouldRefreshToken()
      });
    } catch (error) {
      console.error('Error analyzing tokens:', error);
      setTokenInfo(null);
    }
  };

  // Analizar tokens cuando cambie la autenticación
  useEffect(() => {
    if (isAuthenticated) {
      analyzeTokens();
    } else {
      setTokenInfo(null);
    }
  }, [isAuthenticated]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔐 AuthContext Demo
        </h1>

        {/* Estado Actual */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Estado Actual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              isAuthenticated ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-semibold mb-2">Autenticación</h3>
              <p className={`text-sm ${isAuthenticated ? 'text-green-700' : 'text-red-700'}`}>
                {isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              isLoading ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <h3 className="font-semibold mb-2">Estado</h3>
              <p className={`text-sm ${isLoading ? 'text-yellow-700' : 'text-blue-700'}`}>
                {isLoading ? '🔄 Cargando...' : '✅ Listo'}
              </p>
            </div>
            
            <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
              <h3 className="font-semibold mb-2">Usuario</h3>
              <p className="text-sm text-gray-700">
                {user ? `${user.firstName} ${user.lastName}` : 'No hay usuario'}
              </p>
            </div>
          </div>
        </div>

        {/* Información del Usuario */}
        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Datos Personales</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Teléfono:</strong> {user.mobileNumber}</p>
                    <p><strong>Verificado:</strong> {user.isVerified ? 'Sí' : 'No'}</p>
                    <p><strong>MFA:</strong> {user.mfaEnabled ? 'Habilitado' : 'Deshabilitado'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Datos Extendidos</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>USDB:</strong> ${(user as any).usdb || 0}</p>
                    <p><strong>TTD:</strong> ${(user as any).ttd || 0}</p>
                    <p><strong>Transacciones:</strong> {(user as any).transactions?.length || 0}</p>
                    <p><strong>Creado:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Actualizado:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información de Tokens */}
        {tokenInfo && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Información de Tokens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Access Token</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Expira:</strong> {tokenInfo.accessToken.expiresIn > 0 ? 
                    `${Math.floor(tokenInfo.accessToken.expiresIn / 60)} minutos` : 
                    'Expirado'
                  }</p>
                  <p><strong>Estado:</strong> {tokenInfo.accessToken.isExpired ? '❌ Expirado' : '✅ Válido'}</p>
                  <p><strong>Subject:</strong> {tokenInfo.accessToken.payload.sub}</p>
                  <p><strong>Issuer:</strong> {tokenInfo.accessToken.payload.iss}</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Refresh Token</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Expira:</strong> {tokenInfo.refreshToken.expiresIn > 0 ? 
                    `${Math.floor(tokenInfo.refreshToken.expiresIn / 3600)} horas` : 
                    'Expirado'
                  }</p>
                  <p><strong>Estado:</strong> {tokenInfo.refreshToken.isExpired ? '❌ Expirado' : '✅ Válido'}</p>
                  <p><strong>Subject:</strong> {tokenInfo.refreshToken.payload.sub}</p>
                  <p><strong>Issuer:</strong> {tokenInfo.refreshToken.payload.iss}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm">
                <strong>Necesita Refresh:</strong> {tokenInfo.shouldRefresh ? '🔄 Sí' : '✅ No'}
              </p>
            </div>
          </div>
        )}

        {/* Controles de Demo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Controles de Demo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={handleDemoLogin}
              disabled={isAuthenticated || demoState === 'loading'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {demoState === 'loading' ? '🔄' : '🔐'} Login
            </button>
            
            <button
              onClick={handleDemoLogout}
              disabled={!isAuthenticated || demoState === 'loading'}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {demoState === 'loading' ? '🔄' : '🚪'} Logout
            </button>
            
            <button
              onClick={handleCheckAuth}
              disabled={demoState === 'loading'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {demoState === 'loading' ? '🔄' : '🔍'} Check Auth
            </button>
            
            <button
              onClick={handleRefreshAuth}
              disabled={!isAuthenticated || demoState === 'loading'}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {demoState === 'loading' ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Funciones de Token */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Funciones de Token</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={analyzeTokens}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              🔍 Analizar Tokens
            </button>
            
            <button
              onClick={refreshTokens}
              disabled={!isAuthenticated}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              🔄 Refresh Tokens
            </button>
            
            <button
              onClick={async () => {
                const token = await getValidToken();
                console.log('Valid token:', token);
                alert(token ? 'Token válido obtenido' : 'No hay token válido');
              }}
              disabled={!isAuthenticated}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              🎯 Get Valid Token
            </button>
          </div>
        </div>

        {/* Estado de Demo */}
        {demoState !== 'idle' && (
          <div className={`p-4 rounded-lg ${
            demoState === 'success' ? 'bg-green-50 border border-green-200' :
            demoState === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-yellow-50 border border-yellow-200'
          }`}>
            <h3 className="font-semibold mb-2">
              {demoState === 'success' ? '✅ Operación Exitosa' :
               demoState === 'error' ? '❌ Error' :
               '🔄 Procesando...'}
            </h3>
            <p className="text-sm">
              {demoState === 'success' ? 'La operación se completó correctamente.' :
               demoState === 'error' ? 'Ocurrió un error durante la operación.' :
               'Procesando la solicitud...'}
            </p>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info</h3>
          <button
            onClick={() => {
              console.log('AuthContext State:', {
                user,
                isAuthenticated,
                isLoading,
                demoState,
                tokenInfo
              });
              console.log('localStorage:', {
                accessToken: localStorage.getItem('accessToken'),
                refreshToken: localStorage.getItem('refreshToken'),
                user: localStorage.getItem('user')
              });
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            📊 Log State
          </button>
        </div>
      </div>
    </div>
  );
}
