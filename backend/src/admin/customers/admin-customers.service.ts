// ============================================
// Service
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginatedAdminCustomersDto, AdminCustomerDto, UpdateCustomerStatusDto } from './dto/admin-customers.dto';

@Injectable()
export class AdminCustomersService {
  constructor(private prisma: PrismaService) {}

  async getCustomers(
    page = 1,
    limit = 20,
    status?: string,
    search?: string,
  ): Promise<PaginatedAdminCustomersDto> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total, stats] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        include: {
          addresses: true,
          orders: {
            where: { status: 'DELIVERED' },
            select: { total: true },
          },
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
      this.getCustomerStats(),
    ]);

    return {
      customers: customers.map((customer) => this.transformCustomer(customer)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    };
  }

  async getCustomerById(id: string): Promise<AdminCustomerDto> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          where: { status: 'DELIVERED' },
          select: { total: true },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.transformCustomer(customer);
  }

  async updateCustomerStatus(id: string, dto: UpdateCustomerStatusDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.prisma.customer.update({
      where: { id },
      data: { status: dto.status },
    });

    return this.getCustomerById(id);
  }

  async deleteCustomer(id: string): Promise<void> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Don't allow deletion if customer has orders
    if (customer.orders.length > 0) {
      throw new Error('Cannot delete customer with existing orders. Block them instead.');
    }

    await this.prisma.customer.delete({ where: { id } });
  }

  async getCustomerOrders(customerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { customerId },
        include: {
          items: true,
          address: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where: { customerId } }),
    ]);

    return {
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: Number(order.total),
        itemsCount: order.items.length,
        createdAt: order.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async getCustomerStats() {
    const [total, active, blocked] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.customer.count({ where: { status: 'ACTIVE' } }),
      this.prisma.customer.count({ where: { status: 'BLOCKED' } }),
    ]);

    return {
      totalCustomers: total,
      activeCustomers: active,
      blockedCustomers: blocked,
    };
  }

  private transformCustomer(customer: any): AdminCustomerDto {
    const totalSpending = customer.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    return {
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      avatarUrl: customer.avatarUrl,
      status: customer.status,
      lastLogin: customer.lastLogin,
      createdAt: customer.createdAt,
      totalOrders: customer._count.orders,
      totalSpending,
      addresses: customer.addresses.map((addr) => ({
        id: addr.id,
        label: addr.label,
        fullAddress: addr.fullAddress,
      })),
    };
  }
}

