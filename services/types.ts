// services/types.ts
export interface ApiResponse<T = Record<string, unknown>> {
  status: string;
  code: number;
  message: string;
  data: T;
  timestamp: string;
  durationMs: number;
}

export interface User {
  id: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  deviceFingerprint: string;
  forceReRegister?: boolean;
}

export interface MFARequest {
  challengeId: string;
  deviceFingerprint: string;
}

export interface CompleteMFARequest {
  code: string;
  challengeId: string;
  deviceFingerprint: string;
}

export interface LoginCompleteRequest {
  challengeId: string;
  code: string;
  deviceFingerprint: string;
}

export interface RegistrationStatus {
  status: 'pending' | 'completed' | 'failed';
  step?: string;
  message?: string;
}

export interface MFAConfig {
  qrCodeUrl: string;
  secret: string;
}

export interface ApiError {
  message: string;
  code?: number;
  details?: Record<string, unknown>;
}
