/**
 * referrals/types.ts
 * 
 * This file contains the TypeScript type definitions for referral-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { 
  CreateReferralSchema, 
  UpdateReferralSchema, 
  ReferralSearchSchema,
  ReferralPaginationSchema,
  PhoneNumberSchema
} from './schema';

// Schema-derived types
export type CreateReferralPayload = z.infer<typeof CreateReferralSchema>;
export type UpdateReferralPayload = z.infer<typeof UpdateReferralSchema>;
export type ReferralSearchPayload = z.infer<typeof ReferralSearchSchema>;
export type ReferralPaginationParams = z.infer<typeof ReferralPaginationSchema>;
export type PhoneNumberPayload = z.infer<typeof PhoneNumberSchema>;

// Response types from API based on OpenAPI spec
export interface ReferralDTO {
  id: number;
  fullName: string;
  phoneNumber: string;
  address: string;
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
export type CreateReferralResponse = ReferralDTO;
export type GetReferralResponse = ReferralDTO;
export type UpdateReferralResponse = ReferralDTO;
export type GetAllReferralsResponse = PaginationResponse<ReferralDTO>;
export type SearchReferralsResponse = PaginationResponse<ReferralDTO>;
export type GetReferralsByPhoneResponse = ReferralDTO[];
export type CheckReferralExistsResponse = boolean;