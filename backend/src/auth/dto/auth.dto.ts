import { IsEmail, IsString, MinLength, Matches, IsNotEmpty, Length } from 'class-validator';

// ============================================
// CUSTOMER AUTH DTOs (OTP-based)
// ============================================

export class SendOtpDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP code must contain only digits' })
  code: string;
}

// ============================================
// ADMIN AUTH DTOs (JWT-based)
// ============================================

export class AdminLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Admin ID is required' })
  adminId: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class AdminResetRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Admin code is required' })
  adminCode: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

export class AdminResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Admin code is required' })
  adminCode: string;

  @IsString()
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  verificationCode: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain uppercase, lowercase, number and special character',
    },
  )
  newPassword: string;
}

// ============================================
// RESPONSE DTOs
// ============================================

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
    role: 'customer' | 'admin';
  };
}

export class MessageResponseDto {
  message: string;
}