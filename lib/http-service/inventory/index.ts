/**
 * inventory/index.ts
 * 
 * This file contains the InventoryService class that implements API requests
 * to the inventory-controller endpoints.
 * Updated to match API specification exactly.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  AddInventoryPayload,
  AdjustInventoryPayload,
  GetInventoryHistoryResponse,
  GetInventoryByBranchResponse,
  GetInventoryByBatchResponse,
  GetInventoryAdjustmentsResponse,
  PaginationParams
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class InventoryService extends BaseAPIRequests {

  /**
   * Add inventory to a product with batch
   * 
   * POST /api/inventory/products/{productId}/batches/{batchId}
   */
  async addInventory(
    productId: number, 
    batchId: number, // Added missing batchId parameter
    payload: AddInventoryPayload
  ): Promise<APIResponse<Record<string, string>>> {
    const url = `/api/inventory/products/${productId}/batches/${batchId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<Record<string, string>>(response);
    } catch (error) {
      console.error('Inventory Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Adjust inventory for a product
   * 
   * POST /api/inventory/products/{productId}/batches/{batchId}/adjustments/{movementType}
   */
  async adjustInventory(
    productId: number, 
    batchId: number, // Added missing batchId parameter
    movementType: string, 
    payload: AdjustInventoryPayload
  ): Promise<APIResponse<Record<string, string>>> {
    const url = `/api/inventory/products/${productId}/batches/${batchId}/adjustments/${movementType}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<Record<string, string>>(response);
    } catch (error) {
      console.error('Inventory Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get inventory history for a product with pagination
   * 
   * GET /api/inventory/products/{productId}/history
   */
  async getInventoryHistory(
    productId: number, 
    params?: PaginationParams
  ): Promise<APIResponse<GetInventoryHistoryResponse>> {
    const defaultParams: PaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(queryParams as any).toString();
    const url = `/api/inventory/products/${productId}/history?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetInventoryHistoryResponse>(response);
    } catch (error) {
      console.error('Inventory Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get inventory history for a branch with pagination
   * 
   * GET /api/inventory/branches/{branchId}/history
   */
  async getInventoryByBranch(
    branchId: string, 
    params?: PaginationParams
  ): Promise<APIResponse<GetInventoryByBranchResponse>> {
    const defaultParams: PaginationParams = {
      page: 0, // Note: API uses 'page' instead of 'pageNo' for this endpoint
      size: 10, // Note: API uses 'size' instead of 'pageSize' for this endpoint
      sortBy: 'id',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(queryParams as any).toString();
    const url = `/api/inventory/branches/${branchId}/history?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetInventoryByBranchResponse>(response);
    } catch (error) {
      console.error('Inventory Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get inventory adjustments with pagination
   * 
   * GET /api/inventory/adjustments
   */
  async getInventoryAdjustments(
    params?: PaginationParams
  ): Promise<APIResponse<GetInventoryAdjustmentsResponse>> {
    const defaultParams: PaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(queryParams as any).toString();
    const url = `/api/inventory/adjustments?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetInventoryAdjustmentsResponse>(response);
    } catch (error) {
      console.error('Inventory Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get inventory history for a batch with pagination
   * 
   * GET /api/inventory/batches/{batchNumber}/history
   */
  async getInventoryByBatch(
    batchNumber: string, 
    params?: PaginationParams
  ): Promise<APIResponse<GetInventoryByBatchResponse>> {
    const defaultParams: PaginationParams = {
      page: 0, // Note: API uses 'page' instead of 'pageNo' for this endpoint
      size: 10, // Note: API uses 'size' instead of 'pageSize' for this endpoint
      sortBy: 'id',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(queryParams as any).toString();
    const url = `/api/inventory/batches/${encodeURIComponent(batchNumber)}/history?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetInventoryByBatchResponse>(response);
    } catch (error) {
      console.error('Inventory Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const inventoryService = new InventoryService(apiClient, apiHeaderService);