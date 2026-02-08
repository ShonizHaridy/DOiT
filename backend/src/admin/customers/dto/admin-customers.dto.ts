// ============================================
// DTOs
// ============================================

import { IsEnum, IsOptional } from 'class-validator';

enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export class UpdateCustomerStatusDto {
  @IsEnum(CustomerStatus)
  status: CustomerStatus;
}

export class AdminCustomerDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  status: string;
  lastLogin?: Date;
  createdAt: Date;
  totalOrders: number;
  totalSpending: number;
  addresses: {
    id: string;
    label: string;
    fullAddress: string;
  }[];
}

export class PaginatedAdminCustomersDto {
  customers: AdminCustomerDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalCustomers: number;
    activeCustomers: number;
    blockedCustomers: number;
  };
}

