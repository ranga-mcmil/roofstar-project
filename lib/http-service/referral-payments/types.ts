/**
 * referral-payments/types.ts
 * 
 * This file contains the TypeScript type definitions for referral payment-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { 
  UpdateReferralPaymentStatusSchema,
  ReferralPaymentStatusEnum,
  ReferralPaymentPaginationSchema,
  BranchIdSchema
} from './schema';

// Schema-derived types
export type UpdateReferralPaymentStatusPayload = z.infer<typeof UpdateReferralPaymentStatusSchema>;
export type ReferralPaymentStatus = z.infer<typeof ReferralPaymentStatusEnum>;
export type ReferralPaymentPaginationParams = z.infer<typeof ReferralPaymentPaginationSchema>;
export type BranchIdPayload = z.infer<typeof BranchIdSchema>;

// Response types from API based on OpenAPI spec
export interface ReferralPaymentDTO {
  id: number;
  referralId: number;
  fullName: string;
  referralAmount: number;
  orderId: number;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: ReferralPaymentStatus;
}

export interface PaginationResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// API Response types
export type GetAllReferralPaymentsResponse = PaginationResponse<ReferralPaymentDTO>;
export type UpdateReferralPaymentStatusResponse = ReferralPaymentDTO;