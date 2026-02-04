// Request types
export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface CreateAddressRequest {
  label: string;
  fullAddress: string;
}

export interface UpdateAddressRequest {
  label?: string;
  fullAddress?: string;
}

// Response types
export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  createdAt: Date;
}

export interface CustomerProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  status: string;
  lastLogin?: Date;
  createdAt: Date;
  addresses: Address[];
  totalOrders: number;
  totalSpending: number;
}


// ... existing types

// ============================================
// ADMIN TYPES
// ============================================

export interface CustomerListItem {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  totalOrders: number;
  totalSpending: number;
  lastLogin?: Date;
  createdAt: Date;
}

export interface PaginatedCustomers {
  customers: CustomerListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerStatistics {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  blockedCustomers: number;
  newCustomersThisMonth: number;
  topSpenders: Array<{
    id: string;
    fullName: string;
    email: string;
    totalSpending: number;
  }>;
}