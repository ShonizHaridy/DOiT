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
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
  status: 'ACTIVE' | 'BLOCKED';
  totalOrders: number;
  totalSpending: number;
  lastLogin?: string;
  createdAt: string;
  addresses?: Array<{
    id: string;
    label: string;
    fullAddress: string;
  }>;
}

export interface PaginatedCustomers {
  customers: CustomerListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: {
    totalCustomers: number;
    activeCustomers: number;
    blockedCustomers: number;
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
