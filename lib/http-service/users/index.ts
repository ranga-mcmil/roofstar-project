import { apiClient, APIResponse } from "@/lib/http-service//apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { ChangePasswordPayload, CreateUserPayload, CreateUserResponse, GetUserResponse, GetUsersResponse, UpdateUserPayload, UpdateUserResponse } from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class UsersService extends BaseAPIRequests {

  async get_users(branchId?: string, pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string): Promise<APIResponse<GetUsersResponse>> {
    const params = new URLSearchParams();

    if (branchId) params.append('branchId', branchId);
    if (pageNo !== undefined) params.append('pageNo', String(pageNo));
    if (pageSize !== undefined) params.append('pageSize', String(pageSize));
    if (sortBy) params.append('sortBy', sortBy);
    if (sortDir) params.append('sortDir', sortDir);
    
    const queryString = params.toString();
    const url = `/api/users${queryString ? `?${queryString}` : ''}`;

    try {
      // const session = await sessionPromise;
      const session = await getServerSession(authOptions)
      

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


  async get_user(userId: string): Promise<APIResponse<GetUserResponse>> {
    const url = `/api/users/${userId}`

    try {
      // const session = await sessionPromise;
      const session = await getServerSession(authOptions)


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


  async createUser(payload: CreateUserPayload): Promise<APIResponse<CreateUserResponse>> {
    const url = '/api/users';

    // const session = await sessionPromise;
    const session = await getServerSession(authOptions)
    

    try {
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

  async updateUser(payload: UpdateUserPayload, userId: string): Promise<APIResponse<UpdateUserResponse>> {
    const url = `/api/users/${userId}`;
    
    // const session = await sessionPromise;
    const session = await getServerSession(authOptions)


    try {
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<UpdateUserResponse>(response);
    } catch (error) {
      console.error('User Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  async changePassword(payload: ChangePasswordPayload, userId: string) {
    const url = `/api/users/${userId}/change-password`;
    
    // const session = await sessionPromise;
    const session = await getServerSession(authOptions)


    try {
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse(response);
    } catch (error) {
      console.error('User Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  

  
}

export const usersService = new UsersService(apiClient, apiHeaderService);