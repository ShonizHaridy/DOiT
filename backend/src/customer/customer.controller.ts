// ============================================
// Controller
// ============================================

import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decorators/auth.decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CustomerService } from './customer.service';
import { AddressDto, CreateAddressDto, CustomerProfileDto, UpdateAddressDto, UpdateProfileDto } from './dto/customer.dto';

@Controller('customer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('profile')
  async getProfile(@GetUser('id') customerId: string): Promise<CustomerProfileDto> {
    return this.customerService.getProfile(customerId);
  }

  @Put('profile')
  async updateProfile(
    @GetUser('id') customerId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<CustomerProfileDto> {
    return this.customerService.updateProfile(customerId, dto);
  }

  @Get('addresses')
  async getAddresses(@GetUser('id') customerId: string): Promise<AddressDto[]> {
    return this.customerService.getAddresses(customerId);
  }

  @Post('addresses')
  async createAddress(
    @GetUser('id') customerId: string,
    @Body() dto: CreateAddressDto,
  ): Promise<AddressDto> {
    return this.customerService.createAddress(customerId, dto);
  }

  @Put('addresses/:id')
  async updateAddress(
    @GetUser('id') customerId: string,
    @Param('id') addressId: string,
    @Body() dto: UpdateAddressDto,
  ): Promise<AddressDto> {
    return this.customerService.updateAddress(customerId, addressId, dto);
  }

  @Delete('addresses/:id')
  async deleteAddress(
    @GetUser('id') customerId: string,
    @Param('id') addressId: string,
  ): Promise<void> {
    return this.customerService.deleteAddress(customerId, addressId);
  }
}
