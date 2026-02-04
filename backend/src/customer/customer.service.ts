// ============================================
// Service (more professional – minimal boilerplate with spread + cleanup)
// ============================================

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddressDto, CreateAddressDto, CustomerProfileDto, UpdateAddressDto, UpdateProfileDto } from './dto/customer.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getProfile(customerId: string): Promise<CustomerProfileDto> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        addresses: {
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          where: { status: 'DELIVERED' },
          select: { total: true },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const totalOrders = customer.orders.length;
    const totalSpending = customer.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    // Professional pattern: Spread Prisma data, remove unwanted relations, add computed fields
    // This avoids manually re-writing every field (DRY & maintainable)
    const { orders, ...profileBase } = customer; // Remove raw orders (we only need aggregates)

    const profileData = {
      ...profileBase,
      totalOrders,
      totalSpending,
      addresses: plainToInstance(AddressDto, customer.addresses),
    };

    return plainToInstance(CustomerProfileDto, profileData);
  }

  async updateProfile(customerId: string, dto: UpdateProfileDto): Promise<CustomerProfileDto> {
    await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber ?? null, // Allow clearing optional fields
        avatarUrl: dto.avatarUrl ?? null,
      },
    });

    return this.getProfile(customerId);
  }

  async getAddresses(customerId: string): Promise<AddressDto[]> {
    const addresses = await this.prisma.address.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    return plainToInstance(AddressDto, addresses);
  }

  async createAddress(customerId: string, dto: CreateAddressDto): Promise<AddressDto> {
    const address = await this.prisma.address.create({
      data: {
        customerId,
        label: dto.label,
        fullAddress: dto.fullAddress,
      },
    });

    return plainToInstance(AddressDto, address);
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    dto: UpdateAddressDto,
  ): Promise<AddressDto> {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.customerId !== customerId) {
      throw new ForbiddenException('Address not found or unauthorized');
    }

    const updated = await this.prisma.address.update({
      where: { id: addressId },
      data: {
        label: dto.label,
        fullAddress: dto.fullAddress,
      },
    });

    return plainToInstance(AddressDto, updated);
  }

  async deleteAddress(customerId: string, addressId: string): Promise<void> {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.customerId !== customerId) {
      throw new ForbiddenException('Address not found or unauthorized');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });
  }
}