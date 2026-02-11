export type OfferType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUNDLE' | 'FREE_SHIPPING';
export type OfferScope =
  | 'ALL'
  | 'CATEGORY'
  | 'SUB_CATEGORY'
  | 'PRODUCT_LIST'
  | 'PRODUCT_TYPE';

export interface Offer {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  type: OfferType;
  discountValue: number;
  minCartValue?: number | null;
  maxDiscount?: number | null;
  applyTo: OfferScope;
  targetId?: string | null;
  startDate: string;
  endDate: string;
  startTime?: string | null;
  endTime?: string | null;
  totalUsageLimit?: number | null;
  perUserLimit?: number | null;
  currentUsage?: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferRequest {
  code: string;
  nameEn: string;
  nameAr: string;
  type: OfferType;
  discountValue: number;
  minCartValue?: number | null;
  maxDiscount?: number | null;
  applyTo: OfferScope;
  targetId?: string | null;
  startDate: string;
  endDate: string;
  startTime?: string | null;
  endTime?: string | null;
  totalUsageLimit?: number | null;
  perUserLimit?: number | null;
  status?: boolean;
}

export interface UpdateOfferRequest {
  nameEn?: string;
  nameAr?: string;
  type?: OfferType;
  discountValue?: number;
  minCartValue?: number | null;
  maxDiscount?: number | null;
  applyTo?: OfferScope;
  targetId?: string | null;
  startDate?: string;
  endDate?: string;
  startTime?: string | null;
  endTime?: string | null;
  totalUsageLimit?: number | null;
  perUserLimit?: number | null;
  status?: boolean;
}
