/**
 * stock-movements/types.ts
 * 
 * This file contains the TypeScript type definitions for stock movement-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { 
  StockMovementSearchSchema, 
  DateRangeParamsSchema, 
  StockMovementPaginationSchema 
} from './schema';

// Schema-derived types
export type StockMovementSearchPayload = z.infer<typeof StockMovementSearchSchema>;
export type DateRangeParams = z.infer<typeof DateRangeParamsSchema>;
export type StockMovementPaginationParams = z.infer<typeof StockMovementPaginationSchema>;

// Enhanced parameter types for specific endpoints
export interface UserStockMovementParams extends StockMovementPaginationParams, DateRangeParams {}
export interface ProductStockSummaryParams extends DateRangeParams {}
export interface BranchStockMovementParams extends StockMovementPaginationParams, DateRangeParams {}
export interface MovementTypeParams extends StockMovementPaginationParams, DateRangeParams {}

// Response types from API based on OpenAPI spec
export interface StockMovementDTO {
  id: number;
  productId: number;
  productName: string;
  orderId: number;
  orderNumber: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  movementType: string;
  movementDate: string; // date-time format
  createdById: string; // uuid format
  createdByName: string;
  notes?: string;
  reversedDate?: string; // date-time format
  reversed: boolean;
}

export interface StockMovementSummaryDTO {
  productId: number;
  productName: string;
  totalMovements: number;
  movementTypeCounts: Record<string, number>;
  totalIncrease: number;
  totalDecrease: number;
  netChange: number;
  reversedMovements: number;
  fromDate?: string; // date-time format
  toDate?: string; // date-time format
  currentStock: number;
  lastMovementDate?: string; // date-time format
  lastMovementType?: string;
}

export interface PaginationResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Response type aliases
export type GetAllStockMovementsResponse = PaginationResponse<StockMovementDTO>;
export type GetStockMovementResponse = StockMovementDTO;
export type GetUserStockMovementsResponse = PaginationResponse<StockMovementDTO>;
export type GetProductStockSummaryResponse = StockMovementSummaryDTO;
export type SearchStockMovementsResponse = PaginationResponse<StockMovementDTO>;
export type GetProductStockHistoryResponse = PaginationResponse<StockMovementDTO>;
export type GetOrderStockMovementsResponse = StockMovementDTO[];
export type GetStockMovementsByTypeResponse = PaginationResponse<StockMovementDTO>;
export type GetBranchStockMovementsResponse = PaginationResponse<StockMovementDTO>;