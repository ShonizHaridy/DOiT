import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email: string;
  role: 'customer' | 'admin';
  adminId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Fix: Use getOrThrow so TypeScript knows this is definitely a string
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub, role } = payload;

    if (role === 'customer') {
      const customer = await this.prisma.customer.findUnique({
        where: { id: sub },
        select: {
          id: true,
          email: true,
          fullName: true,
          status: true,
        },
      });

      if (!customer || customer.status !== 'ACTIVE') {
        throw new UnauthorizedException('Account is inactive or not found');
      }

      return { ...customer, role: 'customer' };
    } else if (role === 'admin') {
      const admin = await this.prisma.admin.findUnique({
        where: { id: sub },
        select: {
          id: true,
          adminId: true,
          email: true,
        },
      });

      if (!admin) {
        throw new UnauthorizedException('Admin account not found');
      }

      return { ...admin, role: 'admin' };
    }

    throw new UnauthorizedException('Invalid role');
  }
}