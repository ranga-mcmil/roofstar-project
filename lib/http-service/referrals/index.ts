/**
 * referrals/index.ts
 * 
 * This file contains the ReferralService class that implements API requests
 * to the referral-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateReferralPayload,
  CreateReferralResponse,
  GetReferralResponse,
  UpdateReferralPayload,
  UpdateReferralResponse,
  GetAllReferralsResponse,
  SearchReferralsResponse,
  GetReferralsByPhoneResponse,
  CheckReferralExistsResponse,
  ReferralPaginationParams,
  ReferralSearchPayload
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class ReferralService extends BaseAPIRequests {

  /**
   * Get all referrals with pagination
   * 
   * GET /api/referrals
   */
  async getAllReferrals(params?: ReferralPaginationParams): Promise<APIResponse<GetAllReferralsResponse>> {
    const defaultParams: ReferralPaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDir: 'asc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/referrals?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetAllReferralsResponse>(response);
    } catch (error) {
      console.error('Referral Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific referral by ID
   * 
   * GET /api/referrals/{referralId}
   */
  async getReferral(referralId: number): Promise<APIResponse<GetReferralResponse>> {
    const url = `/api/referrals/${referralId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetReferralResponse>(response);
    } catch (error) {
      console.error('Referral Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new referral
   * 
   * POST /api/referrals
   */
  async createReferral(payload: CreateReferralPayload): Promise<APIResponse<CreateReferralResponse>> {
    const url = '/api/referrals';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateReferralResponse>(response);
    } catch (error) {
      console.error('Referral Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing referral
   * 
   * PUT /api/referrals/{referralId}
   */
  async updateReferral(payload: UpdateReferralPayload, referralId: number): Promise<APIResponse<UpdateReferralResponse>> {
    const url = `/api/referrals/${referralId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateReferralResponse>(response);
    } catch (error) {
      console.error('Referral Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a referral
   * 
   * DELETE /api/referrals/{referralId}
   */
  async deleteReferral(referralId: number): Promise<APIResponse<void>> {
    const url = `/api/referrals/${referralId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Referral Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Search referrals with criteria
   * 
   * GET /api/referrals/search
   */
  async searchReferrals(params: ReferralSearchPayload): Promise<APIResponse<SearchReferralsResponse>> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = `/api/referrals/search?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<SearchReferralsResponse>(response);
    } catch (error) {
      console.error('Referral Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get referrals by phone number
   * 
   * GET /api/referrals/phone/{phoneNumber}
   */
  async getReferralsByPhone(phoneNumber: string): Promise<APIResponse<GetReferralsByPhoneResponse>> {
    const url = `/api/referrals/phone/${encodeURIComponent(phoneNumber)}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetReferralsByPhoneResponse>(response);
    } catch (error) {
      console.error('Referral Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Check if referral exists by phone number
   * 
   * GET /api/referrals/exists/phone/{phoneNumber}
   */
  async checkReferralExists(phoneNumber: string): Promise<APIResponse<CheckReferralExistsResponse>> {
    const url = `/api/referrals/exists/phone/${encodeURIComponent(phoneNumber)}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<CheckReferralExistsResponse>(response);
    } catch (error) {
      console.error('Referral Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const referralService = new ReferralService(apiClient, apiHeaderService);