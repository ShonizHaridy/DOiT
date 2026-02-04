// ============================================
// DTOs
// ============================================

import { IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';
import { OptionalField } from 'src/common/decorators/transform.decorator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  fullAddress: string;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  fullAddress?: string;
}

export class CustomerProfileDto {
  id: string;
  email: string;
  fullName: string;
  @OptionalField()
  phoneNumber?: string;
  @OptionalField()
  avatarUrl?: string;
  status: string;
  @OptionalField()
  lastLogin?: Date;
  createdAt: Date;
  addresses: AddressDto[];
  totalOrders: number;
  totalSpending: number;
}

export class AddressDto {
  id: string;
  label: string;
  fullAddress: string;
  createdAt: Date;
}