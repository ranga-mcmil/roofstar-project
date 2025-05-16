/**
 * categories/index.ts
 * 
 * This file contains the ProductCategoryService class that implements API requests
 * to the product-category-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateCategoryPayload, 
  CreateCategoryResponse, 
  GetCategoriesResponse, 
  GetCategoryResponse, 
  UpdateCategoryPayload, 
  UpdateCategoryResponse 
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class ProductCategoryService extends BaseAPIRequests {

  /**
   * Get all product categories
   * 
   * GET /api/categories
   */
  async get_categories(): Promise<APIResponse<GetCategoriesResponse>> {
    const url = `/api/categories`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetCategoriesResponse>(response);
    } catch (error) {
      console.error('Product Category Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific product category by ID
   * 
   * GET /api/categories/{categoryId}
   */
  async get_category(categoryId: number): Promise<APIResponse<GetCategoryResponse>> {
    const url = `/api/categories/${categoryId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetCategoryResponse>(response);
    } catch (error) {
      console.error('Product Category Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new product category
   * 
   * POST /api/categories
   */
  async createCategory(payload: CreateCategoryPayload): Promise<APIResponse<CreateCategoryResponse>> {
    const url = '/api/categories';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateCategoryResponse>(response);
    } catch (error) {
      console.error('Product Category Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing product category
   * 
   * PUT /api/categories/{categoryId}
   */
  async updateCategory(payload: UpdateCategoryPayload, categoryId: number): Promise<APIResponse<UpdateCategoryResponse>> {
    const url = `/api/categories/${categoryId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateCategoryResponse>(response);
    } catch (error) {
      console.error('Product Category Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a product category
   * 
   * DELETE /api/categories/{categoryId}
   */
  async deleteCategory(categoryId: number): Promise<APIResponse<void>> {
    const url = `/api/categories/${categoryId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Product Category Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const productCategoryService = new ProductCategoryService(apiClient, apiHeaderService);
