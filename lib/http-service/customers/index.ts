
// lib/http-service/customers/index.ts
/**
 * customers/index.ts
 * 
 * This file contains the CustomerService class that implements API requests
 * to the customer-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateCustomerPayload, 
  CreateCustomerResponse, 
  GetCustomersResponse, 
  GetCustomerResponse, 
  UpdateCustomerPayload, 
  UpdateCustomerResponse,
  CustomerPaginationParams
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class CustomerService extends BaseAPIRequests {

  /**
   * Get all customers with pagination and optional branch filtering
   * 
   * GET /api/customers
   */
  async get_customers(params?: CustomerPaginationParams): Promise<APIResponse<GetCustomersResponse>> {
    const defaultParams: CustomerPaginationParams = {
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
    
    const url = `/api/customers?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetCustomersResponse>(response);
    } catch (error) {
      console.error('Customer Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific customer by ID
   * 
   * GET /api/customers/{customerId}
   */
  async get_customer(customerId: number): Promise<APIResponse<GetCustomerResponse>> {
    const url = `/api/customers/${customerId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetCustomerResponse>(response);
    } catch (error) {
      console.error('Customer Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new customer
   * 
   * POST /api/customers
   */
  async createCustomer(payload: CreateCustomerPayload): Promise<APIResponse<CreateCustomerResponse>> {
    const url = '/api/customers';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateCustomerResponse>(response);
    } catch (error) {
      console.error('Customer Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing customer
   * 
   * PUT /api/customers/{customerId}
   */
  async updateCustomer(payload: UpdateCustomerPayload, customerId: number): Promise<APIResponse<UpdateCustomerResponse>> {
    const url = `/api/customers/${customerId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateCustomerResponse>(response);
    } catch (error) {
      console.error('Customer Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a customer
   * 
   * DELETE /api/customers/{customerId}
   */
  async deleteCustomer(customerId: number): Promise<APIResponse<void>> {
    const url = `/api/customers/${customerId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Customer Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const customerService = new CustomerService(apiClient, apiHeaderService);
