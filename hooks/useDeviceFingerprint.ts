// hooks/useDeviceFingerprint.ts
import { useEffect, useState, useCallback } from 'react';
import { APP_CONFIG } from '@/lib/config';

const loadFingerprintJS = () => import('@fingerprintjs/fingerprintjs');

interface FingerprintDetails {
  userAgent?: string;
  screenResolution?: string;
  platform?: string;
  languages?: string[];
  hardwareConcurrency?: number;
  timezone?: string;
  deviceMemory?: number;
  confidence?: number;
  canvas?: string;
  webgl?: string;
  audio?: string;
  fonts?: string[];
  plugins?: string[];
  battery?: string;
  connection?: string;
}

interface FingerprintResult {
  visitorId: string;
  confidence: {
    score: number;
  };
  components: Record<string, unknown>;
}

export const useDeviceFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<FingerprintDetails | null>(null);

  // Función para generar fallback fingerprint
  const generateFallbackFingerprint = useCallback((): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
    const screenRes = typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'unknown';
    
    // Crear hash simple basado en características básicas
    const fallbackData = `${userAgent}_${screenRes}_${timestamp}_${random}`;
    return `fallback_${btoa(fallbackData).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)}`;
  }, []);

  // Función para extraer detalles del dispositivo
  const extractDeviceDetails = useCallback((result: FingerprintResult): FingerprintDetails => {
    const components = result.components;
    
    // Función helper para extraer valores de componentes
    const getComponentValue = <T>(component: unknown): T | undefined => {
      if (component && typeof component === 'object' && 'value' in component) {
        return (component as { value: T }).value;
      }
      return undefined;
    };

    // Extraer características específicas del dispositivo
    const screenRes = getComponentValue<[number, number]>(components.screenResolution);
    const platform = getComponentValue<string>(components.platform);
    const languages = getComponentValue<string[]>(components.languages);
    const hardwareConcurrency = getComponentValue<number>(components.hardwareConcurrency);
    const timezone = getComponentValue<string>(components.timezone);
    const deviceMemory = getComponentValue<number>(components.deviceMemory);
    const canvas = getComponentValue<string>(components.canvas);
    const webgl = getComponentValue<string>(components.webgl);
    const audio = getComponentValue<string>(components.audio);
    const fonts = getComponentValue<string[]>(components.fonts);
    const plugins = getComponentValue<string[]>(components.plugins);
    
    // Obtener userAgent de múltiples fuentes
    const userAgent = getComponentValue<string>(components.userAgent) || 
                     (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown');

    // Información adicional del navegador
    const battery = typeof navigator !== 'undefined' && 'getBattery' in navigator ? 'Available' : 'Not available';
    const connection = typeof navigator !== 'undefined' && 'connection' in navigator ? 'Available' : 'Not available';

    return {
      userAgent,
      screenResolution: screenRes ? `${screenRes[0]}x${screenRes[1]}` : undefined,
      platform,
      languages,
      hardwareConcurrency,
      timezone,
      deviceMemory,
      confidence: result.confidence?.score || undefined,
      canvas: canvas ? canvas.substring(0, 20) + '...' : undefined,
      webgl: webgl ? webgl.substring(0, 20) + '...' : undefined,
      audio: audio ? audio.substring(0, 20) + '...' : undefined,
      fonts: fonts?.slice(0, 5), // Solo mostrar primeros 5
      plugins: plugins?.slice(0, 3), // Solo mostrar primeros 3
      battery,
      connection
    };
  }, []);

  useEffect(() => {
    const generateFingerprint = async () => {
      // Solo ejecutar en el cliente
      if (typeof window === 'undefined') {
        console.log('🔄 SSR detected, skipping fingerprint generation');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Starting device fingerprint generation...');
        
        // Cargar FingerprintJS dinámicamente
        const FingerprintJS = await loadFingerprintJS();
        
        // Configuración optimizada
        const fp = await FingerprintJS.load({
          debug: APP_CONFIG.FINGERPRINT.DEBUG,
        });
        
        console.log('✅ FingerprintJS loaded successfully');
        
        // Obtener fingerprint completo
        const result = await fp.get();
        
        console.log('🎯 Fingerprint generated:', {
          visitorId: result.visitorId,
          confidence: result.confidence?.score,
          componentsCount: Object.keys(result.components).length
        });
        
        // Establecer el fingerprint principal
        setFingerprint(result.visitorId);
        
        // Extraer y guardar detalles para debugging
        if (APP_CONFIG.FINGERPRINT.DEBUG) {
          const fingerprintDetails = extractDeviceDetails(result);
          setDetails(fingerprintDetails);
          
          console.log('🔍 Device Fingerprint Details:', {
            visitorId: result.visitorId,
            details: fingerprintDetails,
            confidence: result.confidence?.score
          });
        }
        
      } catch (err) {
        console.error('❌ Error generating fingerprint:', err);
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        
        // Generar fallback fingerprint
        const fallback = generateFallbackFingerprint();
        setFingerprint(fallback);
        
        console.warn('🔄 Using fallback fingerprint:', {
          fallback,
          reason: errorMessage
        });
        
        // Crear detalles básicos para fallback
        if (APP_CONFIG.FINGERPRINT.DEBUG) {
          const fallbackDetails: FingerprintDetails = {
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
            screenResolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'Unknown',
            platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
            languages: typeof navigator !== 'undefined' ? Array.from(navigator.languages) : ['Unknown'],
            hardwareConcurrency: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined,
            timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Unknown',
            deviceMemory: typeof navigator !== 'undefined' ? (navigator as unknown as Record<string, unknown>).deviceMemory as number : undefined,
            confidence: 0.1, // Baja confianza para fallback
          };
          setDetails(fallbackDetails);
        }
        
      } finally {
        setLoading(false);
        console.log('🏁 Fingerprint generation completed');
      }
    };

    generateFingerprint();
  }, [generateFallbackFingerprint, extractDeviceDetails]);

  return { fingerprint, loading, error, details };
};