
import axios from 'axios';

const BASE_URL = 'http://localhost:3005';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'inactive' | 'expired';
  expiresAt: string;
}

export const authAPI = {
  signup: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },

  signin: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin', { email, password });
    return response.data;
  },

  confirmEmail: async (token: string): Promise<void> => {
    await api.post('/auth/confirmemail', { token });
  },
};

export const planAPI = {
  checkSubscription: async (): Promise<Subscription | null> => {
    try {
      const response = await api.get('/plan/subs');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  createCheckoutSession: async (plan: string): Promise<{ url: string }> => {
    const response = await api.post('/plan/session', { plan });
    return response.data;
  },
};

export const codeAPI = {
  analyzeCode: async (code: string): Promise<{ result: 'vulnerable' | 'safe'; details?: string }> => {
    const response = await api.post('/analyze', { code });
    return response.data;
  },
};

export default api;
