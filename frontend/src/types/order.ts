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

export interface CreateGuestOrderRequest extends CreateOrderRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  addressLabel: string;
  fullAddress: string;
}

export interface CreateCustomOrderRequest {
  productType: string;
  color: string;
  gender: string;
  size: string;
  quantity: number;
  details: string;
  referenceImages?: string[];
}

// Response types
export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  sku: string;
  vendor: string;
  type?: string;
  gender?: string;
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
  createdAt: string;
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
  | 'PROCESSED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface AdminOrderCustomer {
  id: string;
  fullName: string;
  email: string;
}

export interface AdminOrder extends Order {
  customer?: AdminOrderCustomer;
  itemsCount?: number;
  statusHistory?: OrderStatusHistoryItem[];
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  };
}

export interface PaginatedCustomOrders {
  orders: CustomOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type CustomOrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'IN_PRODUCTION'
  | 'COMPLETED'
  | 'CANCELLED';

export interface AdminCustomOrderCustomer {
  id: string;
  fullName: string;
  email: string;
}

export interface AdminCustomOrder extends CustomOrder {
  status: CustomOrderStatus;
  customer?: AdminCustomOrderCustomer;
}

export interface AdminCustomOrdersResponse {
  orders: AdminCustomOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  };
}

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

export interface CustomOrder {
  id: string;
  customerId: string;
  orderNumber: string;
  productType: string;
  color: string;
  gender: string;
  size: string;
  quantity: number;
  details: string;
  referenceImages: string[];
  status: string;
  price?: number;
  shipping?: number;
  total?: number;
  createdAt: string;
  updatedAt: string;
}

