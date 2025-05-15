
/**
 * products/types.ts
 * 
 * This file contains the TypeScript type definitions for product-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { CreateProductSchema, UpdateProductSchema } from './schema';

// Schema-derived types
export type CreateProductPayload = z.infer<typeof CreateProductSchema>;
export type UpdateProductPayload = z.infer<typeof UpdateProductSchema>;

// Response types from API based on OpenAPI spec
export interface ProductDTO {
  id: number;
  name: string;
  code: number;
  colorName: string;
  thickness: number;
  branchId: string;
  productCategoryName: string;
  price: number;
  isActive: boolean;
  stockQuantity: number;
}

export interface PaginationParams {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface PaginationResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export type CreateProductResponse = ProductDTO;
export type GetProductResponse = ProductDTO;
export type UpdateProductResponse = ProductDTO;
export type GetProductsResponse = PaginationResponse<ProductDTO>;
