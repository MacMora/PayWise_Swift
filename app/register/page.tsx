"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { apiService } from '@/services/api';
import NotRegisteredModal from '../../components/NotRegisteredModal';

interface FormData {
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    mobileNumber: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'phone' | 'details'>('phone');
  const router = useRouter();

  const { fingerprint, loading: fingerprintLoading, error: fingerprintError } = useDeviceFingerprint();

  // Limpiar error cuando cambia el fingerprint
  useEffect(() => {
    if (fingerprint && error) {
      setError(null);
    }
  }, [fingerprint, error]);

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(null);
  };

  const handlePhoneContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mobileNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }
    setStep('details');
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fingerprint) {
      setError('Device fingerprint is not ready. Please wait a moment and try again.');
      return;
    }

    // Validar campos
    const { mobileNumber, firstName, lastName, email } = formData;
    if (!mobileNumber.trim() || !firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🚀 Starting registration process...');
      
      const response = await apiService.register({
        mobileNumber: mobileNumber.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        deviceFingerprint: fingerprint,
      });

      console.log('✅ Registration successful:', response.data);
      
      // Guardar challengeId en localStorage para el siguiente paso
      localStorage.setItem('registrationChallengeId', response.data.challengeId);
      localStorage.setItem('registrationPhone', mobileNumber);
      
      // Redirigir a la página de verificación
      router.push('/register/verify');
      
    } catch (err) {
      console.error('❌ Registration failed:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      
      // Si el error indica que el número ya está registrado, mostrar modal
      if (errorMessage.toLowerCase().includes('already registered') || 
          errorMessage.toLowerCase().includes('exists')) {
        setShowModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = fingerprintLoading || isSubmitting || !fingerprint;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fbff]">
      <img src="/logo_swift.png" alt="PayWise Swift" style={{ width: 120, marginBottom: 24 }} />
      
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-[#22314f]">
          {step === 'phone' ? "Let's Begin!" : "Complete Registration"}
        </h2>
        <p className="mb-4 text-[#22314f] text-center">
          {step === 'phone' 
            ? "Enter your PayWise phone number" 
            : "Please provide your information to complete registration"
          }
        </p>

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
            <div className="flex items-center space-x-2">
              <span className="text-yellow-800 text-sm">⚠️ Using basic security mode</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form className="w-full" onSubmit={step === 'phone' ? handlePhoneContinue : handleSubmit}>
          {step === 'phone' ? (
            <>
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
            </>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Phone Number:</p>
                <p className="font-medium text-[#22314f]">{formData.mobileNumber}</p>
              </div>

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
            </>
          )}
        </form>

        <p className="mt-4 text-sm text-[#22314f]">
          Already have an account?{' '}
          <button 
            className="cursor-pointer text-[#1e5fa6] underline" 
            style={{background:'none',border:'none'}} 
            onClick={() => router.push('/login')}
            disabled={isFormDisabled}
          >
            Log In
          </button>
        </p>
      </div>

      {showModal && (
        <NotRegisteredModal
          phone={formData.mobileNumber}
          onChange={() => setShowModal(false)}
          onSignup={() => {
            setShowModal(false);
            setStep('details');
          }}
        />
      )}
    </div>
  );
};

export default RegisterPage; 