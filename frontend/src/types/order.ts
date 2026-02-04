// Request types
export interface OrderItemInput {
  productId: string;
  color: string;
  size: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: OrderItemInput[];
  addressId?: string;
  paymentMethod?: string;
  notes?: string;
  couponCode?: string;
}

// Response types
export interface OrderItem {
  id: string;
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
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  deliveryDate?: Date;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  address?: {
    label: string;
    fullAddress: string;
  };
  items: OrderItem[];
}

export interface PaginatedOrders {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


// ... existing types

// ============================================
// ADMIN TYPES
// ============================================

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}