/**
 * referrals/schema.ts
 * 
 * This file contains the Zod validation schemas for referral-related data.
 * Based on the OpenAPI specification.
 */

import { z } from 'zod';

export const CreateReferralSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name must be at most 100 characters' }),
  phoneNumber: z.string()
    .min(10, { message: 'Phone number must be at least 10 characters' })
    .max(15, { message: 'Phone number must be at most 15 characters' })
    .regex(/^[+]?[0-9\s\-()]{10,15}$/, { 
      message: 'Enter a valid phone number' 
    }),
  address: z.string()
    .max(255, { message: 'Address must be at most 255 characters' })
    .optional()
    .or(z.literal('')),
});

export const UpdateReferralSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name must be at most 100 characters' }),
  phoneNumber: z.string()
    .min(10, { message: 'Phone number must be at least 10 characters' })
    .max(15, { message: 'Phone number must be at most 15 characters' })
    .regex(/^[+]?[0-9\s\-()]{10,15}$/, { 
      message: 'Enter a valid phone number' 
    }),
  address: z.string()
    .max(255, { message: 'Address must be at most 255 characters' })
    .optional()
    .or(z.literal('')),
});

// Search schema
export const ReferralSearchSchema = z.object({
  searchTerm: z.string().optional(),
  pageNo: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().default('id'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
});

// Pagination schema
export const ReferralPaginationSchema = z.object({
  pageNo: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().default('id'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
});

// Phone number validation schema
export const PhoneNumberSchema = z.object({
  phoneNumber: z.string()
    .min(10, { message: 'Phone number must be at least 10 characters' })
    .max(15, { message: 'Phone number must be at most 15 characters' }),
});