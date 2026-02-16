// ============================================
// Service
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PaginatedAdminOrdersDto,
  PaginatedAdminCustomOrdersDto,
  AdminOrderDto,
  AdminCustomOrderDto,
  UpdateOrderStatusDto,
  UpdateCustomOrderStatusDto,
} from './dto/admin-orders.dto';

@Injectable()
export class AdminOrdersService {
  constructor(private prisma: PrismaService) {}

  private normalizeStatusFilter(status?: string): string[] {
    if (!status || status === 'all') {
      return [];
    }

    return status
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => value.toUpperCase().replace(/-/g, '_'));
  }

  private buildOrdersWhere(status?: string, search?: string): any {
    const where: any = {};
    const statusValues = this.normalizeStatusFilter(status);

    if (statusValues.length === 1) {
      where.status = statusValues[0];
    } else if (statusValues.length > 1) {
      where.status = { in: statusValues };
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return where;
  }

  private buildCustomOrdersWhere(status?: string, search?: string): any {
    const where: any = {};
    const statusValues = this.normalizeStatusFilter(status);

    if (statusValues.length === 1) {
      where.status = statusValues[0];
    } else if (statusValues.length > 1) {
      where.status = { in: statusValues };
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerId: { contains: search, mode: 'insensitive' } },
        { productType: { contains: search, mode: 'insensitive' } },
        { details: { contains: search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private toNumber(value: any): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    if (typeof value === 'object' && typeof value.toNumber === 'function') {
      return value.toNumber();
    }

    const result = Number(value);
    return Number.isNaN(result) ? undefined : result;
  }

  async getOrders(
    page = 1,
    limit = 20,
    status?: string,
    search?: string,
  ): Promise<PaginatedAdminOrdersDto> {
    const skip = (page - 1) * limit;
    const where = this.buildOrdersWhere(status, search);

    const [orders, total, stats] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          items: true,
          address: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
      this.getOrderStats(),
    ]);

    return {
      orders: orders.map((order) => this.transformOrder(order)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    };
  }

  async getOrderById(id: string): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        items: true,
        address: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.transformOrder(order);
  }

  async getCustomOrders(
    page = 1,
    limit = 20,
    status?: string,
    search?: string,
  ): Promise<PaginatedAdminCustomOrdersDto> {
    const skip = (page - 1) * limit;
    const where = this.buildCustomOrdersWhere(status, search);

    const [orders, total, stats] = await Promise.all([
      this.prisma.customOrder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.customOrder.count({ where }),
      this.getCustomOrderStats(),
    ]);

    const customerIds = Array.from(
      new Set(
        orders
          .map((order) => order.customerId)
          .filter((customerId) => customerId && !customerId.startsWith('guest-')),
      ),
    );

    const customers = customerIds.length
      ? await this.prisma.customer.findMany({
          where: { id: { in: customerIds } },
          select: { id: true, fullName: true, email: true },
        })
      : [];

    const customersMap = new Map(customers.map((customer) => [customer.id, customer]));

    return {
      orders: orders.map((order) =>
        this.transformCustomOrder(order, customersMap.get(order.customerId)),
      ),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    };
  }

  async getCustomOrderById(id: string): Promise<AdminCustomOrderDto> {
    const order = await this.prisma.customOrder.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Custom order not found');
    }

    const customer =
      order.customerId && !order.customerId.startsWith('guest-')
        ? await this.prisma.customer.findUnique({
            where: { id: order.customerId },
            select: { id: true, fullName: true, email: true },
          })
        : null;

    return this.transformCustomOrder(order, customer ?? undefined);
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update order and create status history
    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: {
          status: dto.status,
          trackingNumber: dto.trackingNumber,
          deliveryDate: dto.status === 'DELIVERED' ? new Date() : undefined,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status: dto.status,
          notes: dto.notes,
        },
      });

    });

    return this.getOrderById(id);
  }

  async updateCustomOrderStatus(
    id: string,
    dto: UpdateCustomOrderStatusDto,
  ): Promise<AdminCustomOrderDto> {
    const order = await this.prisma.customOrder.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Custom order not found');
    }

    await this.prisma.customOrder.update({
      where: { id },
      data: { status: dto.status },
    });

    return this.getCustomOrderById(id);
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.prisma.order.delete({ where: { id } });
  }

  async exportOrdersCsv(status?: string, search?: string): Promise<string> {
    const where = this.buildOrdersWhere(status, search);
    const orders = await this.prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Status',
      'Items',
      'Total',
      'Currency',
      'Payment Method',
      'Tracking Number',
      'Created At',
    ];

    const rows = orders.map((order) => [
      order.orderNumber,
      order.customer.fullName,
      order.customer.email,
      this.toUiStatus(order.status),
      order.items.length,
      Number(order.total).toFixed(2),
      order.currency,
      order.paymentMethod ?? '',
      order.trackingNumber ?? '',
      this.formatDateTime(order.createdAt),
    ]);

    return this.toCsv(headers, rows);
  }

  async exportCustomOrdersCsv(status?: string, search?: string): Promise<string> {
    const where = this.buildCustomOrdersWhere(status, search);
    const orders = await this.prisma.customOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const customerIds = Array.from(
      new Set(
        orders
          .map((order) => order.customerId)
          .filter((customerId) => customerId && !customerId.startsWith('guest-')),
      ),
    );

    const customers = customerIds.length
      ? await this.prisma.customer.findMany({
          where: { id: { in: customerIds } },
          select: { id: true, fullName: true, email: true },
        })
      : [];

    const customersMap = new Map(customers.map((customer) => [customer.id, customer]));

    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Status',
      'Product Type',
      'Color',
      'Gender',
      'Size',
      'Quantity',
      'Price',
      'Shipping',
      'Total',
      'Created At',
    ];

    const rows = orders.map((order) => {
      const customer = customersMap.get(order.customerId);
      const customerName =
        customer?.fullName ?? (order.customerId.startsWith('guest-') ? 'Guest' : order.customerId);
      const customerEmail = customer?.email ?? '';

      return [
        order.orderNumber,
        customerName,
        customerEmail,
        this.toUiStatus(order.status),
        order.productType,
        order.color,
        order.gender,
        order.size,
        order.quantity,
        this.toNumber(order.price) ?? '',
        this.toNumber(order.shipping) ?? '',
        this.toNumber(order.total) ?? '',
        this.formatDateTime(order.createdAt),
      ];
    });

    return this.toCsv(headers, rows);
  }

  private async getOrderStats() {
    const [total, active, completed, cancelled, revenueData] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({
        where: {
          status: { in: ['ORDER_PLACED', 'PROCESSED', 'SHIPPED'] },
        },
      }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.order.count({ where: { status: 'CANCELLED' } }),
      this.prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders: total,
      activeOrders: active,
      completedOrders: completed,
      cancelledOrders: cancelled,
      totalRevenue: Number(revenueData._sum.total || 0),
    };
  }

  private async getCustomOrderStats() {
    const [total, active, completed, cancelled, revenueData] = await Promise.all([
      this.prisma.customOrder.count(),
      this.prisma.customOrder.count({
        where: {
          status: { in: ['PENDING', 'APPROVED', 'IN_PRODUCTION'] },
        },
      }),
      this.prisma.customOrder.count({ where: { status: 'COMPLETED' } }),
      this.prisma.customOrder.count({ where: { status: 'CANCELLED' } }),
      this.prisma.customOrder.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders: total,
      activeOrders: active,
      completedOrders: completed,
      cancelledOrders: cancelled,
      totalRevenue: this.toNumber(revenueData._sum.total) ?? 0,
    };
  }

  private transformOrder(order: any): AdminOrderDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        id: order.customer.id,
        fullName: order.customer.fullName,
        email: order.customer.email,
      },
      status: order.status,
      itemsCount: order.items.length,
      total: Number(order.total),
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      deliveryDate: order.deliveryDate,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      address: order.address
        ? {
            label: order.address.label,
            fullAddress: order.address.fullAddress,
          }
        : undefined,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        productImage: item.productImage,
        sku: item.sku,
        vendor: item.vendor,
        color: item.color,
        size: item.size,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      statusHistory: order.statusHistory.map((history) => ({
        status: history.status,
        notes: history.notes,
        createdAt: history.createdAt,
      })),
    };
  }

  private transformCustomOrder(
    order: any,
    customer?: { id: string; fullName: string; email: string },
  ): AdminCustomOrderDto {
    return {
      id: order.id,
      customerId: order.customerId,
      orderNumber: order.orderNumber,
      productType: order.productType,
      color: order.color,
      gender: order.gender,
      size: order.size,
      quantity: order.quantity,
      details: order.details,
      referenceImages: Array.isArray(order.referenceImages) ? order.referenceImages : [],
      status: order.status,
      price: this.toNumber(order.price),
      shipping: this.toNumber(order.shipping),
      total: this.toNumber(order.total),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      customer,
    };
  }

  private toUiStatus(status: string): string {
    const value = status.toUpperCase();
    if (value === 'ORDER_PLACED' || value === 'PENDING') return 'New';
    if (value === 'PROCESSED' || value === 'APPROVED') return 'In progress';
    if (value === 'SHIPPED' || value === 'IN_PRODUCTION') return 'Shipped';
    if (value === 'DELIVERED' || value === 'COMPLETED') return 'Completed';
    if (value === 'CANCELLED') return 'Canceled';
    return status;
  }

  private formatDateTime(value: Date): string {
    return value.toISOString();
  }

  private escapeCsvValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    const text = String(value);

    if (/[",\n\r]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  private toCsv(headers: string[], rows: unknown[][]): string {
    const lines = [
      headers.map((value) => this.escapeCsvValue(value)).join(','),
      ...rows.map((row) => row.map((value) => this.escapeCsvValue(value)).join(',')),
    ];
    return `\uFEFF${lines.join('\n')}`;
  }
}

