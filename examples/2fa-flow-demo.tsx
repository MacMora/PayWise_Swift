// examples/2fa-flow-demo.tsx
'use client';

import { useState } from 'react';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';

export default function TwoFactorAuthDemo() {
  const [currentStep, setCurrentStep] = useState<'demo' | 'qr' | 'code' | 'success'>('demo');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fingerprint, loading: fingerprintLoading } = useDeviceFingerprint();

  const handleStartDemo = () => {
    setCurrentStep('qr');
    generateMockQR();
  };

  const generateMockQR = async () => {
    setIsGenerating(true);
    setError(null);

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // QR mock para demo
    const mockQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/PayWiseSwift:demo@paywise.com?secret=JBSWY3DPEHPK3PXP&issuer=PayWiseSwift`;
    const mockSecret = 'JBSWY3DPEHPK3PXP';

    setQrCodeUrl(mockQRUrl);
    setSecret(mockSecret);
    setIsGenerating(false);

    console.log('🧪 Demo: QR generated successfully');
  };

  const handleRegenerateQR = () => {
    generateMockQR();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    if (error) setError(null);
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsValidating(true);
    setError(null);

    // Simular validación
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Para demo, aceptar cualquier código que termine en 6
    if (code.endsWith('6')) {
      console.log('✅ Demo: Code validated successfully');
      setCurrentStep('success');
    } else {
      setError('Invalid authentication code. Try a code ending in 6 for demo.');
      setCode('');
    }

    setIsValidating(false);
  };

  const handleResetDemo = () => {
    setCurrentStep('demo');
    setQrCodeUrl(null);
    setSecret(null);
    setCode('');
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔐 Two-Factor Authentication Demo
        </h1>

        {/* Demo Info */}
        {currentStep === 'demo' && (
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-semibold mb-4">2FA Setup Demo</h2>
            <p className="text-gray-600 mb-6">
              This demo shows the complete 2FA setup flow with QR generation, 
              code validation, and registration completion.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Demo Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• QR code will be generated automatically</li>
                <li>• Use any 6-digit code ending in "6" for demo validation</li>
                <li>• All API calls are simulated for demonstration</li>
                <li>• Real implementation connects to actual API endpoints</li>
              </ul>
            </div>
            <button
              onClick={handleStartDemo}
              className="button-primary"
              disabled={fingerprintLoading}
            >
              {fingerprintLoading ? 'Preparing Demo...' : 'Start 2FA Demo'}
            </button>
          </div>
        )}

        {/* 2FA Flow */}
        {currentStep !== 'demo' && (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className={`flex items-center space-x-2 ${currentStep === 'qr' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'qr' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span>QR Setup</span>
              </div>
              <div className="w-8 h-1 bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'code' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span>Code Validation</span>
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

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: QR Generation */}
            {currentStep === 'qr' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 1: QR Code Setup</h3>
                
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Enable Two-Factor Authentication</h4>
                  <p className="text-gray-600 mb-4">
                    You will need a Google Authenticator app to complete this process.
                    Scan the QR code into your app.
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  {isGenerating ? (
                    <div className="bg-gray-100 rounded p-4 flex items-center justify-center w-48 h-48">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">Generating QR...</span>
                      </div>
                    </div>
                  ) : qrCodeUrl ? (
                    <div className="bg-white rounded p-4 flex items-center justify-center border border-gray-200">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        width={200} 
                        height={200}
                        className="rounded"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-200 rounded p-4 flex items-center justify-center w-48 h-48">
                      <span className="text-sm text-gray-500">QR not available</span>
                    </div>
                  )}
                </div>

                {/* Secret Key */}
                {secret && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-700 mb-2">Manual Entry Key:</h5>
                    <p className="font-mono text-sm bg-white p-3 rounded border break-all">
                      {secret}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Use this key if you can't scan the QR code
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleRegenerateQR}
                    disabled={isGenerating}
                    className="button-outline flex-1"
                  >
                    {isGenerating ? 'Generating...' : 'Regenerate QR'}
                  </button>
                  <button
                    onClick={() => setCurrentStep('code')}
                    disabled={!qrCodeUrl}
                    className="button-primary flex-1"
                  >
                    Continue to Code
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Code Validation */}
            {currentStep === 'code' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 2: Code Validation</h3>
                
                <div className="text-center mb-4">
                  <h4 className="font-semibold mb-2">Enter Authentication Code</h4>
                  <p className="text-gray-600">
                    Enter the 6-digit code from your authenticator app.
                  </p>
                  <div className="mt-2 p-2 bg-yellow-50 rounded">
                    <p className="text-sm text-yellow-700">
                      💡 Demo tip: Use any code ending in "6" for success
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmitCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      6-digit authentication code:
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={handleCodeChange}
                      className="input text-center text-2xl font-mono tracking-widest"
                      placeholder="123456"
                      maxLength={6}
                      disabled={isValidating}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="button-primary w-full"
                    disabled={isValidating || code.length !== 6}
                  >
                    {isValidating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Validating...</span>
                      </div>
                    ) : (
                      'Validate Code'
                    )}
                  </button>
                </form>

                <button
                  onClick={() => setCurrentStep('qr')}
                  className="button-outline w-full"
                >
                  Back to QR Setup
                </button>
              </div>
            )}

            {/* Step 3: Success */}
            {currentStep === 'success' && (
              <div className="text-center space-y-4">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold text-[#22314f]">2FA Setup Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your account has been successfully secured with two-factor authentication.
                  You can now access your PayWise Swift account.
                </p>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Demo Summary:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• QR code generated successfully</li>
                    <li>• Authentication code validated</li>
                    <li>• 2FA setup completed</li>
                    <li>• Account security enabled</li>
                  </ul>
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
                  qrCodeUrl: !!qrCodeUrl,
                  secret: !!secret,
                  code,
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
