/**
 * branches/types.ts
 * 
 * This file contains the TypeScript type definitions for branch-related data.
 * Updated to match API specification exactly.
 */

import { z } from 'zod';
import { CreateBranchSchema, UpdateBranchSchema } from './schema';

// Schema-derived types
export type CreateBranchPayload = z.infer<typeof CreateBranchSchema>;
export type UpdateBranchPayload = z.infer<typeof UpdateBranchSchema>;

// Address types - Updated to match API spec
export interface AddressDto {
  street: string;
  city: string;
  province: string;
  country?: string; // Made optional to match API spec
  postalCode?: string; // Made optional to match API spec
}

// Response types
export interface BranchDTO {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  address: AddressDto;
}

export interface BranchStatsResponse {
  numberOfBranches: number;
  numberOfActiveBranches: number;
  numberOfInactiveBranches: number;
  numberOfAssignedUsers: number;
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

export type CreateBranchResponse = BranchDTO;
export type GetBranchResponse = BranchDTO;
export type UpdateBranchResponse = BranchDTO;
export type GetBranchesResponse = PaginationResponse<BranchDTO>;