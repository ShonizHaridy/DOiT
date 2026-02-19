import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AdminLevelDtoValue,
  AdminUserDto,
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from './dto/admin-users.dto';

type AdminRow = {
  id: string;
  adminId: string;
  email: string;
  adminLevel: 'SUPER_ADMIN' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listAdmins(): Promise<AdminUserDto[]> {
    const admins = await this.prisma.admin.findMany({
      select: {
        id: true,
        adminId: true,
        email: true,
        adminLevel: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ adminLevel: 'asc' }, { createdAt: 'asc' }],
    });

    return admins.map((admin) => this.toDto(admin));
  }

  async createAdmin(dto: CreateAdminUserDto): Promise<AdminUserDto> {
    const normalizedAdminId = dto.adminId.trim();
    const normalizedEmail = dto.email.trim().toLowerCase();

    await this.ensureUniqueAdminFields(normalizedAdminId, normalizedEmail);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const created = await this.prisma.admin.create({
      data: {
        adminId: normalizedAdminId,
        email: normalizedEmail,
        password: hashedPassword,
        adminLevel: dto.adminLevel ?? AdminLevelDtoValue.ADMIN,
      },
      select: {
        id: true,
        adminId: true,
        email: true,
        adminLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.toDto(created);
  }

  async updateAdmin(
    id: string,
    dto: UpdateAdminUserDto,
    actingAdminId: string,
  ): Promise<AdminUserDto> {
    const existing = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        adminId: true,
        email: true,
        adminLevel: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Admin account not found');
    }

    const normalizedAdminId = dto.adminId?.trim();
    const normalizedEmail = dto.email?.trim().toLowerCase();

    if (normalizedAdminId || normalizedEmail) {
      await this.ensureUniqueAdminFields(
        normalizedAdminId ?? null,
        normalizedEmail ?? null,
        existing.id,
      );
    }

    if (dto.adminLevel === AdminLevelDtoValue.ADMIN && existing.adminLevel === 'SUPER_ADMIN') {
      const superAdminsCount = await this.prisma.admin.count({
        where: { adminLevel: 'SUPER_ADMIN' },
      });

      if (superAdminsCount <= 1) {
        throw new BadRequestException('At least one super admin must remain');
      }

      if (existing.id === actingAdminId) {
        throw new BadRequestException('You cannot remove your own super admin access');
      }
    }

    const updated = await this.prisma.admin.update({
      where: { id },
      data: {
        adminId: normalizedAdminId ?? undefined,
        email: normalizedEmail ?? undefined,
        adminLevel: dto.adminLevel ?? undefined,
        ...(dto.password
          ? {
              password: await bcrypt.hash(dto.password, 10),
              resetCode: null,
            }
          : {}),
      },
      select: {
        id: true,
        adminId: true,
        email: true,
        adminLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.toDto(updated);
  }

  async deleteAdmin(id: string, actingAdminId: string): Promise<void> {
    if (id === actingAdminId) {
      throw new BadRequestException('You cannot delete your own admin account');
    }

    const existing = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        adminLevel: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Admin account not found');
    }

    if (existing.adminLevel === 'SUPER_ADMIN') {
      const superAdminsCount = await this.prisma.admin.count({
        where: { adminLevel: 'SUPER_ADMIN' },
      });

      if (superAdminsCount <= 1) {
        throw new BadRequestException('Cannot delete the last super admin');
      }
    }

    await this.prisma.admin.delete({
      where: { id },
    });
  }

  private toDto(admin: AdminRow): AdminUserDto {
    return {
      id: admin.id,
      adminId: admin.adminId,
      email: admin.email,
      adminLevel:
        admin.adminLevel === 'SUPER_ADMIN'
          ? AdminLevelDtoValue.SUPER_ADMIN
          : AdminLevelDtoValue.ADMIN,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  private async ensureUniqueAdminFields(
    adminId?: string | null,
    email?: string | null,
    excludeId?: string,
  ): Promise<void> {
    if (adminId) {
      const existingByAdminId = await this.prisma.admin.findFirst({
        where: {
          adminId,
          ...(excludeId
            ? {
                id: { not: excludeId },
              }
            : {}),
        },
        select: { id: true },
      });

      if (existingByAdminId) {
        throw new BadRequestException('Admin ID already exists');
      }
    }

    if (email) {
      const existingByEmail = await this.prisma.admin.findFirst({
        where: {
          email,
          ...(excludeId
            ? {
                id: { not: excludeId },
              }
            : {}),
        },
        select: { id: true },
      });

      if (existingByEmail) {
        throw new BadRequestException('Admin email already exists');
      }
    }
  }
}
