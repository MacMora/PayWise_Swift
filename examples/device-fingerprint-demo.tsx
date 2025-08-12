// examples/device-fingerprint-demo.tsx
'use client';

import { useState } from 'react';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { apiService } from '@/services/api';

export default function DeviceFingerprintDemo() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { fingerprint, loading, error, details } = useDeviceFingerprint();

  const handleTestAPI = async () => {
    if (!fingerprint) {
      alert('Fingerprint no disponible');
      return;
    }

    try {
      // Simular llamada a la API con el fingerprint
      console.log('🧪 Testing API with fingerprint:', fingerprint);
      
      // Aquí podrías hacer una llamada real a tu API
      const testData = {
        mobileNumber: '+1234567890',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        deviceFingerprint: fingerprint,
      };

      console.log('📤 Sending to API:', testData);
      
      // Simular respuesta exitosa
      setTimeout(() => {
        console.log('✅ API call successful with fingerprint');
        alert('✅ API call successful! Check console for details.');
      }, 1000);

    } catch (error) {
      console.error('❌ API test failed:', error);
      alert('❌ API test failed. Check console for details.');
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400';
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceText = (confidence?: number) => {
    if (!confidence) return 'Unknown';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔍 Device Fingerprint Demo
        </h1>

        {/* Estado Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Status</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                loading ? 'bg-yellow-400' : error ? 'bg-red-400' : 'bg-green-400'
              }`}></div>
              <span className="text-sm">
                {loading ? 'Generating...' : error ? 'Error' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Fingerprint ID</h3>
            <p className="text-sm font-mono break-all">
              {fingerprint || 'Not available'}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Confidence</h3>
            <p className={`text-sm font-semibold ${getConfidenceColor(details?.confidence)}`}>
              {getConfidenceText(details?.confidence)} ({details?.confidence?.toFixed(2) || 'N/A'})
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
            {fingerprint && (
              <p className="text-green-700 text-sm mt-2">
                ✅ Using fallback fingerprint: {fingerprint}
              </p>
            )}
          </div>
        )}

        {/* Detalles del Dispositivo */}
        {details && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                📱 Device Details
              </h2>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Información Básica */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 border-b pb-1">Basic Info</h4>
                
                {details.platform && (
                  <div>
                    <span className="text-gray-600 text-sm">Platform:</span>
                    <p className="font-medium">{details.platform}</p>
                  </div>
                )}

                {details.screenResolution && (
                  <div>
                    <span className="text-gray-600 text-sm">Screen:</span>
                    <p className="font-medium">{details.screenResolution}</p>
                  </div>
                )}

                {details.timezone && (
                  <div>
                    <span className="text-gray-600 text-sm">Timezone:</span>
                    <p className="font-medium">{details.timezone}</p>
                  </div>
                )}

                {details.languages && details.languages.length > 0 && (
                  <div>
                    <span className="text-gray-600 text-sm">Languages:</span>
                    <p className="font-medium">{details.languages.join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Hardware */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 border-b pb-1">Hardware</h4>
                
                {details.hardwareConcurrency && (
                  <div>
                    <span className="text-gray-600 text-sm">CPU Cores:</span>
                    <p className="font-medium">{details.hardwareConcurrency}</p>
                  </div>
                )}

                {details.deviceMemory && (
                  <div>
                    <span className="text-gray-600 text-sm">Memory:</span>
                    <p className="font-medium">{details.deviceMemory}GB</p>
                  </div>
                )}

                {details.battery && (
                  <div>
                    <span className="text-gray-600 text-sm">Battery API:</span>
                    <p className="font-medium">{details.battery}</p>
                  </div>
                )}

                {details.connection && (
                  <div>
                    <span className="text-gray-600 text-sm">Connection:</span>
                    <p className="font-medium">{details.connection}</p>
                  </div>
                )}
              </div>

              {/* Información Avanzada */}
              {isExpanded && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 border-b pb-1">Advanced</h4>
                  
                  {details.userAgent && (
                    <div>
                      <span className="text-gray-600 text-sm">User Agent:</span>
                      <p className="font-mono text-xs break-all">{details.userAgent}</p>
                    </div>
                  )}

                  {details.canvas && (
                    <div>
                      <span className="text-gray-600 text-sm">Canvas:</span>
                      <p className="font-mono text-xs">{details.canvas}</p>
                    </div>
                  )}

                  {details.webgl && (
                    <div>
                      <span className="text-gray-600 text-sm">WebGL:</span>
                      <p className="font-mono text-xs">{details.webgl}</p>
                    </div>
                  )}

                  {details.audio && (
                    <div>
                      <span className="text-gray-600 text-sm">Audio:</span>
                      <p className="font-mono text-xs">{details.audio}</p>
                    </div>
                  )}

                  {details.fonts && details.fonts.length > 0 && (
                    <div>
                      <span className="text-gray-600 text-sm">Fonts:</span>
                      <p className="font-medium text-xs">{details.fonts.join(', ')}</p>
                    </div>
                  )}

                  {details.plugins && details.plugins.length > 0 && (
                    <div>
                      <span className="text-gray-600 text-sm">Plugins:</span>
                      <p className="font-medium text-xs">{details.plugins.join(', ')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleTestAPI}
            disabled={!fingerprint || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🧪 Test API Call
          </button>

          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            🔄 Regenerate
          </button>

          <button
            onClick={() => console.log('Current fingerprint state:', { fingerprint, loading, error, details })}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            📊 Log to Console
          </button>
        </div>

        {/* Información Adicional */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">ℹ️ Information</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Fingerprint se genera automáticamente al cargar la página</li>
            <li>• Si FingerprintJS falla, se usa un fallback automático</li>
            <li>• Los detalles se muestran solo en modo desarrollo</li>
            <li>• El fingerprint es único por dispositivo y navegador</li>
            <li>• Se puede usar para identificar dispositivos en la API</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
