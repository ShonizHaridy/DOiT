// ============================================
// DTOs (Updated with Guest Checkout Support)
// ============================================

import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OptionalField, ToNumber } from 'src/common/decorators/transform.decorator';

// ============================================
// INPUT DTOs
// ============================================

export class OrderItemInput {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @IsOptional()
  @IsString()
  addressId?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class CreateGuestOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  // Guest customer info
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  // Address info
  @IsString()
  @IsNotEmpty()
  addressLabel: string;

  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}

// ============================================
// RESPONSE DTOs
// ============================================

class AddressSnapshotDto {
  label: string;
  fullAddress: string;
}

export class OrderItemDto {
  id: string;
  productName: string;
  productImage: string;
  sku: string;
  vendor: string;
  type: string;
  gender: string;
  color: string;
  size: string;

  @ToNumber()
  price: number;

  @OptionalField()
  @ToNumber()
  originalPrice?: number;

  quantity: number;

  @OptionalField()
  discount?: string;
}

export class OrderDto {
  id: string;
  orderNumber: string;
  status: string;

  @ToNumber()
  subtotal: number;

  @ToNumber()
  discount: number;

  @ToNumber()
  shipping: number;

  @ToNumber()
  total: number;

  currency: string;

  @OptionalField()
  paymentMethod?: string;

  @OptionalField()
  deliveryDate?: Date;

  @OptionalField()
  trackingNumber?: string;

  @OptionalField()
  notes?: string;

  createdAt: Date;

  @OptionalField()
  @Type(() => AddressSnapshotDto)
  address?: AddressSnapshotDto;

  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class PaginatedOrdersDto {
  @Type(() => OrderDto)
  orders: OrderDto[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}