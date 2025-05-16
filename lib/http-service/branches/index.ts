/**
 * branches/index.ts (Enhanced)
 * 
 * This file contains the enhanced BranchesService class that implements API requests
 * to the branch-controller endpoints, including pagination and stats.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateBranchPayload, 
  CreateBranchResponse, 
  GetBranchesResponse, 
  GetBranchResponse, 
  UpdateBranchPayload, 
  UpdateBranchResponse,
  PaginationParams,
  BranchStatsResponse
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class BranchesService extends BaseAPIRequests {

  /**
   * Get all branches with pagination
   * 
   * GET /api/branches
   */
  async get_branches(params?: PaginationParams): Promise<APIResponse<GetBranchesResponse>> {
    const defaultParams: PaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(queryParams as any).toString();
    const url = `/api/branches?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetBranchesResponse>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific branch by ID
   * 
   * GET /api/branches/{branchId}
   */
  async get_branch(branchId: string): Promise<APIResponse<GetBranchResponse>> {
    const url = `/api/branches/${branchId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetBranchResponse>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new branch
   * 
   * POST /api/branches
   */
  async createBranch(payload: CreateBranchPayload): Promise<APIResponse<CreateBranchResponse>> {
    const url = '/api/branches';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateBranchResponse>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing branch
   * 
   * PUT /api/branches/{branchId}
   */
  async updateBranch(payload: UpdateBranchPayload, branchId: string): Promise<APIResponse<UpdateBranchResponse>> {
    const url = `/api/branches/${branchId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateBranchResponse>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a branch
   * 
   * DELETE /api/branches/{branchId}
   */
  async deleteBranch(branchId: string): Promise<APIResponse<void>> {
    const url = `/api/branches/${branchId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Activate a branch
   * 
   * GET /api/branches/{branchId}/activate
   */
  async activateBranch(branchId: string): Promise<APIResponse<Record<string, string>>> {
    const url = `/api/branches/${branchId}/activate`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<Record<string, string>>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Deactivate a branch
   * 
   * GET /api/branches/{branchId}/deactivate
   */
  async deactivateBranch(branchId: string): Promise<APIResponse<Record<string, string>>> {
    const url = `/api/branches/${branchId}/deactivate`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<Record<string, string>>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get branch statistics
   * 
   * GET /api/branches/stats
   */
  async getBranchStats(): Promise<APIResponse<BranchStatsResponse>> {
    const url = `/api/branches/stats`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<BranchStatsResponse>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const branchesService = new BranchesService(apiClient, apiHeaderService);
