// lib/http-service/users/schema.ts - Updated with role validation
import { z } from 'zod';
import { USER_ROLES } from '@/lib/types';

// Role validation schema
const RoleSchema = z.enum([
  USER_ROLES.SALES_REP,
  USER_ROLES.MANAGER,
  USER_ROLES.ADMIN
] as const);

export const CreateUserSchema = z.object({
  email: z.string().min(1).email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(1),
  role: RoleSchema,
  branchId: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  email: z.string().min(1).email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: RoleSchema,
});

export const ChangePasswordSchema = z.object({
  email: z.string().min(1).email(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  newPassword: z.string().min(1),
});

// Export the role schema for reuse
export { RoleSchema };