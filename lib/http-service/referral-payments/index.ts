/**
 * referral-payments/index.ts
 * 
 * This file contains the ReferralPaymentService class that implements API requests
 * to the referral-payment-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  UpdateReferralPaymentStatusPayload,
  GetAllReferralPaymentsResponse,
  UpdateReferralPaymentStatusResponse,
  ReferralPaymentPaginationParams,
  ReferralPaymentStatus
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class ReferralPaymentService extends BaseAPIRequests {

  /**
   * Get all referral payments for a branch with pagination
   * 
   * GET /api/referral-payments/branch/{branchId}
   */
  async getAllReferralPayments(
    branchId: string, 
    params?: ReferralPaymentPaginationParams
  ): Promise<APIResponse<GetAllReferralPaymentsResponse>> {
    const defaultParams: ReferralPaymentPaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'createdAt',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/referral-payments/branch/${branchId}?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetAllReferralPaymentsResponse>(response);
    } catch (error) {
      console.error('Referral Payment Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update referral payment status
   * 
   * PUT /api/referral-payments/{referralPaymentId}/status
   */
  async updateReferralPaymentStatus(
    referralPaymentId: number,
    status: ReferralPaymentStatus
  ): Promise<APIResponse<UpdateReferralPaymentStatusResponse>> {
    const url = `/api/referral-payments/${referralPaymentId}/status?status=${status}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, {}, { headers });
      return this.handleResponse<UpdateReferralPaymentStatusResponse>(response);
    } catch (error) {
      console.error('Referral Payment Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const referralPaymentService = new ReferralPaymentService(apiClient, apiHeaderService);