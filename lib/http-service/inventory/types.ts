/**
 * inventory/types.ts
 * 
 * This file contains the TypeScript type definitions for inventory-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { AddInventorySchema, AdjustInventorySchema } from './schema';

// Schema-derived types
export type AddInventoryPayload = z.infer<typeof AddInventorySchema>;
export type AdjustInventoryPayload = z.infer<typeof AdjustInventorySchema>;

// Response types from API based on OpenAPI spec
export interface InventoryDTO {
  id: number;
  productName: string;
  quantity: number;
  remarks: string;
}

export interface InventoryAdjustmentDTO {
  id: number;
  movementType: string;
  productName: string;
  quantity: number;
  reason: string;
}

export interface PaginationParams {
  pageNo?: number;
  pageSize?: number;
  page?: number;  // Some endpoints use 'page' instead of 'pageNo'
  size?: number;   // Some endpoints use 'size' instead of 'pageSize'
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

export type GetInventoryHistoryResponse = PaginationResponse<InventoryDTO>;
export type GetInventoryByBranchResponse = PaginationResponse<InventoryDTO>;
export type GetInventoryByBatchResponse = PaginationResponse<InventoryDTO>;
export type GetInventoryAdjustmentsResponse = PaginationResponse<InventoryAdjustmentDTO>;