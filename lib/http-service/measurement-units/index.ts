/**
 * measurement-units/index.ts
 * 
 * This file contains the MeasurementUnitService class that implements API requests
 * to the measurement-unit-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateMeasurementUnitPayload, 
  CreateMeasurementUnitResponse, 
  GetMeasurementUnitsResponse, 
  GetMeasurementUnitResponse, 
  UpdateMeasurementUnitPayload, 
  UpdateMeasurementUnitResponse 
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class MeasurementUnitService extends BaseAPIRequests {

  /**
   * Get all measurement units
   * 
   * GET /api/measurement-units
   */
  async get_measurementUnits(): Promise<APIResponse<GetMeasurementUnitsResponse>> {
    const url = `/api/measurement-units`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetMeasurementUnitsResponse>(response);
    } catch (error) {
      console.error('Measurement Unit Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific measurement unit by ID
   * 
   * GET /api/measurement-units/{measurementUnitId}
   */
  async get_measurementUnit(measurementUnitId: number): Promise<APIResponse<GetMeasurementUnitResponse>> {
    const url = `/api/measurement-units/${measurementUnitId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetMeasurementUnitResponse>(response);
    } catch (error) {
      console.error('Measurement Unit Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new measurement unit
   * 
   * POST /api/measurement-units
   */
  async createMeasurementUnit(payload: CreateMeasurementUnitPayload): Promise<APIResponse<CreateMeasurementUnitResponse>> {
    const url = '/api/measurement-units';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateMeasurementUnitResponse>(response);
    } catch (error) {
      console.error('Measurement Unit Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing measurement unit
   * 
   * PUT /api/measurement-units/{measurementUnitId}
   */
  async updateMeasurementUnit(payload: UpdateMeasurementUnitPayload, measurementUnitId: number): Promise<APIResponse<UpdateMeasurementUnitResponse>> {
    const url = `/api/measurement-units/${measurementUnitId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateMeasurementUnitResponse>(response);
    } catch (error) {
      console.error('Measurement Unit Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a measurement unit
   * 
   * DELETE /api/measurement-units/{measurementUnitId}
   */
  async deleteMeasurementUnit(measurementUnitId: number): Promise<APIResponse<void>> {
    const url = `/api/measurement-units/${measurementUnitId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Measurement Unit Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const measurementUnitService = new MeasurementUnitService(apiClient, apiHeaderService);