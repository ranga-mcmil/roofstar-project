/**
 * users/types.ts
 * 
 * This file contains the TypeScript type definitions for user-related data.
 * Updated to match the actual API specification.
 */

import { z } from 'zod';
import { CreateUserSchema, UpdateUserSchema, ChangePasswordSchema, ForgotPasswordSchema } from './schema';

// Schema-derived types
export type CreateUserPayload = z.infer<typeof CreateUserSchema>;
export type UpdateUserPayload = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;
export type ForgotPasswordPayload = z.infer<typeof ForgotPasswordSchema>;

// Response types matching actual API spec
export interface UserDTO {
  id: string; // UUID format
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  branchId: string; // Added - present in API response
  branchName: string; // Added - present in API response
  isActive: boolean; // Added - present in API response
}

export interface UserPaginationParams {
  branchId?: string; // UUID format
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

export type CreateUserResponse = UserDTO;
export type GetUserResponse = UserDTO;
export type UpdateUserResponse = UserDTO;
export type GetUsersResponse = PaginationResponse<UserDTO>;