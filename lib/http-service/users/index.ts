/**
 * users/index.ts
 * 
 * This file contains the UserService class that implements API requests
 * to the user-controller endpoints. Updated to match actual API spec exactly.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateUserPayload, 
  CreateUserResponse, 
  GetUsersResponse, 
  GetUserResponse, 
  UpdateUserPayload, 
  UpdateUserResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  UserPaginationParams,
  ToggleUserStatusResponse,
  ChangePasswordResponse,
  ForgotPasswordResponse,
  GetCurrentUserResponse
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class UserService extends BaseAPIRequests {

  /**
   * Get all users with pagination and optional branch filtering
   * 
   * GET /api/users
   */
  async get_users(params?: UserPaginationParams): Promise<APIResponse<GetUsersResponse>> {
    const defaultParams: UserPaginationParams = {
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
    
    const url = `/api/users?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetUsersResponse>(response);
    } catch (error) {
      console.error('User Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get the current user
   * 
   * GET /api/users/me
   */
  async getCurrentUser(): Promise<APIResponse<GetCurrentUserResponse>> {
    const url = `/api/users/me`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetCurrentUserResponse>(response);
    } catch (error) {
      console.error('User Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific user by ID
   * 
   * GET /api/users/{userId}
   */
  async get_user(userId: string): Promise<APIResponse<GetUserResponse>> {
    const url = `/api/users/${userId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetUserResponse>(response);
    } catch (error) {
      console.error('User Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a new user
   * 
   * POST /api/users
   */
  async createUser(payload: CreateUserPayload): Promise<APIResponse<CreateUserResponse>> {
    const url = '/api/users';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateUserResponse>(response);
    } catch (error) {
      console.error('User Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Update an existing user
   * 
   * PUT /api/users/{userId}
   */
  async updateUser(payload: UpdateUserPayload, userId: string): Promise<APIResponse<UpdateUserResponse>> {
    const url = `/api/users/${userId}`;
    
    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, payload, { headers });
      return this.handleResponse<UpdateUserResponse>(response);
    } catch (error) {
      console.error('User Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Toggle user status (active/inactive)
   * 
   * PATCH /api/users/{userId}/toggle-status
   */
  async toggleUserStatus(userId: string): Promise<APIResponse<ToggleUserStatusResponse>> {
    const url = `/api/users/${userId}/toggle-status`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.patch(url, {}, { headers });
      return this.handleResponse<ToggleUserStatusResponse>(response);
    } catch (error) {
      console.error('User Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Reset password for a user (forgot password)
   * 
   * POST /api/users/{userId}/forgot-password
   */
  async forgotPassword(userId: string, payload: ForgotPasswordPayload): Promise<APIResponse<ForgotPasswordResponse>> {
    const url = `/api/users/${userId}/forgot-password`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<ForgotPasswordResponse>(response);
    } catch (error) {
      console.error('User Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const userService = new UserService(apiClient, apiHeaderService);