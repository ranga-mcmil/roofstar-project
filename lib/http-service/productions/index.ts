/**
 * productions/index.ts
 * 
 * This file contains the ProductionService class that implements API requests
 * to the production-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateProductionPayload, 
  CreateProductionResponse, 
  GetProductionsByBatchResponse,
  ProductionPaginationParams
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class ProductionService extends BaseAPIRequests {

  /**
   * Create a production record for an order and inventory
   * 
   * POST /api/productions/orders/{orderId}/inventory/{inventoryId}
   */
  async createProduction(
    orderId: number,
    inventoryId: number,
    payload: CreateProductionPayload
  ): Promise<APIResponse<CreateProductionResponse>> {
    const url = `/api/productions/orders/${orderId}/inventory/${inventoryId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateProductionResponse>(response);
    } catch (error) {
      console.error('Production Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get productions by batch with pagination
   * 
   * GET /api/productions/batches/{batchId}
   */
  async getProductionsByBatch(
    batchId: number,
    params?: ProductionPaginationParams
  ): Promise<APIResponse<GetProductionsByBatchResponse>> {
    const defaultParams: ProductionPaginationParams = {
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
    
    const url = `/api/productions/batches/${batchId}?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetProductionsByBatchResponse>(response);
    } catch (error) {
      console.error('Production Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const productionService = new ProductionService(apiClient, apiHeaderService);