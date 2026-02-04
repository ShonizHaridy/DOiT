// Matching your backend DTOs EXACTLY

// Request types (what we send TO backend)
export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string; // 6 digits
}

export interface AdminLoginRequest {
  adminId: string;
  password: string;
}

export interface AdminResetRequestRequest {
  adminCode: string;
  email: string;
}

export interface AdminResetPasswordRequest {
  adminCode: string;
  verificationCode: string;
  newPassword: string;
}

// Response types (what backend sends back)
export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
    role: 'customer' | 'admin';
  };
}

export interface MessageResponse {
  message: string;
}