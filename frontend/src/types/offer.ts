export type OfferType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type OfferTargetUser = 'ALL' | 'NEW' | 'EXISTING';

export interface Offer {
  id: string;
  code: string;
  type: OfferType;
  discountValue: number;
  maxDiscount?: number;
  minPurchase?: number;
  usageLimit?: number;
  usageCount: number;
  targetedUser: OfferTargetUser;
  startDate: Date;
  endDate: Date;
  status: boolean;
  createdAt: Date;
}

export interface CreateOfferRequest {
  code: string;
  type: OfferType;
  discountValue: number;
  maxDiscount?: number;
  minPurchase?: number;
  usageLimit?: number;
  targetedUser: OfferTargetUser;
  startDate: Date;
  endDate: Date;
  status?: boolean;
}

export interface UpdateOfferRequest {
  code?: string;
  type?: OfferType;
  discountValue?: number;
  maxDiscount?: number;
  minPurchase?: number;
  usageLimit?: number;
  targetedUser?: OfferTargetUser;
  startDate?: Date;
  endDate?: Date;
  status?: boolean;
}

export interface PaginatedOffers {
  offers: Offer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}