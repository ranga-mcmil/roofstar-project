/**
 * users/types.ts
 * 
 * This file contains the TypeScript type definitions for user-related data.
 * Updated to match the actual API specification exactly.
 */

import { z } from 'zod';
import { 
  CreateUserSchema, 
  UpdateUserSchema, 
  ChangePasswordSchema, 
  ForgotPasswordSchema,
  UserPaginationSchema
} from './schema';

// Schema-derived types
export type CreateUserPayload = z.infer<typeof CreateUserSchema>;
export type UpdateUserPayload = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;
export type ForgotPasswordPayload = z.infer<typeof ForgotPasswordSchema>;
export type UserPaginationParams = z.infer<typeof UserPaginationSchema>;

// Response types matching actual API spec exactly
export interface UserDTO {
  id: string; // UUID format
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  branchId: string; // Present in API response
  branchName: string; // Present in API response
  isActive: boolean; // Present in API response
}

export interface PaginationResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Generic response types for various endpoints
export type GenericStringResponse = Record<string, string>;
export type GenericBooleanResponse = Record<string, boolean>;

// API Response types
export type CreateUserResponse = UserDTO;
export type GetUserResponse = UserDTO;
export type UpdateUserResponse = UserDTO;
export type GetUsersResponse = PaginationResponse<UserDTO>;
export type GetCurrentUserResponse = UserDTO;
export type ToggleUserStatusResponse = GenericBooleanResponse;
export type ChangePasswordResponse = GenericStringResponse;
export type ForgotPasswordResponse = GenericStringResponse;