/**
 * users/schema.ts
 * 
 * This file contains the Zod validation schemas for user-related data.
 * Updated to match actual API specification exactly.
 */

import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string()
    .email({ message: 'Enter a valid email address' })
    .min(1, { message: 'Email is required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  branchId: z.string().uuid({ message: 'Branch ID must be a valid UUID' }).optional(),
});

export const UpdateUserSchema = z.object({
  email: z.string()
    .email({ message: 'Enter a valid email address' })
    .min(1, { message: 'Email is required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(1, { message: 'New password is required' }),
});

export const ForgotPasswordSchema = z.object({
  newPassword: z.string().min(1, { message: 'New password is required' }),
});

// Pagination schema
export const UserPaginationSchema = z.object({
  branchId: z.string().uuid().optional(),
  pageNo: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().default('id'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
});