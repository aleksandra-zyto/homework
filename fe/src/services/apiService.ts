import { api } from "./apiClient";
import {
  LoginResponse,
  RegisterRequest,
  User,
  ProductsResponse,
  Product,
  ReviewsResponse,
  Review,
  CreateReviewRequest,
  AnalyticsResponse,
} from "../types/api";

export class ApiService {
  // Authentication endpoints
  static async login(email: string, password: string): Promise<LoginResponse> {
    console.log("Logging in with email:", email);
    return api.post<LoginResponse>("/api/auth/login", { email, password });
  }

  static async register(
    userData: RegisterRequest
  ): Promise<{ message: string; user: User; token: string }> {
    return api.post("/api/auth/register", userData);
  }

  static async getProfile(): Promise<{ user: User }> {
    return api.get("/api/auth/profile");
  }

  // Product endpoints
  static async getProducts(): Promise<ProductsResponse> {
    return api.get("/api/products");
  }

  static async getProductsByCategory(
    category: string
  ): Promise<{ products: Product[] }> {
    return api.get(`/api/products/category/${encodeURIComponent(category)}`);
  }

  static async getProductsByPriceRange(
    range: string
  ): Promise<{ products: Product[] }> {
    return api.get(`/api/products/price/${encodeURIComponent(range)}`);
  }

  static async getProduct(id: number): Promise<{ product: Product }> {
    return api.get(`/api/products/${id}`);
  }

  static async createProduct(productData: {
    name: string;
    category: string;
    price: number;
  }): Promise<{ message: string; product: Product }> {
    return api.post("/api/products", productData);
  }

  // Review endpoints
  static async getReviews(params?: {
    page?: number;
    limit?: number;
    category?: string;
    rating?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ReviewsResponse> {
    return api.get("/api/reviews", params);
  }

  static async getReview(id: number): Promise<{ review: Review }> {
    return api.get(`/api/reviews/${id}`);
  }

  static async createReview(
    reviewData: CreateReviewRequest
  ): Promise<{ message: string; review: Review }> {
    return api.post("/api/reviews", reviewData);
  }

  static async getAnalytics(): Promise<AnalyticsResponse> {
    return api.get("/api/reviews/analytics");
  }

  // User endpoints (if needed for admin features)
  static async getUser(id: number): Promise<User> {
    return api.get(`/api/users/${id}`);
  }

  static async createUser(userData: RegisterRequest): Promise<User> {
    return api.post("/api/users", userData);
  }

  static async deleteUser(id: number): Promise<{ id: number; email: string }> {
    return api.delete(`/api/users/${id}`);
  }
}
