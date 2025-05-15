import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  lastName: z.string(),
  password: z.string(),
  role: z.enum(["ROLE_SALES_REP", "ROLE_MANAGER", "ROLE_ADMIN"]),
  branchId: z.string(),
});

export const UpdateUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  lastName: z.string(),
  role: z.enum(["ROLE_SALES_REP", "ROLE_MANAGER", "ROLE_ADMIN"]), // Update with allowed roles
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});