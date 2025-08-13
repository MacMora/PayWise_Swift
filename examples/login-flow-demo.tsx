// examples/login-flow-demo.tsx
'use client';

import { useState } from 'react';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';

export default function LoginFlowDemo() {
  const [currentStep, setCurrentStep] = useState<'demo' | 'login' | 'processing' | 'success' | 'error'>('demo');
  const [phone, setPhone] = useState('');
  const [errorType, setErrorType] = useState<'none' | 'not_found' | 'new_device' | 'network' | 'rate_limit'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const { fingerprint, loading: fingerprintLoading } = useDeviceFingerprint();

  const handleStartDemo = () => {
    setCurrentStep('login');
    setErrorType('none');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
    setErrorType('none');
  };

  const simulateLogin = async (errorType: 'none' | 'not_found' | 'new_device' | 'network' | 'rate_limit') => {
    setIsProcessing(true);
    setCurrentStep('processing');

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (errorType === 'none') {
      // Simular login exitoso
      const mockChallengeId = `challenge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setChallengeId(mockChallengeId);
      setCurrentStep('success');
      
      console.log('🧪 Demo: Login successful, challengeId:', mockChallengeId);
    } else {
      // Simular error
      setErrorType(errorType);
      setCurrentStep('error');
      
      console.log('🧪 Demo: Login failed with error type:', errorType);
    }

    setIsProcessing(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setErrorType('not_found');
      setCurrentStep('error');
      return;
    }

    // Para demo, simular diferentes escenarios basados en el número
    if (phone.endsWith('000')) {
      await simulateLogin('not_found');
    } else if (phone.endsWith('111')) {
      await simulateLogin('new_device');
    } else if (phone.endsWith('222')) {
      await simulateLogin('network');
    } else if (phone.endsWith('333')) {
      await simulateLogin('rate_limit');
    } else {
      await simulateLogin('none');
    }
  };

  const handleResetDemo = () => {
    setCurrentStep('demo');
    setPhone('');
    setErrorType('none');
    setChallengeId(null);
  };

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case 'not_found':
        return 'This phone number is not registered in the system.';
      case 'new_device':
        return 'New device detected. Please complete additional verification.';
      case 'network':
        return 'Network error. Please check your connection and try again.';
      case 'rate_limit':
        return 'Too many login attempts. Please wait a moment and try again.';
      default:
        return 'Login failed. Please try again.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔐 Login Flow Demo
        </h1>

        {/* Demo Info */}
        {currentStep === 'demo' && (
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-semibold mb-4">Login Process Demo</h2>
            <p className="text-gray-600 mb-6">
              This demo shows the complete login flow with API integration, 
              device fingerprinting, and error handling.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Demo Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Enter any phone number to simulate successful login</li>
                <li>• End with "000" for "user not found" error</li>
                <li>• End with "111" for "new device" error</li>
                <li>• End with "222" for "network error"</li>
                <li>• End with "333" for "rate limit" error</li>
                <li>• All API calls are simulated for demonstration</li>
              </ul>
            </div>
            <button
              onClick={handleStartDemo}
              className="button-primary"
              disabled={fingerprintLoading}
            >
              {fingerprintLoading ? 'Preparing Demo...' : 'Start Login Demo'}
            </button>
          </div>
        )}

        {/* Login Flow */}
        {currentStep !== 'demo' && (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className={`flex items-center space-x-2 ${currentStep === 'login' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span>Login</span>
              </div>
              <div className="w-8 h-1 bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'processing' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span>Processing</span>
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

            {/* Step 1: Login Form */}
            {currentStep === 'login' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 1: Enter Phone Number</h3>
                
                <div className="text-center mb-4">
                  <h4 className="font-semibold mb-2">Login to Your Account</h4>
                  <p className="text-gray-600">
                    Enter your registered phone number to continue
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number:
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="input"
                      placeholder="Phone Number (e.g., +1234567890)"
                      disabled={isProcessing}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="button-primary w-full"
                    disabled={isProcessing || !phone.trim()}
                  >
                    Login
                  </button>
                </form>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-2">Demo Tips:</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Any number → Success</li>
                    <li>• Ends with "000" → User not found</li>
                    <li>• Ends with "111" → New device</li>
                    <li>• Ends with "222" → Network error</li>
                    <li>• Ends with "333" → Rate limit</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Processing */}
            {currentStep === 'processing' && (
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Step 2: Processing Login</h3>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h4 className="font-semibold mb-2">Processing Your Login Request</h4>
                    <p className="text-gray-600">
                      Verifying your credentials and device...
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    🔍 Checking device fingerprint...<br/>
                    📱 Validating phone number...<br/>
                    🔐 Processing authentication...
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
                  Your login request has been processed successfully.
                </p>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Login Details:</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Phone:</strong> {phone}</p>
                    <p><strong>Challenge ID:</strong> {challengeId}</p>
                    <p><strong>Device Fingerprint:</strong> {fingerprint ? 'Generated' : 'Not available'}</p>
                    <p><strong>Status:</strong> Ready for verification</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-green-600">Redirecting to verification...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {currentStep === 'error' && (
              <div className="text-center space-y-4">
                <div className="text-red-500 text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-semibold text-[#22314f]">Login Failed</h3>
                <p className="text-gray-600 mb-4">
                  {getErrorMessage(errorType)}
                </p>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
                  <div className="text-sm text-red-700 space-y-1">
                    <p><strong>Error Type:</strong> {errorType.replace('_', ' ')}</p>
                    <p><strong>Phone:</strong> {phone}</p>
                    <p><strong>Device Fingerprint:</strong> {fingerprint ? 'Available' : 'Not available'}</p>
                    <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep('login')}
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
                  phone,
                  errorType,
                  challengeId,
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
