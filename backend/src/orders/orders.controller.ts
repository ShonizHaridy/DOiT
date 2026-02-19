// ============================================
// Controller (Updated for Guest Checkout)
// ============================================

import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GetUser, Roles, Public } from 'src/auth/decorators/auth.decorators';
import { JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard } from '../auth/guards';
import {
  CouponValidationDto,
  CreateOrderDto,
  CreateGuestOrderDto,
  CreateCustomOrderDto,
  CustomOrderDto,
  OrderDto,
  PaginatedCustomOrdersDto,
  PaginatedOrdersDto,
  ShippingRateDto,
  ValidateCouponDto,
} from './dto/orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // ============================================
  // GUEST CHECKOUT (No login required)
  // ============================================
  @Public()
  @Post('guest')
  async createGuestOrder(
    @Body() dto: CreateGuestOrderDto,
  ): Promise<OrderDto> {
    return this.ordersService.createGuestOrder(dto);
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post('custom')
  async createCustomOrder(
    @Body() dto: CreateCustomOrderDto,
    @GetUser() requestUser?: { id?: string; role?: string },
  ): Promise<CustomOrderDto> {
    const customerId =
      requestUser?.role === 'customer' && typeof requestUser.id === 'string'
        ? requestUser.id
        : undefined;
    return this.ordersService.createCustomOrder(dto, customerId);
  }

  @Public()
  @Post('coupon/validate')
  async validateCoupon(@Body() dto: ValidateCouponDto): Promise<CouponValidationDto> {
    return this.ordersService.validateCoupon(dto.code, dto.subtotal);
  }

  @Public()
  @Get('shipping-rates')
  async getShippingRates(): Promise<ShippingRateDto[]> {
    return this.ordersService.getShippingRates();
  }

  // ============================================
  // AUTHENTICATED CUSTOMER ENDPOINTS
  // ============================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Post()
  async createOrder(
    @GetUser('id') customerId: string,
    @Body() dto: CreateOrderDto,
  ): Promise<OrderDto> {
    return this.ordersService.createOrder(customerId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Get()
  async getOrders(
    @GetUser('id') customerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ): Promise<PaginatedOrdersDto> {
    return this.ordersService.getOrders(
      customerId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Get('custom')
  async getCustomOrders(
    @GetUser('id') customerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ): Promise<PaginatedCustomOrdersDto> {
    return this.ordersService.getCustomOrders(
      customerId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Get(':id')
  async getOrderById(
    @GetUser('id') customerId: string,
    @Param('id') orderId: string,
  ): Promise<OrderDto> {
    return this.ordersService.getOrderById(customerId, orderId);
  }

  // ============================================
  // GUEST ORDER TRACKING (No login required)
  // ============================================
  @Public()
  @Get('track/:orderNumber')
  async trackGuestOrder(
    @Param('orderNumber') orderNumber: string,
  ): Promise<OrderDto> {
    return this.ordersService.trackOrder(orderNumber);
  }

  @Public()
  @Get('custom/track/:orderNumber')
  async trackCustomOrder(
    @Param('orderNumber') orderNumber: string,
  ): Promise<CustomOrderDto> {
    return this.ordersService.trackCustomOrder(orderNumber);
  }
}
