// examples/registration-flow-demo.tsx
'use client';

import { useState } from 'react';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { apiService } from '@/services/api';

export default function RegistrationFlowDemo() {
  const [currentStep, setCurrentStep] = useState<'demo' | 'phone' | 'details' | 'verify'>('demo');
  const [formData, setFormData] = useState({
    mobileNumber: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'completed' | 'error'>('pending');

  const { fingerprint, loading: fingerprintLoading, error: fingerprintError } = useDeviceFingerprint();

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(null);
  };

  const handleStartDemo = () => {
    setCurrentStep('phone');
    setError(null);
  };

  const handlePhoneContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mobileNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }
    setCurrentStep('details');
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setError(null);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fingerprint) {
      setError('Device fingerprint is not ready. Please wait a moment and try again.');
      return;
    }

    const { mobileNumber, firstName, lastName, email } = formData;
    if (!mobileNumber.trim() || !firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🧪 Demo: Starting registration process...');
      
      // Simular llamada a la API
      const mockResponse = {
        data: {
          challengeId: `demo-challenge-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
        }
      };

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Demo: Registration successful:', mockResponse.data);
      
      setChallengeId(mockResponse.data.challengeId);
      setCurrentStep('verify');
      
      // Simular verificación automática después de 5 segundos
      setTimeout(() => {
        setVerificationStatus('completed');
        console.log('✅ Demo: Verification completed');
      }, 5000);
      
    } catch (err) {
      console.error('❌ Demo: Registration failed:', err);
      setError('Demo registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDemo = () => {
    setCurrentStep('demo');
    setFormData({
      mobileNumber: '',
      firstName: '',
      lastName: '',
      email: '',
    });
    setError(null);
    setChallengeId(null);
    setVerificationStatus('pending');
  };

  const isFormDisabled = fingerprintLoading || isSubmitting || !fingerprint;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔐 Registration Flow Demo
        </h1>

        {/* Demo Info */}
        {currentStep === 'demo' && (
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-semibold mb-4">Registration Flow Demo</h2>
            <p className="text-gray-600 mb-6">
              This demo shows the complete registration flow with API integration, 
              device fingerprinting, and multi-step form validation.
            </p>
            <button
              onClick={handleStartDemo}
              className="button-primary"
              disabled={fingerprintLoading}
            >
              {fingerprintLoading ? 'Preparing Demo...' : 'Start Demo'}
            </button>
          </div>
        )}

        {/* Registration Form */}
        {currentStep !== 'demo' && (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className={`flex items-center space-x-2 ${currentStep === 'phone' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'phone' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span>Phone</span>
              </div>
              <div className="w-8 h-1 bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span>Details</span>
              </div>
              <div className="w-8 h-1 bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'verify' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'verify' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span>Verify</span>
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

            {fingerprintError && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-800 text-sm">⚠️ Using basic security mode</span>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: Phone */}
            {currentStep === 'phone' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 1: Enter Phone Number</h3>
                <form onSubmit={handlePhoneContinue} className="space-y-4">
                  <input
                    className="input"
                    type="tel"
                    placeholder="Phone number (e.g., +1234567890)"
                    value={formData.mobileNumber}
                    onChange={handleInputChange('mobileNumber')}
                    disabled={isFormDisabled}
                    required
                  />
                  <button 
                    type="submit" 
                    className="button-primary w-full"
                    disabled={isFormDisabled}
                  >
                    {isFormDisabled ? 'Preparing...' : 'Continue'}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 'details' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 2: Complete Registration</h3>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Phone Number:</p>
                  <p className="font-medium text-gray-800">{formData.mobileNumber}</p>
                </div>

                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <input
                    className="input"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    disabled={isFormDisabled}
                    required
                  />

                  <input
                    className="input"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    disabled={isFormDisabled}
                    required
                  />

                  <input
                    className="input"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    disabled={isFormDisabled}
                    required
                  />

                  <div className="flex space-x-3">
                    <button 
                      type="button" 
                      className="button-outline flex-1"
                      onClick={handleBackToPhone}
                      disabled={isFormDisabled}
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="button-primary flex-1"
                      disabled={isFormDisabled}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 'verify' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 3: Verification</h3>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Registration Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Phone:</strong> {formData.mobileNumber}</p>
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Challenge ID:</strong> {challengeId}</p>
                    <p><strong>Fingerprint:</strong> {fingerprint ? '✅ Generated' : '❌ Not available'}</p>
                  </div>
                </div>

                {verificationStatus === 'pending' && (
                  <div className="text-center p-6">
                    <div className="text-4xl mb-4">📱</div>
                    <h4 className="font-semibold mb-2">Check your phone</h4>
                    <p className="text-gray-600 mb-4">
                      We sent a verification request to your phone. 
                      Please accept the request to continue sign up.
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-600">Waiting for verification...</span>
                    </div>
                  </div>
                )}

                {verificationStatus === 'completed' && (
                  <div className="text-center p-6">
                    <div className="text-green-500 text-6xl mb-4">✅</div>
                    <h4 className="font-semibold mb-2">Registration Successful!</h4>
                    <p className="text-gray-600 mb-4">
                      Your account has been created successfully. 
                      You can now proceed to complete your profile setup.
                    </p>
                  </div>
                )}

                {verificationStatus === 'error' && (
                  <div className="text-center p-6">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h4 className="font-semibold mb-2">Verification Failed</h4>
                    <p className="text-gray-600 mb-4">
                      Something went wrong during verification. Please try again.
                    </p>
                  </div>
                )}
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
                  formData,
                  fingerprint,
                  challengeId,
                  verificationStatus
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

