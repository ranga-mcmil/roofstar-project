/**
 * inventory/types.ts
 * 
 * This file contains the TypeScript type definitions for inventory-related data
 * based on the OpenAPI specification.
 * Updated to match API spec exactly.
 */

import { z } from 'zod';
import { AddInventorySchema, AdjustInventorySchema } from './schema';

// Schema-derived types
export type AddInventoryPayload = z.infer<typeof AddInventorySchema>;
export type AdjustInventoryPayload = z.infer<typeof AdjustInventorySchema>;

// Response types from API based on OpenAPI spec - Updated to match exactly
export interface InventoryDTO {
  id: number;
  productName: string;
  createdAt: string; // Added missing field
  quantity: number;
  width?: number; // Added missing field
  length?: number; // Added missing field
  weight?: number; // Added missing field
  batchNumber: string; // Added missing field
  totalStockQuantity: number; // Added missing field
  remarks?: string;
}

export interface InventoryAdjustmentDTO {
  id: number;
  movementType: string;
  productName: string;
  quantity: number;
  createdAt: string; // Added missing field
  width?: number; // Added missing field
  length?: number; // Added missing field
  weight?: number; // Added missing field
  totalStockQuantity: number; // Added missing field
  reason: string; // Changed from 'remarks' to 'reason' to match API
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