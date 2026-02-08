// ============================================
// Service
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginatedAdminOrdersDto, AdminOrderDto, UpdateOrderStatusDto } from './dto/admin-orders.dto';

@Injectable()
export class AdminOrdersService {
  constructor(private prisma: PrismaService) {}

  async getOrders(
    page = 1,
    limit = 20,
    status?: string,
    search?: string,
  ): Promise<PaginatedAdminOrdersDto> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase().replace('-', '_');
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

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

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update order and create status history
    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
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

      return updatedOrder;
    });

    return this.getOrderById(id);
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
}

