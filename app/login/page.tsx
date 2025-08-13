"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { apiService } from '@/services/api';
import LogoWelcome from '../../components/LogoWelcome';

interface LoginState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [loginState, setLoginState] = useState<LoginState>({
    isSubmitting: false,
    error: null,
    success: false,
  });
  const router = useRouter();

  const { fingerprint, loading: fingerprintLoading, error: fingerprintError } = useDeviceFingerprint();

  // Limpiar error cuando fingerprint esté listo
  useEffect(() => {
    if (fingerprint && loginState.error) {
      setLoginState(prev => ({ ...prev, error: null }));
    }
  }, [fingerprint, loginState.error]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    setPhone(value);
    if (loginState.error) {
      setLoginState(prev => ({ ...prev, error: null }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setLoginState(prev => ({ 
        ...prev, 
        error: 'Please enter a valid phone number' 
      }));
      return;
    }

    if (!fingerprint) {
      setLoginState(prev => ({ 
        ...prev, 
        error: 'Device fingerprint is not ready. Please wait a moment and try again.' 
      }));
      return;
    }

    try {
      setLoginState(prev => ({ 
        ...prev, 
        isSubmitting: true, 
        error: null,
        success: false 
      }));

      console.log('🔐 Starting login process...');
      
      const response = await apiService.login(phone.trim());

      console.log('✅ Login request successful:', response.data);

      // Guardar challengeId para el siguiente paso
      localStorage.setItem('loginChallengeId', response.data.challengeId);
      localStorage.setItem('loginPhone', phone.trim());

      setLoginState(prev => ({ 
        ...prev, 
        success: true 
      }));

      // Redirigir a verificación después de un breve delay
      setTimeout(() => {
        router.push('/login/verify');
      }, 1000);

    } catch (err) {
      console.error('❌ Login failed:', err);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (err instanceof Error) {
        const errorText = err.message.toLowerCase();
        
        if (errorText.includes('not found') || errorText.includes('not registered')) {
          errorMessage = 'This phone number is not registered in the system.';
        } else if (errorText.includes('new device') || errorText.includes('unknown device')) {
          errorMessage = 'New device detected. Please complete additional verification.';
        } else if (errorText.includes('network') || errorText.includes('connection')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (errorText.includes('rate limit') || errorText.includes('too many')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        } else {
          errorMessage = err.message;
        }
      }

      setLoginState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));
    } finally {
      setLoginState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleSignup = () => {
    router.push('/register');
  };

  const isFormDisabled = fingerprintLoading || loginState.isSubmitting;

  return (
    <div className="responsive-container min-h-screen">
      <div className="md:flex-1 hidden lg:flex">
        <LogoWelcome />
      </div>
      <div className="max-md:p-10 flex-1 flex md:items-center md:justify-center bg-white">
        <form className="w-full max-w-sm flex flex-col max-md:justify-center max-md:items-center" onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold mb-6 text-[#22314f]">Login</h2>
          
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
          {loginState.error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{loginState.error}</p>
            </div>
          )}

          {/* Success Display */}
          {loginState.success && (
            <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="text-green-500">✅</div>
                <span className="text-green-700 text-sm">Login request sent successfully!</span>
              </div>
            </div>
          )}

          <input
            className="input"
            type="tel"
            placeholder="Phone Number (e.g., +1234567890)"
            value={phone}
            onChange={handlePhoneChange}
            disabled={isFormDisabled}
            required
          />
          
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="button-primary flex-1"
              disabled={isFormDisabled || !phone.trim()}
            >
              {loginState.isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
            <button 
              type="button" 
              className="button-outline flex-1" 
              onClick={handleSignup}
              disabled={isFormDisabled}
            >
              Sign Up
            </button>
          </div>

          {/* Help Text */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            Enter your registered phone number to continue
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 