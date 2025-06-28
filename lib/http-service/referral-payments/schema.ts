/**
 * referral-payments/schema.ts
 * 
 * This file contains the Zod validation schemas for referral payment-related data.
 * Based on the OpenAPI specification.
 */

import { z } from 'zod';

// Enum for referral payment status
export const ReferralPaymentStatusEnum = z.enum([
  "PENDING", 
  "APPROVED", 
  "REJECTED", 
  "CANCELLED", 
  "PAID"
]);

// Schema for updating referral payment status
export const UpdateReferralPaymentStatusSchema = z.object({
  status: ReferralPaymentStatusEnum,
});

// Pagination schema for referral payments
export const ReferralPaymentPaginationSchema = z.object({
  pageNo: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});

// Branch ID validation schema
export const BranchIdSchema = z.object({
  branchId: z.string().uuid({ message: 'Branch ID must be a valid UUID' }),
});