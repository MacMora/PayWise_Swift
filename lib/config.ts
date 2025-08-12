// lib/config.ts
export const APP_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  APP_NAME: 'PayWise Swift',
  VERSION: '1.0.0',
  
  // Configuración de autenticación
  AUTH: {
    TOKEN_KEY: 'accessToken',
    REFRESH_TOKEN_KEY: 'refreshToken',
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas en ms
  },
  
  // Configuración de device fingerprinting
  FINGERPRINT: {
    DEBUG: process.env.NODE_ENV === 'development',
    CONFIDENCE_THRESHOLD: 0.8,
  },
  
  // Configuración de UI
  UI: {
    TOAST_DURATION: 5000, // 5 segundos
    LOADING_TIMEOUT: 30000, // 30 segundos
    DEBOUNCE_DELAY: 300, // 300ms
  },
  
  // Configuración de validación
  VALIDATION: {
    MOBILE_REGEX: /^\+?[1-9]\d{1,14}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
  },
} as const;

// Tipos para la configuración
export type AppConfig = typeof APP_CONFIG;
