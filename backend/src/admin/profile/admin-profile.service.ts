import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminProfileDto, UpdateAdminProfileDto } from './dto/admin-profile.dto';

interface AdminProfileMeta {
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role?: string;
}

@Injectable()
export class AdminProfileService {
  private readonly profileStorePath = join(process.cwd(), 'uploads', 'admin-profile.json');

  constructor(private prisma: PrismaService) {}

  async getProfile(adminUserId: string): Promise<AdminProfileDto> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminUserId },
      select: {
        id: true,
        adminId: true,
        email: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin account not found');
    }

    const store = this.readStore();
    const meta = store[admin.id] ?? {};

    return {
      id: admin.id,
      adminId: admin.adminId,
      role: meta.role?.trim() || 'Supervisor',
      fullName: meta.fullName?.trim() || admin.adminId,
      email: admin.email,
      phoneNumber: meta.phoneNumber?.trim() || '',
      avatarUrl: meta.avatarUrl?.trim() || undefined,
    };
  }

  async updateProfile(
    adminUserId: string,
    dto: UpdateAdminProfileDto,
  ): Promise<AdminProfileDto> {
    const current = await this.getProfile(adminUserId);
    const store = this.readStore();

    const nextEmail = dto.email?.trim() ?? current.email;
    const nextMeta: AdminProfileMeta = {
      fullName: dto.fullName?.trim() ?? current.fullName,
      phoneNumber: dto.phoneNumber?.trim() ?? current.phoneNumber,
      avatarUrl: dto.avatarUrl?.trim() ?? current.avatarUrl,
      role: dto.role?.trim() ?? current.role,
    };

    if (nextEmail !== current.email) {
      await this.prisma.admin.update({
        where: { id: adminUserId },
        data: { email: nextEmail },
      });
    }

    store[adminUserId] = nextMeta;
    this.writeStore(store);

    return this.getProfile(adminUserId);
  }

  private readStore(): Record<string, AdminProfileMeta> {
    if (!existsSync(this.profileStorePath)) {
      return {};
    }

    try {
      const raw = readFileSync(this.profileStorePath, 'utf8');
      const parsed = JSON.parse(raw) as Record<string, AdminProfileMeta>;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  private writeStore(store: Record<string, AdminProfileMeta>) {
    const directory = dirname(this.profileStorePath);
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
    writeFileSync(this.profileStorePath, JSON.stringify(store, null, 2), 'utf8');
  }
}
