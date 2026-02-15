// ============================================
// DTOs
// ============================================

import { IsString, IsEnum, IsOptional } from 'class-validator';

enum OrderStatus {
  ORDER_PLACED = 'ORDER_PLACED',
  PROCESSED = 'PROCESSED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

enum CustomOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}

export class UpdateCustomOrderStatusDto {
  @IsEnum(CustomOrderStatus)
  status: CustomOrderStatus;
}

export class AdminOrderDto {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
  };
  status: string;
  itemsCount: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  deliveryDate?: Date;
  trackingNumber?: string;
  createdAt: Date;
  address?: {
    label: string;
    fullAddress: string;
  };
  items: any[];
  statusHistory: {
    status: string;
    notes?: string;
    createdAt: Date;
  }[];
}

export class PaginatedAdminOrdersDto {
  orders: AdminOrderDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  };
}

export class AdminCustomOrderDto {
  id: string;
  customerId: string;
  orderNumber: string;
  productType: string;
  color: string;
  gender: string;
  size: string;
  quantity: number;
  details: string;
  referenceImages: string[];
  status: string;
  price?: number;
  shipping?: number;
  total?: number;
  createdAt: Date;
  updatedAt: Date;
  customer?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export class PaginatedAdminCustomOrdersDto {
  orders: AdminCustomOrderDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  };
}

