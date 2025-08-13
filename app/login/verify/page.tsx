"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { apiService } from '@/services/api';
import { useAuth } from '@/components/AuthContext';
import LogoWelcome from '../../../components/LogoWelcome';

interface VerifyState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  sessionExpired: boolean;
}

const VerifyPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [verifyState, setVerifyState] = useState<VerifyState>({
    isSubmitting: false,
    error: null,
    success: false,
    sessionExpired: false,
  });
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const router = useRouter();

  const { fingerprint, loading: fingerprintLoading, error: fingerprintError } = useDeviceFingerprint();
  const { login } = useAuth();

  // Obtener datos del localStorage al cargar
  useEffect(() => {
    const storedChallengeId = localStorage.getItem('loginChallengeId');
    const storedPhone = localStorage.getItem('loginPhone');

    if (!storedChallengeId || !storedPhone) {
      setVerifyState(prev => ({ 
        ...prev, 
        sessionExpired: true,
        error: 'Login session expired. Please start over.' 
      }));
      return;
    }

    setChallengeId(storedChallengeId);
    setPhone(storedPhone);
  }, []);

  // Countdown para reenvío
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Solo números, máximo 6 dígitos
    setCode(value);
    if (verifyState.error) {
      setVerifyState(prev => ({ ...prev, error: null }));
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || code.length !== 6) {
      setVerifyState(prev => ({ 
        ...prev, 
        error: 'Please enter a valid 6-digit code' 
      }));
      return;
    }

    if (!challengeId || !fingerprint) {
      setVerifyState(prev => ({ 
        ...prev, 
        error: 'Session data or device fingerprint not available' 
      }));
      return;
    }

    try {
      setVerifyState(prev => ({ 
        ...prev, 
        isSubmitting: true, 
        error: null,
        success: false 
      }));

      console.log('🔐 Verifying login code...');
      
      const response = await apiService.completeLogin({
        challengeId,
        code: code.trim(),
        deviceFingerprint: fingerprint,
      });

      console.log('✅ Login verification successful:', response.data);

      // Guardar tokens en localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Actualizar AuthContext
      login(response.data.user);

      // Limpiar datos de login
      localStorage.removeItem('loginChallengeId');
      localStorage.removeItem('loginPhone');

      setVerifyState(prev => ({ 
        ...prev, 
        success: true 
      }));

      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('❌ Login verification failed:', err);
      
      let errorMessage = 'Verification failed. Please try again.';
      
      if (err instanceof Error) {
        const errorText = err.message.toLowerCase();
        
        if (errorText.includes('invalid') || errorText.includes('incorrect')) {
          errorMessage = 'Invalid verification code. Please try again.';
        } else if (errorText.includes('expired') || errorText.includes('timeout')) {
          errorMessage = 'Verification code has expired. Please request a new one.';
        } else if (errorText.includes('session') || errorText.includes('challenge')) {
          errorMessage = 'Login session expired. Please start over.';
          setVerifyState(prev => ({ ...prev, sessionExpired: true }));
        } else if (errorText.includes('network') || errorText.includes('connection')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }

      setVerifyState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));
      
      // Limpiar código en caso de error
      setCode('');
    } finally {
      setVerifyState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleResendCode = async () => {
    if (!phone || resendCountdown > 0) return;

    try {
      setVerifyState(prev => ({ ...prev, error: null }));

      console.log('🔄 Resending verification code...');
      
      const response = await apiService.login(phone);

      console.log('✅ Code resent successfully:', response.data);

      // Actualizar challengeId
      setChallengeId(response.data.challengeId);
      localStorage.setItem('loginChallengeId', response.data.challengeId);

      // Iniciar countdown
      setResendCountdown(60);

      setVerifyState(prev => ({ 
        ...prev, 
        error: null 
      }));

    } catch (err) {
      console.error('❌ Failed to resend code:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend code. Please try again.';
      
      setVerifyState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));
    }
  };

  const handleGoBack = () => {
    // Limpiar datos de login
    localStorage.removeItem('loginChallengeId');
    localStorage.removeItem('loginPhone');
    router.push('/login');
  };

  const isFormDisabled = fingerprintLoading || verifyState.isSubmitting || verifyState.sessionExpired;

  return (
    <div className="responsive-container min-h-screen">
      <div className="flex-1 hidden lg:flex">
        <LogoWelcome />
      </div>
      <div className="max-md:p-10 flex-1 flex md:items-center md:justify-center bg-white">
        <form className="w-full max-w-sm flex flex-col max-md:justify-center max-md:items-center" onSubmit={handleVerify}>
          <h2 className="text-2xl font-bold mb-2 text-[#22314f]">Verify Login</h2>
          <p className="mb-4 text-sm text-[#22314f]">
            Enter the 6-digit verification code sent to your phone
          </p>

          {/* Phone Display */}
          {phone && (
            <div className="w-full mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Phone Number:</p>
              <p className="font-medium text-[#22314f]">{phone}</p>
            </div>
          )}

          {/* Fingerprint Status */}
          {fingerprintLoading && (
            <div className="w-full mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-800 text-sm">Preparing device security...</span>
              </div>
            </div>
          )}

          {fingerprintError && (
            <div className="w-full mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-yellow-800 text-sm">⚠️ Using basic security mode</span>
            </div>
          )}

          {/* Error Display */}
          {verifyState.error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{verifyState.error}</p>
            </div>
          )}

          {/* Success Display */}
          {verifyState.success && (
            <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="text-green-500">✅</div>
                <span className="text-green-700 text-sm">Login successful! Redirecting to dashboard...</span>
              </div>
            </div>
          )}

          {/* Code Input */}
          <input
            className="input text-center text-2xl font-mono tracking-widest"
            type="text"
            placeholder="123456"
            value={code}
            onChange={handleCodeChange}
            maxLength={6}
            disabled={isFormDisabled}
            required
          />

          {/* Resend Code Button */}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isFormDisabled || resendCountdown > 0 || !phone}
            className="mt-2 text-sm text-[#1e5fa6] underline hover:text-[#174a7c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCountdown > 0 
              ? `Resend code in ${resendCountdown}s` 
              : 'Resend verification code'
            }
          </button>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full mt-4">
            <button 
              type="submit" 
              className="button-primary flex-1"
              disabled={isFormDisabled || code.length !== 6}
            >
              {verifyState.isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify & Login'
              )}
            </button>
            <button 
              type="button" 
              className="button-outline flex-1" 
              onClick={handleGoBack}
              disabled={isFormDisabled}
            >
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            Check your authenticator app for the verification code
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage; 