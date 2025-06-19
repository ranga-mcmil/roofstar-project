/**
 * batches/types.ts
 * 
 * This file contains the TypeScript type definitions for batch-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { CreateBatchSchema, UpdateBatchSchema } from './schema';

// Schema-derived types
export type CreateBatchPayload = z.infer<typeof CreateBatchSchema>;
export type UpdateBatchPayload = z.infer<typeof UpdateBatchSchema>;

// Response types from API based on OpenAPI spec
export interface BatchDTO {
  id: number;
  batchNumber: string;
  description: string;
  createdByName: string;
  createdDate: string; // date-time format
}

export interface BatchPaginationParams {
  branchId?: string;
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

export type CreateBatchResponse = BatchDTO;
export type GetBatchResponse = BatchDTO;
export type UpdateBatchResponse = BatchDTO;
export type GetBatchesResponse = PaginationResponse<BatchDTO>;