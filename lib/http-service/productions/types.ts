/**
 * productions/types.ts
 * 
 * This file contains the TypeScript type definitions for production-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { CreateProductionSchema } from './schema';

// Schema-derived types
export type CreateProductionPayload = z.infer<typeof CreateProductionSchema>;

// Response types from API based on OpenAPI spec
export interface ProductionDTO {
  id: number;
  orderNumber: string;
  inventoryBatchNumber: string;
  quantity: number;
  remarks: string;
  createdAt: string; // date-time format
}

export interface ProductionPaginationParams {
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

export type CreateProductionResponse = ProductionDTO;
export type GetProductionsByBatchResponse = PaginationResponse<ProductionDTO>;