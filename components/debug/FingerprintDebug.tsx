'use client';
// components/FingerprintDebug.tsx
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';

export default function FingerprintDebug() {
  const { fingerprint, loading, error, details } = useDeviceFingerprint();

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-sm border border-gray-700 shadow-lg z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">🔍 Device Fingerprint</h3>
        <div className={`w-2 h-2 rounded-full ${
          loading 
            ? 'bg-yellow-400' 
            : error 
              ? 'bg-red-400' 
              : 'bg-green-400'
        }`}></div>
      </div>
      
      {loading && (
        <p className="text-yellow-300">⏳ Generating fingerprint...</p>
      )}
      
      {error && (
        <div className="text-red-300">
          <p>❌ Error: {error}</p>
        </div>
      )}
      
      {fingerprint && (
        <div className="space-y-2">
          <div>
            <p className="text-green-300 font-medium">✅ Generated!</p>
            <p className="break-all bg-gray-800 p-1 rounded text-green-200 mt-1 text-xs">
              {fingerprint}
            </p>
          </div>
          
          {details && (
            <div className="text-gray-300 space-y-1 max-h-40 overflow-y-auto">
              {details.platform && (
                <p><span className="text-blue-300">Platform:</span> {details.platform}</p>
              )}
              {details.screenResolution && (
                <p><span className="text-blue-300">Screen:</span> {details.screenResolution}</p>
              )}
              {details.languages && details.languages.length > 0 && (
                <p><span className="text-blue-300">Languages:</span> {details.languages.join(', ')}</p>
              )}
              {details.timezone && (
                <p><span className="text-blue-300">Timezone:</span> {details.timezone}</p>
              )}
              {details.hardwareConcurrency && (
                <p><span className="text-blue-300">CPU Cores:</span> {details.hardwareConcurrency}</p>
              )}
              {details.deviceMemory && (
                <p><span className="text-blue-300">Memory:</span> {details.deviceMemory}GB</p>
              )}
              {details.confidence && (
                <p><span className="text-blue-300">Confidence:</span> {details.confidence.toFixed(2)}</p>
              )}
              {details.battery && (
                <p><span className="text-blue-300">Battery API:</span> {details.battery}</p>
              )}
              {details.connection && (
                <p><span className="text-blue-300">Connection:</span> {details.connection}</p>
              )}
              {details.fonts && details.fonts.length > 0 && (
                <p><span className="text-blue-300">Fonts:</span> {details.fonts.slice(0, 3).join(', ')}...</p>
              )}
              {details.plugins && details.plugins.length > 0 && (
                <p><span className="text-blue-300">Plugins:</span> {details.plugins.slice(0, 2).join(', ')}...</p>
              )}
              {details.canvas && (
                <p><span className="text-blue-300">Canvas:</span> {details.canvas}</p>
              )}
              {details.webgl && (
                <p><span className="text-blue-300">WebGL:</span> {details.webgl}</p>
              )}
              {details.audio && (
                <p><span className="text-blue-300">Audio:</span> {details.audio}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}