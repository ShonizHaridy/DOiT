import axios from 'axios';
import { useAuthStore } from '@/store';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your auth store
    const storeToken = useAuthStore.getState().accessToken;
    const token =
      storeToken ??
      (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      useAuthStore.getState().clearAuth();
      window.location.href = '/sign-in';
    }
    
    return Promise.reject(error);
  }
);
