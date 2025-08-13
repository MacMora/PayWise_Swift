// examples/auth-integration-example.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { apiService } from '@/services/api';

export default function AuthIntegrationExample() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [step, setStep] = useState<'login' | 'mfa' | 'success'>('login');

  const { login, completeLogin, loading, error, isAuthenticated, user } = useAuth();
  const { fingerprint, loading: fingerprintLoading } = useDeviceFingerprint();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobileNumber) return;

    try {
      const challenge = await login(mobileNumber);
      setChallengeId(challenge);
      setStep('mfa');
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const handleMFAComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!challengeId || !mfaCode || !fingerprint) return;

    try {
      await completeLogin({
        challengeId,
        code: mfaCode,
        deviceFingerprint: fingerprint,
      });
      setStep('success');
    } catch (error) {
      console.error('Error completando MFA:', error);
    }
  };

  const handleRegister = async () => {
    if (!fingerprint) {
      alert('Fingerprint no disponible');
      return;
    }

    try {
      const challenge = await apiService.register({
        mobileNumber: '+1234567890',
        firstName: 'Usuario',
        lastName: 'Ejemplo',
        email: 'usuario@ejemplo.com',
        deviceFingerprint: fingerprint,
      });

      console.log('Registro iniciado:', challenge.data.challengeId);
    } catch (error) {
      console.error('Error en registro:', error);
    }
  };

  if (fingerprintLoading) {
    return <div>Cargando fingerprint...</div>;
  }

  if (isAuthenticated) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">✅ Autenticado</h2>
        <div className="space-y-2">
          <p><strong>Usuario:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Móvil:</strong> {user?.mobileNumber}</p>
          <p><strong>Verificado:</strong> {user?.isVerified ? 'Sí' : 'No'}</p>
          <p><strong>MFA:</strong> {user?.mfaEnabled ? 'Habilitado' : 'Deshabilitado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔐 Autenticación</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {step === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Número de Móvil
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Iniciando...' : 'Iniciar Login'}
          </button>
        </form>
      )}

      {step === 'mfa' && (
        <form onSubmit={handleMFAComplete} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Código MFA
            </label>
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder="123456"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
        </form>
      )}

      {step === 'success' && (
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold mb-2">¡Login Exitoso!</h3>
          <p className="text-gray-600">Redirigiendo al dashboard...</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t">
        <h3 className="text-lg font-semibold mb-2">🔧 Debug Info</h3>
        <div className="text-sm space-y-1">
          <p><strong>Fingerprint:</strong> {fingerprint ? '✅ Generado' : '❌ No disponible'}</p>
          <p><strong>Challenge ID:</strong> {challengeId || 'No disponible'}</p>
          <p><strong>Step:</strong> {step}</p>
        </div>
        
        <button
          onClick={handleRegister}
          className="mt-3 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Probar Registro
        </button>
      </div>
    </div>
  );
}
