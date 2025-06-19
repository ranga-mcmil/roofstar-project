/**
 * stock-movements/index.ts
 * 
 * This file contains the StockMovementService class that implements API requests
 * to the stock-movement-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  StockMovementSearchPayload,
  StockMovementPaginationParams,
  UserStockMovementParams,
  ProductStockSummaryParams,
  BranchStockMovementParams,
  MovementTypeParams,
  GetAllStockMovementsResponse,
  GetStockMovementResponse,
  GetUserStockMovementsResponse,
  GetProductStockSummaryResponse,
  SearchStockMovementsResponse,
  GetProductStockHistoryResponse,
  GetOrderStockMovementsResponse,
  GetStockMovementsByTypeResponse,
  GetBranchStockMovementsResponse
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class StockMovementService extends BaseAPIRequests {

  /**
   * Get all stock movements with pagination
   * 
   * GET /api/stock-movements
   */
  async getAllStockMovements(params?: StockMovementPaginationParams): Promise<APIResponse<GetAllStockMovementsResponse>> {
    const defaultParams: StockMovementPaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'movementDate',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/stock-movements?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetAllStockMovementsResponse>(response);
    } catch (error) {
      console.error('Stock Movement Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific stock movement by ID
   * 
   * GET /api/stock-movements/{stockMovementId}
   */
  async getStockMovementById(stockMovementId: number): Promise<APIResponse<GetStockMovementResponse>> {
    const url = `/api/stock-movements/${stockMovementId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetStockMovementResponse>(response);
    } catch (error) {
      console.error('Stock Movement Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get stock movements for a specific user
   * 
   * GET /api/stock-movements/user/{userId}
   */
  async getUserStockMovements(userId: string, params?: UserStockMovementParams): Promise<APIResponse<GetUserStockMovementsResponse>> {
    const defaultParams: UserStockMovementParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'movementDate',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/stock-movements/user/${userId}?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetUserStockMovementsResponse>(response);
    } catch (error) {
      console.error('Stock Movement Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get product stock summary
   * 
   * GET /api/stock-movements/summary/product/{productId}
   */
  async getProductStockSummary(productId: number, params?: ProductStockSummaryParams): Promise<APIResponse<GetProductStockSummaryResponse>> {
    const queryString = params ? new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';

    const url = queryString 
      ? `/api/stock-movements/summary/product/${productId}?${queryString}`
      : `/api/stock-movements/summary/product/${productId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetProductStockSummaryResponse>(response);
    } catch (error) {
      console.error('Stock Movement Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Search stock movements with complex criteria
   * 
   * GET /api/stock-movements/search
   */
  async searchStockMovements(params: StockMovementSearchPayload): Promise<APIResponse<SearchStockMovementsResponse>> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = `/api/stock-movements/search?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<SearchStockMovementsResponse>(response);
    } catch (error) {
      console.error('Stock Movement Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get product stock history
   * 
   * GET /api/stock-movements/product/{productId}
   */
  async getProductStockHistory(productId: number, params?: StockMovementPaginationParams): Promise<APIResponse<GetProductStockHistoryResponse>> {
    const defaultParams: StockMovementPaginationParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'movementDate',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/stock-movements/product/${productId}?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetProductStockHistoryResponse>(response);
    } catch (error) {
      console.error('Stock Movement Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get stock movements for a specific order
   * 
   * GET /api/stock-movements/order/{orderId}
   */
  async getOrderStockMovements(orderId: number): Promise<APIResponse<GetOrderStockMovementsResponse>> {
    const url = `/api/stock-movements/order/${orderId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetOrderStockMovementsResponse>(response);
    } catch (error) {
      console.error('Stock Movement Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get stock movements by movement type
   * 
   * GET /api/stock-movements/movement-type/{movementType}
   */
  async getStockMovementsByType(movementType: string, params?: MovementTypeParams): Promise<APIResponse<GetStockMovementsByTypeResponse>> {
    const defaultParams: MovementTypeParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'movementDate',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/stock-movements/movement-type/${encodeURIComponent(movementType)}?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetStockMovementsByTypeResponse>(response);
    } catch (error) {
      console.error('Stock Movement Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get stock movements for a specific branch
   * 
   * GET /api/stock-movements/branch/{branchId}
   */
  async getBranchStockMovements(branchId: string, params?: BranchStockMovementParams): Promise<APIResponse<GetBranchStockMovementsResponse>> {
    const defaultParams: BranchStockMovementParams = {
      pageNo: 0,
      pageSize: 10,
      sortBy: 'movementDate',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/stock-movements/branch/${branchId}?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetBranchStockMovementsResponse>(response);
    } catch (error) {
      console.error('Stock Movement Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const stockMovementService = new StockMovementService(apiClient, apiHeaderService);