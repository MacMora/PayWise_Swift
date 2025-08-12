// services/api.ts
import { 
  ApiResponse, 
  RegisterRequest, 
  MFARequest, 
  CompleteMFARequest, 
  LoginCompleteRequest,
  RegistrationStatus,
  MFAConfig,
  AuthTokens
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = API_URL || 'http://localhost:3000/api';
  }

  private async request<T = Record<string, unknown>>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token si existe
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json() as ApiResponse<T>;
      
      if (!response.ok) {
        console.error(`❌ API Error ${response.status}:`, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      console.log(`✅ API Success:`, data);
      return data;
    } catch (error) {
      console.error('💥 API request failed:', error);
      throw error;
    }
  }

  // AUTH ENDPOINTS
  async register(data: RegisterRequest): Promise<ApiResponse<{ challengeId: string }>> {
    return this.request<{ challengeId: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkRegistrationStatus(challengeId: string): Promise<ApiResponse<RegistrationStatus>> {
    return this.request<RegistrationStatus>(`/auth/register/status?challengeId=${challengeId}`);
  }

  async setupMFA(data: MFARequest): Promise<ApiResponse<MFAConfig>> {
    return this.request<MFAConfig>('/auth/register/mfa', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async retryMFA(data: MFARequest): Promise<ApiResponse<MFAConfig>> {
    return this.request<MFAConfig>('/auth/register/mfa/retry', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async completeMFA(data: CompleteMFARequest): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>('/auth/register/mfa/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async completeRegistration(challengeId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>('/auth/register/complete', {
      method: 'POST',
      body: JSON.stringify({ challengeId }),
    });
  }

  async login(mobileNumber: string): Promise<ApiResponse<{ challengeId: string }>> {
    return this.request<{ challengeId: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile_number: mobileNumber }),
    });
  }

  async completeLogin(data: LoginCompleteRequest): Promise<ApiResponse<AuthTokens>> {
    return this.request<AuthTokens>('/auth/login/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<ApiResponse<Record<string, never>>> {
    return this.request<Record<string, never>>('/auth/logout', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();