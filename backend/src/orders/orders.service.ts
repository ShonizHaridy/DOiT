// ============================================
// Service (All Fixes Applied)
// ============================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, CreateGuestOrderDto, OrderDto, PaginatedOrdersDto } from './dto/orders.dto';

// Type for order item data to ensure type safety
interface OrderItemData {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  vendor: string;
  type: string;
  gender: string;
  color: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  discount?: string;
  variantId: string;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // HELPERS
  // ============================================
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

  // ============================================
  // GUEST CHECKOUT
  // ============================================
  async createGuestOrder(dto: CreateGuestOrderDto): Promise<OrderDto> {
    const { email, fullName, phoneNumber, addressLabel, fullAddress, items, paymentMethod, notes, couponCode } = dto;

    // Check if customer exists, create if not
    let customer = await this.prisma.customer.findUnique({
      where: { email },
    });

    let customerId: string;
    let addressId: string;

    if (customer) {
      // Existing customer - create new address
      customerId = customer.id;
      const address = await this.prisma.address.create({
        data: {
          customerId,
          label: addressLabel,
          fullAddress,
        },
      });
      addressId = address.id;
    } else {
      // New guest customer - create customer and address in transaction
      const result = await this.prisma.$transaction(async (tx) => {
        const newCustomer = await tx.customer.create({
          data: {
            email,
            fullName,
            phoneNumber,
            status: 'ACTIVE',
          },
        });

        const newAddress = await tx.address.create({
          data: {
            customerId: newCustomer.id,
            label: addressLabel,
            fullAddress,
          },
        });

        return { customerId: newCustomer.id, addressId: newAddress.id };
      });

      customerId = result.customerId;
      addressId = result.addressId;
    }

    // Create order using the existing createOrder logic
    return this.createOrderInternal(customerId, {
      items,
      addressId,
      paymentMethod,
      notes,
      couponCode,
    });
  }

  // ============================================
  // AUTHENTICATED CUSTOMER ORDER
  // ============================================
  async createOrder(customerId: string, dto: CreateOrderDto): Promise<OrderDto> {
    // Validate address ownership if addressId provided
    if (dto.addressId) {
      const address = await this.prisma.address.findUnique({
        where: { id: dto.addressId },
      });

      if (!address || address.customerId !== customerId) {
        throw new BadRequestException('Invalid address or address does not belong to you');
      }
    }

    return this.createOrderInternal(customerId, dto);
  }

  // ============================================
  // INTERNAL ORDER CREATION (with all fixes)
  // ============================================
  private async createOrderInternal(
    customerId: string,
    dto: CreateOrderDto,
  ): Promise<OrderDto> {
    const { items, addressId, paymentMethod, notes, couponCode } = dto;

    // Validate and prepare order items
    const orderItemsData: OrderItemData[] = [];
    let subtotal = 0;

    // FIX 1: Stock validation happens OUTSIDE transaction for better error messages
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          variants: { where: { color: item.color, size: item.size } },
        },
      });

      if (!product || product.status !== 'PUBLISHED') {
        throw new BadRequestException(`Product ${item.productId} not found or unavailable`);
      }

      const variant = product.variants[0];
      if (!variant) {
        throw new BadRequestException(
          `Variant ${item.color}/${item.size} not available for ${product.nameEn}`,
        );
      }

      if (variant.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.nameEn}. Available: ${variant.quantity}, Requested: ${item.quantity}`,
        );
      }

      // FIX 2: Use number for calculations (store as integers in production)
      const price = Number(product.basePrice) * (1 - product.discountPercentage / 100);
      const originalPrice = Number(product.basePrice);
      const itemTotal = price * item.quantity;

      subtotal += itemTotal;

      orderItemsData.push({
        productId: product.id,
        productName: product.nameEn,
        productImage: product.images[0]?.url || '',
        sku: product.sku,
        vendor: product.vendor,
        type: product.type,
        gender: product.gender,
        color: item.color,
        size: item.size,
        price,
        originalPrice: product.discountPercentage > 0 ? originalPrice : undefined,
        quantity: item.quantity,
        discount: product.discountPercentage > 0 ? `${product.discountPercentage}% OFF` : undefined,
        variantId: variant.id,
      });
    }

    // Coupon logic
    let discount = 0;
    if (couponCode) {
      const offer = await this.prisma.offer.findUnique({ where: { code: couponCode } });
      if (offer && offer.status && new Date() >= offer.startDate && new Date() <= offer.endDate) {
        if (offer.type === 'PERCENTAGE') {
          discount = (subtotal * Number(offer.discountValue)) / 100;
          if (offer.maxDiscount && discount > Number(offer.maxDiscount)) {
            discount = Number(offer.maxDiscount);
          }
        } else if (offer.type === 'FIXED_AMOUNT') {
          discount = Number(offer.discountValue);
        }
      }
    }

    const shipping = 50;
    const total = subtotal - discount + shipping;
    const orderNumber = `#${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

    // FIX 3: Stock locking in transaction with re-validation
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order first
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          addressId,
          status: 'ORDER_PLACED',
          paymentMethod,
          subtotal,
          discount,
          shipping,
          total,
          currency: 'EGP',
          notes,
        },
      });

      // Create order items and update stock atomically
      for (const itemData of orderItemsData) {
        // FIX 4: Re-check stock inside transaction to prevent race conditions
        const currentVariant = await tx.productVariant.findUnique({
          where: { id: itemData.variantId },
        });

        if (!currentVariant || currentVariant.quantity < itemData.quantity) {
          throw new BadRequestException(
            `Stock changed during checkout for ${itemData.productName}. Please retry.`,
          );
        }

        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: itemData.productId,
            productName: itemData.productName,
            productImage: itemData.productImage,
            sku: itemData.sku,
            vendor: itemData.vendor,
            type: itemData.type,
            gender: itemData.gender,
            color: itemData.color,
            size: itemData.size,
            price: itemData.price,
            originalPrice: itemData.originalPrice,
            quantity: itemData.quantity,
            discount: itemData.discount,
          },
        });

        // Update stock
        await tx.productVariant.update({
          where: { id: itemData.variantId },
          data: { quantity: { decrement: itemData.quantity } },
        });
      }

      // Create status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: 'ORDER_PLACED',
          notes: 'Order placed successfully',
        },
      });

      return newOrder;
    });

    return this.getOrderById(customerId, order.id);
  }

  // ============================================
  // ORDER RETRIEVAL
  // ============================================
  async getOrders(
    customerId: string,
    page = 1,
    limit = 20,
    status?: string,
  ): Promise<PaginatedOrdersDto> {
    const skip = (page - 1) * limit;

    const where: any = { customerId };
    if (status && status !== 'all') {
      where.status = status.toUpperCase().replace('-', '_');
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: true, address: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map((order) => this.prepareOrderData(order)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(customerId: string, orderId: string): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, address: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.customerId !== customerId) throw new ForbiddenException('Unauthorized');

    return this.prepareOrderData(order);
  }

  // ============================================
  // GUEST ORDER TRACKING
  // ============================================
  async trackOrder(orderNumber: string): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, address: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    return this.prepareOrderData(order);
  }

  // ============================================
  // HELPER METHODS
  // ============================================
  private prepareOrderData(order: any): OrderDto {
    const { customerId, ...baseOrder } = order;

    return {
      ...baseOrder,
      subtotal: this.toNumber(baseOrder.subtotal) ?? 0,
      discount: this.toNumber(baseOrder.discount) ?? 0,
      shipping: this.toNumber(baseOrder.shipping) ?? 0,
      total: this.toNumber(baseOrder.total) ?? 0,
      paymentMethod: baseOrder.paymentMethod ?? undefined,
      deliveryDate: baseOrder.deliveryDate ?? undefined,
      trackingNumber: baseOrder.trackingNumber ?? undefined,
      notes: baseOrder.notes ?? undefined,
      address: order.address
        ? { label: order.address.label, fullAddress: order.address.fullAddress }
        : undefined,
      items: (order.items ?? []).map((item: any) => ({
        ...item,
        price: this.toNumber(item.price) ?? 0,
        originalPrice: this.toNumber(item.originalPrice),
        discount: item.discount ?? undefined,
      })),
    };
  }
}
