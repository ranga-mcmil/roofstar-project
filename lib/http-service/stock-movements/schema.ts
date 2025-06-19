/**
 * stock-movements/schema.ts
 * 
 * This file contains the Zod validation schemas for stock movement-related data.
 */

import { z } from 'zod';

// Search parameters schema
export const StockMovementSearchSchema = z.object({
  productId: z.number().int().optional(),
  productName: z.string().optional(),
  orderId: z.number().int().optional(),
  orderNumber: z.string().optional(),
  movementType: z.string().optional(),
  branchId: z.string().uuid().optional(),
  createdById: z.string().uuid().optional(),
  createdByName: z.string().optional(),
  isReversed: z.boolean().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  pageNo: z.number().int().min(0).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

// Date range parameters schema
export const DateRangeParamsSchema = z.object({
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

// Pagination parameters schema
export const StockMovementPaginationSchema = z.object({
  pageNo: z.number().int().min(0).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});