import { apiClient } from '@/lib/axios-client';
import type {
  SendOtpRequest,
  VerifyOtpRequest,
  AdminLoginRequest,
  AdminResetRequestRequest,
  AdminResetPasswordRequest,
  AuthResponse,
  MessageResponse,
} from '@/types/auth';

// ============================================
// CUSTOMER AUTHENTICATION (OTP)
// ============================================

export const sendOtp = async (data: SendOtpRequest): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(
    '/api/auth/customer/send-otp',
    data
  );
  return response.data;
};

export const verifyOtp = async (data: VerifyOtpRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    '/api/auth/customer/verify-otp',
    data
  );
  return response.data;
};

// ============================================
// ADMIN AUTHENTICATION
// ============================================

export const adminLogin = async (data: AdminLoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    '/api/auth/admin/login',
    data
  );
  return response.data;
};

export const adminResetRequest = async (
  data: AdminResetRequestRequest
): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(
    '/api/auth/admin/reset-request',
    data
  );
  return response.data;
};

export const adminResetPassword = async (
  data: AdminResetPasswordRequest
): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(
    '/api/auth/admin/reset-password',
    data
  );
  return response.data;
};