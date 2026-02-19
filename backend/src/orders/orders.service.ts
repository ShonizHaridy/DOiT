// ============================================
// Service (All Fixes Applied)
// ============================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../auth/email.service';
import {
  CreateOrderDto,
  CreateGuestOrderDto,
  CreateCustomOrderDto,
  CouponValidationDto,
  CustomOrderDto,
  OrderDto,
  PaginatedCustomOrdersDto,
  PaginatedOrdersDto,
  ShippingRateDto,
} from './dto/orders.dto';
import { EGYPT_GOVERNORATES } from 'src/common/constants/governorates.constant';

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
  private readonly logger = new Logger(OrdersService.name);
  private readonly governorateMap = new Map(
    EGYPT_GOVERNORATES.map((governorate) => [governorate.toLowerCase(), governorate]),
  );

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

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

  private normalizeOrderStatus(status?: string): string | undefined {
    if (!status || status === 'all') return undefined;
    return status.toUpperCase().replace(/-/g, '_');
  }

  private async resolveShippingPrice(governorate?: string): Promise<number> {
    const fallback = 50;
    const requestedGovernorate = governorate?.trim();
    const normalizedGovernorate = requestedGovernorate
      ? this.governorateMap.get(requestedGovernorate.toLowerCase()) ?? requestedGovernorate
      : undefined;
    if (!normalizedGovernorate) {
      return fallback;
    }

    const shippingRateRows = await this.prisma.$queryRaw<Array<{ price: unknown }>>`
      SELECT price
      FROM shipping_rates
      WHERE LOWER(governorate) = LOWER(${normalizedGovernorate})
        AND status = TRUE
      LIMIT 1
    `;
    const shippingRate = shippingRateRows[0];

    return this.toNumber(shippingRate?.price) ?? fallback;
  }

  private isOfferCurrentlyActive(offer: {
    status: boolean;
    startDate: Date;
    endDate: Date;
  }) {
    if (!offer.status) return false;
    const now = new Date();
    return now >= offer.startDate && now <= offer.endDate;
  }

  private async evaluateCoupon(
    subtotal: number,
    couponCode?: string,
  ): Promise<CouponValidationDto> {
    const normalizedCode = couponCode?.trim().toUpperCase() ?? '';
    const baseResult: CouponValidationDto = {
      valid: false,
      code: normalizedCode,
      discount: 0,
      freeShipping: false,
    };

    if (!normalizedCode) {
      return {
        ...baseResult,
        message: 'Coupon code is required',
      };
    }

    const offer = await this.prisma.offer.findFirst({
      where: {
        code: {
          equals: normalizedCode,
          mode: 'insensitive',
        },
      },
    });
    if (!offer) {
      return {
        ...baseResult,
        message: 'Invalid coupon code',
      };
    }
    if (!this.isOfferCurrentlyActive(offer)) {
      return {
        ...baseResult,
        message: 'Coupon is inactive or expired',
      };
    }

    const minCartValue = this.toNumber(offer.minCartValue);
    if (typeof minCartValue === 'number' && subtotal < minCartValue) {
      return {
        ...baseResult,
        message: `Minimum cart value is ${minCartValue} EGP`,
      };
    }

    let discount = 0;
    let freeShipping = false;

    if (offer.type === 'PERCENTAGE') {
      discount = (subtotal * Number(offer.discountValue)) / 100;
      if (offer.maxDiscount && discount > Number(offer.maxDiscount)) {
        discount = Number(offer.maxDiscount);
      }
    } else if (offer.type === 'FIXED_AMOUNT') {
      discount = Number(offer.discountValue);
    } else if (offer.type === 'FREE_SHIPPING') {
      freeShipping = true;
    } else {
      return {
        ...baseResult,
        message: 'Coupon type is not supported at checkout',
      };
    }

    return {
      valid: true,
      code: normalizedCode,
      discount: Math.max(0, Math.min(subtotal, discount)),
      freeShipping,
    };
  }

  // ============================================
  // GUEST CHECKOUT
  // ============================================
  async createGuestOrder(dto: CreateGuestOrderDto): Promise<OrderDto> {
    const {
      email,
      fullName,
      phoneNumber,
      addressLabel,
      fullAddress,
      items,
      paymentMethod,
      notes,
      couponCode,
      governorate,
    } = dto;

    // Check if customer exists, create if not
    let customer = await this.prisma.customer.findUnique({
      where: { email },
    });
    const isNewGuestCustomer = !customer;

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

    if (isNewGuestCustomer) {
      await this.notifyAdminNewCustomer({
        id: customerId,
        email,
        fullName,
      });
    }

    // Create order using the existing createOrder logic
    return this.createOrderInternal(customerId, {
      items,
      addressId,
      paymentMethod,
      notes,
      couponCode,
      governorate,
    });
  }

  private async resolveCustomOrderCustomerId(
    dto: CreateCustomOrderDto,
    authenticatedCustomerId?: string,
  ): Promise<string> {
    if (authenticatedCustomerId && authenticatedCustomerId.trim().length > 0) {
      return authenticatedCustomerId.trim();
    }

    if (dto.customerId && dto.customerId.trim().length > 0) {
      return dto.customerId.trim();
    }

    const email = dto.email?.trim().toLowerCase();
    if (!email) {
      return `guest-${Date.now().toString(36)}`;
    }

    const fullName = dto.fullName?.trim();
    const phoneNumber = dto.phoneNumber?.trim();

    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      const updateData: { fullName?: string; phoneNumber?: string } = {};
      const placeholderName = email.split('@')[0]?.trim().toLowerCase();
      const currentName = existingCustomer.fullName?.trim().toLowerCase();
      const canUpdateName = !currentName || currentName === placeholderName;

      if (fullName && fullName.length > 0 && canUpdateName) {
        updateData.fullName = fullName;
      }
      if (phoneNumber && phoneNumber.length > 0 && !existingCustomer.phoneNumber) {
        updateData.phoneNumber = phoneNumber;
      }

      if (Object.keys(updateData).length > 0) {
        await this.prisma.customer.update({
          where: { id: existingCustomer.id },
          data: updateData,
        });
      }

      return existingCustomer.id;
    }

    const fallbackName = fullName && fullName.length > 0 ? fullName : email.split('@')[0];
    const createdCustomer = await this.prisma.customer.create({
      data: {
        email,
        fullName: fallbackName || 'Guest',
        phoneNumber: phoneNumber && phoneNumber.length > 0 ? phoneNumber : undefined,
        status: 'ACTIVE',
      },
    });

    await this.notifyAdminNewCustomer({
      id: createdCustomer.id,
      email: createdCustomer.email,
      fullName: createdCustomer.fullName,
    });

    return createdCustomer.id;
  }

  async createCustomOrder(
    dto: CreateCustomOrderDto,
    authenticatedCustomerId?: string,
  ): Promise<CustomOrderDto> {
    const orderNumber = `#C${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000)}`;
    const customerId = await this.resolveCustomOrderCustomerId(dto, authenticatedCustomerId);

    const customOrder = await this.prisma.customOrder.create({
      data: {
        customerId,
        orderNumber,
        productType: dto.productType,
        color: dto.color ?? '',
        gender: dto.gender,
        size: dto.size ?? '',
        quantity: dto.quantity,
        details: dto.details ?? '',
        referenceImages: dto.referenceImages ?? [],
      },
    });

    await this.notifyAdminCustomOrder(customOrder.orderNumber, customOrder.customerId);

    return this.transformCustomOrder(customOrder);
  }

  async trackCustomOrder(orderNumber: string): Promise<CustomOrderDto> {
    const customOrder = await this.prisma.customOrder.findUnique({
      where: { orderNumber },
    });

    if (!customOrder) {
      throw new NotFoundException('Custom order not found');
    }

    return this.transformCustomOrder(customOrder);
  }

  async validateCoupon(code: string, subtotal: number): Promise<CouponValidationDto> {
    return this.evaluateCoupon(subtotal, code);
  }

  async getShippingRates(): Promise<ShippingRateDto[]> {
    const rates = await this.prisma.$queryRaw<
      Array<{ id: string; governorate: string; price: unknown; status: boolean }>
    >`
      SELECT id, governorate, price, status
      FROM shipping_rates
      WHERE status = TRUE
      ORDER BY governorate ASC
    `;

    return rates.map((rate) => ({
      id: rate.id,
      governorate: rate.governorate,
      price: this.toNumber(rate.price) ?? 0,
      status: rate.status,
    }));
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
    const { items, addressId, paymentMethod, notes, couponCode, governorate } = dto;

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

    const couponEvaluation = couponCode
      ? await this.evaluateCoupon(subtotal, couponCode)
      : {
          valid: false,
          code: '',
          discount: 0,
          freeShipping: false,
        };
    const discount = couponEvaluation.valid ? couponEvaluation.discount : 0;
    const shippingBasePrice = await this.resolveShippingPrice(governorate);
    const shipping = couponEvaluation.freeShipping ? 0 : shippingBasePrice;
    const total = Math.max(0, subtotal - discount + shipping);
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

    const createdOrder = await this.getOrderById(customerId, order.id);
    await this.notifyAdminNewOrder(createdOrder.orderNumber, createdOrder.total, customerId);

    return createdOrder;
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
    const normalizedStatus = this.normalizeOrderStatus(status);
    if (normalizedStatus) {
      where.status = normalizedStatus;
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

  async getCustomOrders(
    customerId: string,
    page = 1,
    limit = 20,
    status?: string,
  ): Promise<PaginatedCustomOrdersDto> {
    const skip = (page - 1) * limit;

    const where: any = { customerId };
    const normalizedStatus = this.normalizeOrderStatus(status);
    if (normalizedStatus) {
      where.status = normalizedStatus;
    }

    const [orders, total] = await Promise.all([
      this.prisma.customOrder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.customOrder.count({ where }),
    ]);

    return {
      orders: orders.map((order) => this.transformCustomOrder(order)),
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

  private transformCustomOrder(customOrder: any): CustomOrderDto {
    return {
      id: customOrder.id,
      customerId: customOrder.customerId,
      orderNumber: customOrder.orderNumber,
      productType: customOrder.productType,
      color: customOrder.color,
      gender: customOrder.gender,
      size: customOrder.size,
      quantity: customOrder.quantity,
      details: customOrder.details,
      referenceImages: Array.isArray(customOrder.referenceImages)
        ? (customOrder.referenceImages as string[])
        : [],
      status: customOrder.status,
      price: this.toNumber(customOrder.price),
      shipping: this.toNumber(customOrder.shipping),
      total: this.toNumber(customOrder.total),
      createdAt: customOrder.createdAt,
      updatedAt: customOrder.updatedAt,
    };
  }

  private async notifyAdminNewCustomer(customer: {
    id: string;
    email: string;
    fullName: string;
  }) {
    try {
      await this.emailService.sendAdminAlert(
        'New customer registered',
        `New customer: ${customer.fullName} (${customer.email})\nCustomer ID: ${customer.id}`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to send admin email for new customer ${customer.id}: ${(error as Error).message}`,
      );
    }
  }

  private async notifyAdminNewOrder(
    orderNumber: string,
    total: number,
    customerId: string,
  ) {
    try {
      await this.emailService.sendAdminAlert(
        `New order ${orderNumber}`,
        `A new order was placed.\nOrder: ${orderNumber}\nCustomer ID: ${customerId}\nTotal: ${total} EGP`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to send admin email for order ${orderNumber}: ${(error as Error).message}`,
      );
    }
  }

  private async notifyAdminCustomOrder(orderNumber: string, customerId: string) {
    try {
      await this.emailService.sendAdminAlert(
        `New custom order ${orderNumber}`,
        `A new custom order was placed.\nOrder: ${orderNumber}\nCustomer ID: ${customerId}`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to send admin email for custom order ${orderNumber}: ${(error as Error).message}`,
      );
    }
  }
}
