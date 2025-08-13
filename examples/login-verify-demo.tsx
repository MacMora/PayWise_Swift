// examples/login-verify-demo.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';

export default function LoginVerifyDemo() {
  const [currentStep, setCurrentStep] = useState<'demo' | 'verify' | 'processing' | 'success' | 'error'>('demo');
  const [code, setCode] = useState('');
  const [errorType, setErrorType] = useState<'none' | 'invalid' | 'expired' | 'session' | 'network'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const { fingerprint, loading: fingerprintLoading } = useDeviceFingerprint();

  // Simular datos de localStorage
  useEffect(() => {
    const mockChallengeId = `challenge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const mockPhone = '+1234567890';
    
    setChallengeId(mockChallengeId);
    setPhone(mockPhone);
    
    // Simular localStorage
    localStorage.setItem('loginChallengeId', mockChallengeId);
    localStorage.setItem('loginPhone', mockPhone);
  }, []);

  // Countdown para reenvío
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleStartDemo = () => {
    setCurrentStep('verify');
    setErrorType('none');
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setErrorType('none');
  };

  const simulateVerification = async (errorType: 'none' | 'invalid' | 'expired' | 'session' | 'network') => {
    setIsProcessing(true);
    setCurrentStep('processing');

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (errorType === 'none') {
      // Simular verificación exitosa
      const mockUserData = {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: phone,
        email: 'john.doe@example.com'
      };
      
      const mockTokens = {
        accessToken: `access_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        refreshToken: `refresh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      };

      setUserData({ ...mockUserData, ...mockTokens });
      setCurrentStep('success');
      
      console.log('🧪 Demo: Verification successful:', { user: mockUserData, tokens: mockTokens });
    } else {
      // Simular error
      setErrorType(errorType);
      setCurrentStep('error');
      
      console.log('🧪 Demo: Verification failed with error type:', errorType);
    }

    setIsProcessing(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || code.length !== 6) {
      setErrorType('invalid');
      setCurrentStep('error');
      return;
    }

    // Para demo, simular diferentes escenarios basados en el código
    if (code.endsWith('000')) {
      await simulateVerification('invalid');
    } else if (code.endsWith('111')) {
      await simulateVerification('expired');
    } else if (code.endsWith('222')) {
      await simulateVerification('session');
    } else if (code.endsWith('333')) {
      await simulateVerification('network');
    } else {
      await simulateVerification('none');
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    try {
      console.log('🔄 Demo: Resending verification code...');
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generar nuevo challengeId
      const newChallengeId = `challenge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setChallengeId(newChallengeId);
      
      // Iniciar countdown
      setResendCountdown(60);
      
      console.log('✅ Demo: Code resent successfully, new challengeId:', newChallengeId);
      
    } catch (err) {
      console.error('❌ Demo: Failed to resend code:', err);
    }
  };

  const handleResetDemo = () => {
    setCurrentStep('demo');
    setCode('');
    setErrorType('none');
    setUserData(null);
    setResendCountdown(0);
  };

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case 'invalid':
        return 'Invalid verification code. Please try again.';
      case 'expired':
        return 'Verification code has expired. Please request a new one.';
      case 'session':
        return 'Login session expired. Please start over.';
      case 'network':
        return 'Network error. Please check your connection and try again.';
      default:
        return 'Verification failed. Please try again.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔐 Login Verification Demo
        </h1>

        {/* Demo Info */}
        {currentStep === 'demo' && (
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-semibold mb-4">Login Verification Process Demo</h2>
            <p className="text-gray-600 mb-6">
              This demo shows the complete login verification flow with code validation, 
              token management, and error handling.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Demo Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Enter any 6-digit code to simulate successful verification</li>
                <li>• End with "000" for "invalid code" error</li>
                <li>• End with "111" for "expired code" error</li>
                <li>• End with "222" for "session expired" error</li>
                <li>• End with "333" for "network error"</li>
                <li>• Test resend functionality with countdown</li>
                <li>• All API calls are simulated for demonstration</li>
              </ul>
            </div>
            <button
              onClick={handleStartDemo}
              className="button-primary"
              disabled={fingerprintLoading}
            >
              {fingerprintLoading ? 'Preparing Demo...' : 'Start Verification Demo'}
            </button>
          </div>
        )}

        {/* Verification Flow */}
        {currentStep !== 'demo' && (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className={`flex items-center space-x-2 ${currentStep === 'verify' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'verify' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span>Enter Code</span>
              </div>
              <div className="w-8 h-1 bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'processing' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span>Verifying</span>
              </div>
              <div className="w-8 h-1 bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'success' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'success' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span>Complete</span>
              </div>
            </div>

            {/* Fingerprint Status */}
            {fingerprintLoading && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-800 text-sm">Preparing device security...</span>
                </div>
              </div>
            )}

            {/* Step 1: Code Verification */}
            {currentStep === 'verify' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 1: Enter Verification Code</h3>
                
                <div className="text-center mb-4">
                  <h4 className="font-semibold mb-2">Verify Your Login</h4>
                  <p className="text-gray-600">
                    Enter the 6-digit verification code sent to your phone
                  </p>
                </div>

                {/* Phone Display */}
                {phone && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Phone Number:</p>
                    <p className="font-medium text-[#22314f]">{phone}</p>
                  </div>
                )}

                {/* Challenge ID Display */}
                {challengeId && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Challenge ID:</p>
                    <p className="font-mono text-xs text-blue-800 break-all">{challengeId}</p>
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      6-digit verification code:
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={handleCodeChange}
                      className="input text-center text-2xl font-mono tracking-widest"
                      placeholder="123456"
                      maxLength={6}
                      disabled={isProcessing}
                      required
                    />
                  </div>

                  {/* Resend Code Button */}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isProcessing || resendCountdown > 0}
                    className="w-full text-sm text-[#1e5fa6] underline hover:text-[#174a7c] disabled:opacity-50"
                  >
                    {resendCountdown > 0 
                      ? `Resend code in ${resendCountdown}s` 
                      : 'Resend verification code'
                    }
                  </button>

                  <button 
                    type="submit" 
                    className="button-primary w-full"
                    disabled={isProcessing || code.length !== 6}
                  >
                    Verify & Login
                  </button>
                </form>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-2">Demo Tips:</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Any code → Success</li>
                    <li>• Ends with "000" → Invalid code</li>
                    <li>• Ends with "111" → Expired code</li>
                    <li>• Ends with "222" → Session expired</li>
                    <li>• Ends with "333" → Network error</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Processing */}
            {currentStep === 'processing' && (
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Step 2: Verifying Code</h3>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h4 className="font-semibold mb-2">Verifying Your Code</h4>
                    <p className="text-gray-600">
                      Checking verification code and authenticating...
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    🔍 Validating verification code...<br/>
                    🔐 Checking device fingerprint...<br/>
                    🎯 Authenticating user...<br/>
                    💾 Storing authentication tokens...
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {currentStep === 'success' && (
              <div className="text-center space-y-4">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold text-[#22314f]">Login Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Your login has been verified successfully.
                </p>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Authentication Details:</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>User ID:</strong> {userData?.id}</p>
                    <p><strong>Name:</strong> {userData?.firstName} {userData?.lastName}</p>
                    <p><strong>Email:</strong> {userData?.email}</p>
                    <p><strong>Phone:</strong> {userData?.mobileNumber}</p>
                    <p><strong>Access Token:</strong> {userData?.accessToken?.substring(0, 20)}...</p>
                    <p><strong>Refresh Token:</strong> {userData?.refreshToken?.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-green-600">Redirecting to dashboard...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {currentStep === 'error' && (
              <div className="text-center space-y-4">
                <div className="text-red-500 text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-semibold text-[#22314f]">Verification Failed</h3>
                <p className="text-gray-600 mb-4">
                  {getErrorMessage(errorType)}
                </p>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
                  <div className="text-sm text-red-700 space-y-1">
                    <p><strong>Error Type:</strong> {errorType.replace('_', ' ')}</p>
                    <p><strong>Code Entered:</strong> {code}</p>
                    <p><strong>Challenge ID:</strong> {challengeId}</p>
                    <p><strong>Device Fingerprint:</strong> {fingerprint ? 'Available' : 'Not available'}</p>
                    <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep('verify')}
                    className="button-outline flex-1"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleResetDemo}
                    className="button-primary flex-1"
                  >
                    Reset Demo
                  </button>
                </div>
              </div>
            )}

            {/* Demo Controls */}
            <div className="flex justify-center space-x-4 pt-6 border-t">
              <button
                onClick={handleResetDemo}
                className="button-outline"
              >
                Reset Demo
              </button>
              
              <button
                onClick={() => console.log('Current demo state:', {
                  currentStep,
                  code,
                  errorType,
                  challengeId,
                  phone,
                  userData: !!userData,
                  fingerprint: !!fingerprint
                })}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Log State
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
