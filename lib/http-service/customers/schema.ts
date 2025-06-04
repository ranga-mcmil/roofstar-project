// lib/http-service/customers/schema.ts
/**
 * customers/schema.ts
 * 
 * This file contains the Zod validation schemas for customer-related data.
 */

import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  tin: z.string().optional(),
  vatNumber: z.string().optional(),
});

export const UpdateCustomerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  tin: z.string().optional(),
  vatNumber: z.string().optional(),
});