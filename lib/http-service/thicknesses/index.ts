/**
 * thicknesses/index.ts
 * 
 * This file contains the ThicknessService class that implements API requests
 * to the thickness-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateThicknessPayload, 
  CreateThicknessResponse, 
  GetThicknessesResponse, 
  GetThicknessResponse, 
  UpdateThicknessPayload, 
  UpdateThicknessResponse 
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class ThicknessService extends BaseAPIRequests {

  /**
   * Get all thicknesses
   * 
   * GET /api/thicknesses
   */
  async get_thicknesses(): Promise<APIResponse<GetThicknessesResponse>> {
    const url = `/api/thicknesses`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetThicknessesResponse>(response);
    } catch (error) {
      console.error('Thickness Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific thickness by ID
   * 
   * GET /api/thicknesses/{thicknessId}
   */
  async get_thickness(thicknessId: number): Promise<APIResponse<GetThicknessResponse>> {
    const url = `/api/thicknesses/${thicknessId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetThicknessResponse>(response);
    } catch (error) {
      console.error('Thickness Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new thickness
   * 
   * POST /api/thicknesses
   */
  async createThickness(payload: CreateThicknessPayload): Promise<APIResponse<CreateThicknessResponse>> {
    const url = '/api/thicknesses';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateThicknessResponse>(response);
    } catch (error) {
      console.error('Thickness Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing thickness
   * 
   * PUT /api/thicknesses/{thicknessId}
  */
  async updateThickness(payload: UpdateThicknessPayload, thicknessId: number): Promise<APIResponse<UpdateThicknessResponse>> {
    const url = `/api/thicknesses/${thicknessId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateThicknessResponse>(response);
    } catch (error) {
      console.error('Thickness Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a thickness
   * 
   * DELETE /api/thicknesses/{thicknessId}
   */
  async deleteThickness(thicknessId: number): Promise<APIResponse<void>> {
    const url = `/api/thicknesses/${thicknessId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Thickness Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const thicknessService = new ThicknessService(apiClient, apiHeaderService);
