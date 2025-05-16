/**
 * colors/index.ts
 * 
 * This file contains the ColorService class that implements API requests
 * to the color-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateColorPayload, 
  CreateColorResponse, 
  GetColorsResponse, 
  GetColorResponse, 
  UpdateColorPayload, 
  UpdateColorResponse 
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class ColorService extends BaseAPIRequests {

  /**
   * Get all colors
   * 
   * GET /api/colors
   */
  async get_colors(): Promise<APIResponse<GetColorsResponse>> {
    const url = `/api/colors`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetColorsResponse>(response);
    } catch (error) {
      console.error('Color Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific color by ID
   * 
   * GET /api/colors/{colorId}
   */
  async get_color(colorId: number): Promise<APIResponse<GetColorResponse>> {
    const url = `/api/colors/${colorId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetColorResponse>(response);
    } catch (error) {
      console.error('Color Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new color
   * 
   * POST /api/colors
   */
  async createColor(payload: CreateColorPayload): Promise<APIResponse<CreateColorResponse>> {
    const url = '/api/colors';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateColorResponse>(response);
    } catch (error) {
      console.error('Color Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing color
   * 
   * PUT /api/colors/{colorId}
   */
  async updateColor(payload: UpdateColorPayload, colorId: number): Promise<APIResponse<UpdateColorResponse>> {
    const url = `/api/colors/${colorId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateColorResponse>(response);
    } catch (error) {
      console.error('Color Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a color
   * 
   * DELETE /api/colors/{colorId}
   */
  async deleteColor(colorId: number): Promise<APIResponse<void>> {
    const url = `/api/colors/${colorId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Color Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const colorService = new ColorService(apiClient, apiHeaderService);