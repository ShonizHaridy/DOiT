import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class AdminProfileDto {
  id: string;
  adminId: string;
  role: string;
  adminLevel: 'SUPER_ADMIN' | 'ADMIN';
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
}

export class UpdateAdminProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  role?: string;
}
