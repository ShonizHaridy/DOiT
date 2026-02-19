import axios from 'axios';
import { useAuthStore } from '@/store';
import {
  clearAdminAuthStorage,
  decodeJwtRole,
  getAdminAuthSnapshot,
  getCustomerAuthSnapshot,
} from '@/lib/auth-storage'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isAdminRoute = () =>
  typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')

const resolveCustomerToken = () => {
  const storeToken = useAuthStore.getState().accessToken
  const storeUserRole = useAuthStore.getState().user?.role
  const storeTokenRole = decodeJwtRole(storeToken)

  if (storeToken && (storeUserRole === 'customer' || storeTokenRole === 'customer')) {
    return storeToken
  }

  return getCustomerAuthSnapshot().token
}

const resolveTokenByContext = () => {
  if (typeof window === 'undefined') return null
  if (isAdminRoute()) return getAdminAuthSnapshot().token
  return resolveCustomerToken()
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = resolveTokenByContext()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers && 'Authorization' in config.headers) {
      delete (config.headers as Record<string, unknown>).Authorization
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
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const token = resolveTokenByContext()
      const errorHeaders = error.config?.headers as Record<string, unknown> | undefined
      const hadAuthHeader = Boolean(errorHeaders?.Authorization ?? errorHeaders?.authorization)

      if (!hadAuthHeader && !token) {
        return Promise.reject(error);
      }

      if (isAdminRoute()) {
        clearAdminAuthStorage()
        window.location.href = '/admin/login'
      } else {
        localStorage.removeItem('access_token')
        localStorage.removeItem('doit-auth')
        useAuthStore.getState().clearAuth()
      }
    }

    return Promise.reject(error);
  }
);
