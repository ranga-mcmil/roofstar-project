import { apiClient, APIResponse } from "@/lib/http-service//apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { CreateBranchPayload, CreateBranchResponse, GetBranchesResponse, GetBranchResponse, UpdateBranchPayload, UpdateBranchResponse } from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";
export class BranchesService extends BaseAPIRequests {

  async get_branches(): Promise<APIResponse<GetBranchesResponse>> {
    const url = `/api/branches`

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetBranchesResponse>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }


  async get_branch(branchId: string): Promise<APIResponse<GetBranchResponse>> {
    const url = `/api/branches/${branchId}`

    try {
      // const session = await sessionPromise;
      const session = await getServerSession(authOptions)

      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetBranchResponse>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }


  async createBranch(payload: CreateBranchPayload): Promise<APIResponse<CreateBranchResponse>> {
    const url = '/api/branches';

    // const session = await sessionPromise;
    const session = await getServerSession(authOptions)

    try {
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateBranchResponse>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  async updateBranch(payload: UpdateBranchPayload, branchId: string): Promise<APIResponse<UpdateBranchResponse>> {
    const url = `/api/branches/${branchId}`;
    
    // const session = await sessionPromise;
    const session = await getServerSession(authOptions)

    try {
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<UpdateBranchResponse>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  async deleteBranch(branchId: string): Promise<APIResponse<void>> {
    const url = `/api/branches/${branchId}`;

    // const session = await sessionPromise;
    const session = await getServerSession(authOptions)

    try {
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.delete(url, { headers });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error('Branch Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const branchesService = new BranchesService(apiClient, apiHeaderService);