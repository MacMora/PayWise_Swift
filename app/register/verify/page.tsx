"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from '@/services/api';

const VerifyRegister: React.FC = () => {
  const [seconds, setSeconds] = useState(5);

  const [phone, setPhone] = useState<string | null>(null);
  const [status, setStatus] = useState<'checking' | 'pending' | 'completed' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Obtener datos del localStorage
    const storedChallengeId = localStorage.getItem('registrationChallengeId');
    const storedPhone = localStorage.getItem('registrationPhone');
    
    if (!storedChallengeId || !storedPhone) {
      setError('Registration data not found. Please start over.');
      setStatus('error');
      return;
    }


    setPhone(storedPhone);

    // Iniciar polling para verificar el estado
    const checkStatus = async () => {
      try {
        const response = await apiService.checkRegistrationStatus(storedChallengeId);
        console.log('📊 Registration status:', response.data);
        
        if (response.data.status === 'completed') {
          setStatus('completed');
          // Limpiar localStorage
          localStorage.removeItem('registrationChallengeId');
          localStorage.removeItem('registrationPhone');
          // Redirigir al siguiente paso
          setTimeout(() => {
            router.push('/register/multistep');
          }, 2000);
        } else if (response.data.status === 'failed') {
          setError('Registration failed. Please try again.');
          setStatus('error');
        }
        // Si está pending, continuar polling
      } catch (err) {
        console.error('❌ Error checking status:', err);
        setError('Failed to check registration status.');
        setStatus('error');
      }
    };

    // Verificar estado cada 3 segundos
    const interval = setInterval(checkStatus, 3000);
    
    // Verificación inicial
    checkStatus();

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (seconds === 1 && status === 'checking') {
      setStatus('pending');
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, status]);

  const handleRetry = () => {
    setError(null);
    setStatus('checking');
    setSeconds(5);
  };

  const handleBackToRegister = () => {
    localStorage.removeItem('registrationChallengeId');
    localStorage.removeItem('registrationPhone');
    router.push('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fbff]">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <img src="/logo_swift.png" alt="PayWise Swift" style={{ width: 120, marginBottom: 24 }} />
        
        {status === 'checking' && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-[#22314f]">Preparing Registration</h2>
            <p className="mb-4 text-[#22314f] text-center">
              Setting up your account. Please wait...
            </p>
            <div className="text-lg font-semibold text-[#1e5fa6] mb-2">
              Redirecting in {seconds}...
            </div>
          </>
        )}

        {status === 'pending' && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-[#22314f]">Check your phone</h2>
            <p className="mb-4 text-[#22314f] text-center">
              We sent a verification request to your phone. Please accept the request to continue sign up.
            </p>
            {phone && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Phone: {phone}</p>
              </div>
            )}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-600">Waiting for verification...</span>
            </div>
          </>
        )}

        {status === 'completed' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-[#22314f]">Registration Successful!</h2>
            <p className="mb-4 text-[#22314f] text-center">
              Your account has been created successfully. Redirecting to complete setup...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2 text-[#22314f]">Verification Failed</h2>
            <p className="mb-4 text-[#22314f] text-center">
              {error || 'Something went wrong. Please try again.'}
            </p>
            <div className="flex space-x-3 w-full">
              <button 
                onClick={handleRetry}
                className="button-outline flex-1"
              >
                Retry
              </button>
              <button 
                onClick={handleBackToRegister}
                className="button-primary flex-1"
              >
                Start Over
              </button>
            </div>
          </>
        )}

        <p className="mt-4 text-sm text-[#22314f]">
          Need help?{' '}
          <a href="https://paywise.co/" className="text-[#1e5fa6] underline">
            Contact PayWise
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyRegister; 