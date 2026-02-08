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
import { AdminCustomersService } from './admin-customers.service';
import { PaginatedAdminCustomersDto, AdminCustomerDto, UpdateCustomerStatusDto } from './dto/admin-customers.dto';

@Controller('admin/customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminCustomersController {
  constructor(private adminCustomersService: AdminCustomersService) {}

  @Get()
  async getCustomers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedAdminCustomersDto> {
    return this.adminCustomersService.getCustomers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
      search,
    );
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: string): Promise<AdminCustomerDto> {
    return this.adminCustomersService.getCustomerById(id);
  }

  @Put(':id/status')
  async updateCustomerStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerStatusDto,
  ) {
    return this.adminCustomersService.updateCustomerStatus(id, dto);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    return this.adminCustomersService.deleteCustomer(id);
  }

  @Get(':id/orders')
  async getCustomerOrders(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminCustomersService.getCustomerOrders(
      id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }
}