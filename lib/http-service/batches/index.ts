/**
 * batches/index.ts
 * 
 * This file contains the BatchService class that implements API requests
 * to the batch-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateBatchPayload, 
  CreateBatchResponse, 
  GetBatchesResponse, 
  GetBatchResponse, 
  UpdateBatchPayload, 
  UpdateBatchResponse,
  BatchPaginationParams
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class BatchService extends BaseAPIRequests {

  /**
   * Get all batches with pagination and optional branch filtering
   * 
   * GET /api/batches
   */
  async get_batches(params?: BatchPaginationParams): Promise<APIResponse<GetBatchesResponse>> {
    const defaultParams: BatchPaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/batches?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetBatchesResponse>(response);
    } catch (error) {
      console.error('Batch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific batch by ID
   * 
   * GET /api/batches/{batchId}
   */
  async get_batch(batchId: number): Promise<APIResponse<GetBatchResponse>> {
    const url = `/api/batches/${batchId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetBatchResponse>(response);
    } catch (error) {
      console.error('Batch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a batch by batch number
   * 
   * GET /api/batches/number/{batchNumber}
   */
  async getBatchByNumber(batchNumber: string): Promise<APIResponse<GetBatchResponse>> {
    const url = `/api/batches/number/${encodeURIComponent(batchNumber)}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetBatchResponse>(response);
    } catch (error) {
      console.error('Batch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new batch for a specific branch
   * 
   * POST /api/batches/{branchId}
   */
  async createBatch(branchId: string, payload: CreateBatchPayload): Promise<APIResponse<CreateBatchResponse>> {
    const url = `/api/batches/${branchId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateBatchResponse>(response);
    } catch (error) {
      console.error('Batch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing batch
   * 
   * PUT /api/batches/{batchId}
   */
  async updateBatch(payload: UpdateBatchPayload, batchId: number): Promise<APIResponse<UpdateBatchResponse>> {
    const url = `/api/batches/${batchId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateBatchResponse>(response);
    } catch (error) {
      console.error('Batch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a batch
   * 
   * DELETE /api/batches/{batchId}
   */
  async deleteBatch(batchId: number): Promise<APIResponse<void>> {
    const url = `/api/batches/${batchId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Batch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const batchService = new BatchService(apiClient, apiHeaderService);