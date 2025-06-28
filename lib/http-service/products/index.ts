/**
 * products/index.ts
 * 
 * This file contains the ProductService class that implements API requests
 * to the product-controller endpoints.
 * Updated to match API specification exactly.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateProductPayload, 
  CreateProductResponse, 
  GetProductsResponse, 
  GetProductResponse, 
  UpdateProductPayload, 
  UpdateProductResponse,
  PaginationParams
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class ProductService extends BaseAPIRequests {

  /**
   * Get all products with pagination
   * 
   * GET /api/products
   */
  async get_products(params?: PaginationParams): Promise<APIResponse<GetProductsResponse>> {
    const defaultParams: PaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDir: 'asc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/products?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetProductsResponse>(response);
    } catch (error) {
      console.error('Product Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific product by ID
   * 
   * GET /api/products/{id}
   */
  async get_product(productId: number): Promise<APIResponse<GetProductResponse>> {
    const url = `/api/products/${productId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetProductResponse>(response);
    } catch (error) {
      console.error('Product Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new product
   * 
   * POST /api/products
   */
  async createProduct(payload: CreateProductPayload): Promise<APIResponse<CreateProductResponse>> {
    const url = '/api/products';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateProductResponse>(response);
    } catch (error) {
      console.error('Product Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing product
   * 
   * PUT /api/products/{id}
   */
  async updateProduct(payload: UpdateProductPayload, productId: number): Promise<APIResponse<UpdateProductResponse>> {
    const url = `/api/products/${productId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateProductResponse>(response);
    } catch (error) {
      console.error('Product Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a product
   * 
   * DELETE /api/products/{id}
   */
  async deleteProduct(productId: number): Promise<APIResponse<void>> {
    const url = `/api/products/${productId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Product Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get all products by category with pagination
   * 
   * GET /api/products/categories/{categoryId}/products
   */
  async getProductsByCategory(categoryId: number, params?: PaginationParams): Promise<APIResponse<GetProductsResponse>> {
    const defaultParams: PaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDir: 'asc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/products/categories/${categoryId}/products?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetProductsResponse>(response);
    } catch (error) {
      console.error('Product Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get all products by branch with pagination
   * 
   * GET /api/products/branches/{branchId}/products
   */
  async getProductsByBranch(branchId: string, params?: PaginationParams): Promise<APIResponse<GetProductsResponse>> {
    const defaultParams: PaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDir: 'asc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/products/branches/${branchId}/products?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetProductsResponse>(response);
    } catch (error) {
      console.error('Product Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const productService = new ProductService(apiClient, apiHeaderService);