import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import {
  SendOtpDto,
  VerifyOtpDto,
  AdminLoginDto,
  AdminResetRequestDto,
  AdminResetPasswordDto,
  AuthResponseDto,
  MessageResponseDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // ============================================
  // CUSTOMER AUTH (OTP-based)
  // ============================================

  async sendOtp(dto: SendOtpDto): Promise<MessageResponseDto> {
    const { email } = dto;

    // Find or create customer
    let customer = await this.prisma.customer.findUnique({
      where: { email },
    });
    if (!customer) {
      // Auto-create customer on first sign-in
      customer = await this.prisma.customer.create({
        data: {
          email,
          fullName: email.split('@')[0], // Temporary name
        },
      });
    }

    // Generate 6-digit OTP
    const code = this.generateOtpCode();
    const otpExpiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
    const expiresAt = new Date(
      Date.now() + otpExpiryMinutes * 60 * 1000,
    );

    // Delete any existing unverified OTPs for this customer
    await this.prisma.oTPCode.deleteMany({
      where: {
        customerId: customer.id,
        verified: false,
      },
    });

    // Create new OTP
    await this.prisma.oTPCode.create({
      data: {
        customerId: customer.id,
        code,
        expiresAt,
      },
    });

    // For now, we'll return it in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${email}: ${code}`);
    }

    try {
      await this.emailService.sendOtp(email, code, otpExpiryMinutes);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to send OTP email', error);
      }
      throw new InternalServerErrorException('Failed to send OTP email');
    }

    return {
      message: 'OTP code sent successfully to your email',
    };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseDto> {
    const { email, code } = dto;

    // Find customer
    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid email or OTP code');
    }

    // Find valid OTP
    const otpRecord = await this.prisma.oTPCode.findFirst({
      where: {
        customerId: customer.id,
        code,
        verified: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid or expired OTP code');
    }

    const isFirstLogin = !customer.lastLogin;

    // Mark OTP as verified
    await this.prisma.oTPCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Update last login
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { lastLogin: new Date() },
    });

    if (isFirstLogin) {
      try {
        await this.emailService.sendAdminAlert(
          'New customer first login',
          `Customer: ${customer.fullName} (${customer.email})\nCustomer ID: ${customer.id}`,
        );
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          this.logger.warn(
            `Failed to send admin first-login email: ${(error as Error).message}`,
          );
        }
      }
    }

    // Generate JWT token
    const payload = {
      sub: customer.id,
      email: customer.email,
      role: 'customer',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: customer.id,
        email: customer.email,
        fullName: customer.fullName,
        role: 'customer',
      },
    };
  }

  // ============================================
  // ADMIN AUTH (JWT-based)
  // ============================================

  async adminLogin(dto: AdminLoginDto): Promise<AuthResponseDto> {
    const { adminId, password } = dto;

    // Find admin
    const admin = await this.prisma.admin.findUnique({
      where: { adminId },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: admin.id,
      adminId: admin.adminId,
      email: admin.email,
      role: 'admin',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: admin.id,
        email: admin.email,
        role: 'admin',
      },
    };
  }

  async adminResetRequest(dto: AdminResetRequestDto): Promise<MessageResponseDto> {
    const { adminCode, email } = dto;

    // Validate admin exists with this adminId (adminCode) and email
    const admin = await this.prisma.admin.findFirst({
      where: {
        adminId: adminCode,
        email,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin account not found with these credentials');
    }

    // Generate reset code
    const resetCode = this.generateOtpCode();

    // Save reset code
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { resetCode },
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`Reset code for ${email}: ${resetCode}`);
    }

    try {
      await this.emailService.sendAdminResetCode(email, resetCode);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to send reset code email', error);
      }
      throw new InternalServerErrorException('Failed to send reset code email');
    }

    return {
      message: 'Reset code sent to your email',
    };
  }

  async adminResetPassword(dto: AdminResetPasswordDto): Promise<MessageResponseDto> {
    const { adminCode, verificationCode, newPassword } = dto;

    // Find admin with matching adminCode and resetCode
    const admin = await this.prisma.admin.findFirst({
      where: {
        adminId: adminCode,
        resetCode: verificationCode,
      },
    });

    if (!admin) {
      throw new BadRequestException('Invalid admin code or verification code');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset code
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetCode: null,
      },
    });

    return {
      message: 'Password reset successfully',
    };
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private generateOtpCode(): string {
    const length = Number(process.env.OTP_LENGTH || 6);
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  async createDefaultAdmin() {
    const adminId = process.env.ADMIN_ID || 'admin001';
    const email = process.env.ADMIN_EMAIL || 'admin@doit.com';
    const password = process.env.ADMIN_PASSWORD || 'Change@123';

    const existingAdmin = await this.prisma.admin.findUnique({
      where: { adminId },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await this.prisma.admin.create({
        data: {
          adminId,
          email,
          password: hashedPassword,
        },
      });

      console.log('✅ Default admin created');
      console.log(`Admin ID: ${adminId}`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log('⚠️  PLEASE CHANGE THE DEFAULT PASSWORD!');
    }
  }
}
