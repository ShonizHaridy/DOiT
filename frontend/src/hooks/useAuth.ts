import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '@/services/auth';
import { useAuthStore } from '@/store';
import type {
  SendOtpRequest,
  VerifyOtpRequest,
  AdminLoginRequest,
  AdminResetRequestRequest,
  AdminResetPasswordRequest,
} from '@/types/auth';

// ============================================
// CUSTOMER AUTHENTICATION (OTP)
// ============================================

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: SendOtpRequest) => authService.sendOtp(data),
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('access_token', data.accessToken);
      setAuth(data);
      
      // Invalidate and refetch user-related data
      queryClient.invalidateQueries({ queryKey: ['customer', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

// ============================================
// ADMIN AUTHENTICATION
// ============================================

export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: AdminLoginRequest) => authService.adminLogin(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.accessToken);
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ['admin', 'profile'] });
    },
  });
};

export const useAdminResetRequest = () => {
  return useMutation({
    mutationFn: (data: AdminResetRequestRequest) => 
      authService.adminResetRequest(data),
  });
};

export const useAdminResetPassword = () => {
  return useMutation({
    mutationFn: (data: AdminResetPasswordRequest) => 
      authService.adminResetPassword(data),
  });
};

// ============================================
// LOGOUT
// ============================================

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return () => {
    localStorage.removeItem('access_token');
    clearAuth();
    queryClient.clear();
    window.location.href = '/';
  };
};
