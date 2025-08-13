"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { apiService } from '@/services/api';

interface MFAState {
  qrCodeUrl: string | null;
  secret: string | null;
  challengeId: string | null;
}

const Register2FA: React.FC = () => {
  const [code, setCode] = useState("");
  const [mfaState, setMfaState] = useState<MFAState>({
    qrCodeUrl: null,
    secret: null,
    challengeId: null,
  });
  const [status, setStatus] = useState<'loading' | 'ready' | 'validating' | 'error' | 'completed'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const router = useRouter();

  const { fingerprint, loading: fingerprintLoading, error: fingerprintError } = useDeviceFingerprint();

  // Obtener challengeId del localStorage
  useEffect(() => {
    const storedChallengeId = localStorage.getItem('registrationChallengeId');
    if (!storedChallengeId) {
      setError('Registration session not found. Please start over.');
      setStatus('error');
      return;
    }
    setMfaState(prev => ({ ...prev, challengeId: storedChallengeId }));
  }, []);

  // Generar QR cuando fingerprint esté listo
  useEffect(() => {
    if (fingerprint && mfaState.challengeId && status === 'loading') {
      generateMFA();
    }
  }, [fingerprint, mfaState.challengeId, status]);

  const generateMFA = async () => {
    if (!fingerprint || !mfaState.challengeId) {
      setError('Device fingerprint or challenge ID not available');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      setError(null);

      console.log('🔐 Generating MFA setup...');
      
      const response = await apiService.setupMFA({
        challengeId: mfaState.challengeId,
        deviceFingerprint: fingerprint,
      });

      console.log('✅ MFA setup successful:', response.data);
      
      setMfaState(prev => ({
        ...prev,
        qrCodeUrl: response.data.qrCodeUrl,
        secret: response.data.secret,
      }));
      
      setStatus('ready');
      
    } catch (err) {
      console.error('❌ MFA setup failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate QR code';
      setError(errorMessage);
      setStatus('error');
    }
  };

  const regenerateMFA = async () => {
    if (!fingerprint || !mfaState.challengeId) return;

    setIsRegenerating(true);
    setError(null);

    try {
      console.log('🔄 Regenerating MFA setup...');
      
      const response = await apiService.retryMFA({
        challengeId: mfaState.challengeId,
        deviceFingerprint: fingerprint,
      });

      console.log('✅ MFA regeneration successful:', response.data);
      
      setMfaState(prev => ({
        ...prev,
        qrCodeUrl: response.data.qrCodeUrl,
        secret: response.data.secret,
      }));
      
      setStatus('ready');
      
    } catch (err) {
      console.error('❌ MFA regeneration failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate QR code';
      setError(errorMessage);
      setStatus('error');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    if (!fingerprint || !mfaState.challengeId) {
      setError('Device fingerprint or challenge ID not available');
      return;
    }

    try {
      setStatus('validating');
      setError(null);

      console.log('🔐 Validating MFA code...');
      
      // Completar MFA
      await apiService.completeMFA({
        code: code.trim(),
        challengeId: mfaState.challengeId,
        deviceFingerprint: fingerprint,
      });

      console.log('✅ MFA validation successful');
      
      // Completar registro
      console.log('🎉 Completing registration...');
      
      await apiService.completeRegistration(mfaState.challengeId);

      console.log('✅ Registration completed successfully');
      
      // Limpiar localStorage
      localStorage.removeItem('registrationChallengeId');
      localStorage.removeItem('registrationPhone');
      
      setStatus('completed');
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('❌ MFA validation failed:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Invalid authentication code';
      setError(errorMessage);
      setStatus('ready');
      
      // Limpiar código en caso de error
      setCode('');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Solo números, máximo 6 dígitos
    setCode(value);
    if (error) setError(null);
  };

  const isFormDisabled = fingerprintLoading || status === 'loading' || status === 'validating' || status === 'completed';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fbff]">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-center text-[#22314f]">
          Enable Two Factor<br />Authentication
        </h2>
        
        <p className="mb-2 text-center text-[#22314f]">
          You will need a <a href="https://support.google.com/accounts/answer/1066447?hl=en" className="text-[#1e5fa6] underline" target="_blank" rel="noopener noreferrer">Google Authenticator</a> to complete this process
        </p>
        
        <p className="mb-2 text-center text-[#22314f]">Scan the QR code into your app</p>

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
        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* QR Code Section */}
        <div className="flex justify-center mb-4">
          {status === 'loading' ? (
            <div className="bg-gray-100 rounded p-4 flex items-center justify-center w-32 h-32">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Generating QR...</span>
              </div>
            </div>
          ) : mfaState.qrCodeUrl ? (
            <div className="bg-white rounded p-4 flex items-center justify-center border border-gray-200">
              <img 
                src={mfaState.qrCodeUrl} 
                alt="QR Code" 
                width={120} 
                height={120}
                className="rounded"
              />
            </div>
          ) : (
            <div className="bg-gray-200 rounded p-4 flex items-center justify-center w-32 h-32">
              <span className="text-sm text-gray-500">QR not available</span>
            </div>
          )}
        </div>

        {/* Secret Key (for manual entry) */}
        {mfaState.secret && (
          <div className="w-full mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Manual Entry Key:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border break-all">
              {mfaState.secret}
            </p>
          </div>
        )}

        {/* Regenerate Button */}
        {status === 'ready' && (
          <button
            onClick={regenerateMFA}
            disabled={isRegenerating}
            className="mb-4 text-[#1e5fa6] underline text-sm hover:text-[#174a7c] disabled:opacity-50"
          >
            {isRegenerating ? 'Regenerating...' : 'Regenerate QR Code'}
          </button>
        )}

        {/* Form */}
        {status === 'ready' && (
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the 6-digit authentication code:
              </label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                className="input"
                placeholder="123456"
                maxLength={6}
                disabled={isFormDisabled}
                required
              />
            </div>
                         <button 
               type="submit" 
               className="button-primary w-full"
               disabled={isFormDisabled || code.length !== 6}
             >
               {isFormDisabled ? (
                 <div className="flex items-center justify-center space-x-2">
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   <span>Validating...</span>
                 </div>
               ) : (
                 'Continue'
               )}
             </button>
          </form>
        )}

        {/* Success State */}
        {status === 'completed' && (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2 text-[#22314f]">Registration Complete!</h3>
            <p className="text-gray-600 mb-4">
              Your account has been created successfully with 2FA enabled.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-green-600">Redirecting to dashboard...</span>
            </div>
          </div>
        )}

        {/* Back Button */}
        {status === 'error' && (
          <button
            onClick={() => router.push('/register')}
            className="button-outline w-full mt-4"
          >
            Back to Registration
          </button>
        )}
      </div>
    </div>
  );
};

export default Register2FA; 