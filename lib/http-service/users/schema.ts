// lib/http-service/users/schema.ts - Updated to match actual API
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.string().min(1, 'Role is required'),
  branchId: z.string().optional(), // Optional UUID
});

export const UpdateUserSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.string().optional(), // Made optional to match API
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(1, 'New password is required'),
});

export const ForgotPasswordSchema = z.object({
  newPassword: z.string().min(1, 'New password is required'),
});