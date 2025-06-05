/**
 * users/schema.ts
 * 
 * This file contains the Zod validation schemas for user-related data.
 */

import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().min(1).email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(1),
  role: z.string().min(1),
  branchId: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  email: z.string().min(1).email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string(),
});

export const ChangePasswordSchema = z.object({
  email: z.string().min(1).email(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  newPassword: z.string().min(1),
});