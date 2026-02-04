import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SendOtpDto,
  VerifyOtpDto,
  AdminLoginDto,
  AdminResetRequestDto,
  AdminResetPasswordDto,
  AuthResponseDto,
  MessageResponseDto,
} from './dto/auth.dto';
import { Public } from './decorators/auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ============================================
  // CUSTOMER AUTH ENDPOINTS
  // ============================================

  @Public()
  @Post('customer/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto): Promise<MessageResponseDto> {
    return this.authService.sendOtp(dto);
  }

  @Public()
  @Post('customer/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<AuthResponseDto> {
    return this.authService.verifyOtp(dto);
  }

  // ============================================
  // ADMIN AUTH ENDPOINTS
  // ============================================

  @Public()
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() dto: AdminLoginDto): Promise<AuthResponseDto> {
    return this.authService.adminLogin(dto);
  }

  @Public()
  @Post('admin/reset-request')
  @HttpCode(HttpStatus.OK)
  async adminResetRequest(@Body() dto: AdminResetRequestDto): Promise<MessageResponseDto> {
    return this.authService.adminResetRequest(dto);
  }

  @Public()
  @Post('admin/reset-password')
  @HttpCode(HttpStatus.OK)
  async adminResetPassword(@Body() dto: AdminResetPasswordDto): Promise<MessageResponseDto> {
    return this.authService.adminResetPassword(dto);
  }
}