// ============================================
// Controller (Updated for Guest Checkout)
// ============================================

import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GetUser, Roles, Public } from 'src/auth/decorators/auth.decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CreateOrderDto, CreateGuestOrderDto, OrderDto, PaginatedOrdersDto } from './dto/orders.dto';
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
}