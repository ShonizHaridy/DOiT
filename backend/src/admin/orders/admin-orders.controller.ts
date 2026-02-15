// ============================================
// Controller
// ============================================

import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles } from 'src/auth/decorators/auth.decorators';
import { AdminOrdersService } from './admin-orders.service';
import {
  PaginatedAdminOrdersDto,
  PaginatedAdminCustomOrdersDto,
  AdminOrderDto,
  AdminCustomOrderDto,
  UpdateOrderStatusDto,
  UpdateCustomOrderStatusDto,
} from './dto/admin-orders.dto';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminOrdersController {
  constructor(private adminOrdersService: AdminOrdersService) {}

  @Get()
  async getOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedAdminOrdersDto> {
    return this.adminOrdersService.getOrders(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
      search,
    );
  }

  @Get('custom')
  async getCustomOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedAdminCustomOrdersDto> {
    return this.adminOrdersService.getCustomOrders(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
      search,
    );
  }

  @Get('custom/:id')
  async getCustomOrderById(@Param('id') id: string): Promise<AdminCustomOrderDto> {
    return this.adminOrdersService.getCustomOrderById(id);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<AdminOrderDto> {
    return this.adminOrdersService.getOrderById(id);
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<AdminOrderDto> {
    return this.adminOrdersService.updateOrderStatus(id, dto);
  }

  @Put('custom/:id/status')
  async updateCustomOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCustomOrderStatusDto,
  ): Promise<AdminCustomOrderDto> {
    return this.adminOrdersService.updateCustomOrderStatus(id, dto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<void> {
    return this.adminOrdersService.deleteOrder(id);
  }
}
