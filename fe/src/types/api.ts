export interface ApiError {
  message: string;
  details?: string[];
}

// Product types
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  priceRange: string;
  formattedPrice: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  categories: string[];
  priceRanges: string[];
}

// Review types
export interface Review {
  id: number;
  productId: number;
  category: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: number;
    name: string;
    category: string;
    price: number;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: PaginationInfo;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment?: string;
}

// Analytics types
export interface StoreInsights {
  totalReviews: number;
  avgRating: number;
  bestCategory: string;
  mostReviewedPriceRange: string;
}

export interface CategoryRating {
  category: string;
  avgRating: number;
  reviewCount: number;
}

export interface AnalyticsResponse {
  storeInsights: StoreInsights;
  categoryRatings: CategoryRating[];
  ratingDistribution: Record<string, number>;
  priceRangeDistribution: Record<string, number>;
  productsNeedingAttention: any[];
  recentReviews: Review[];
}

// Auth types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
