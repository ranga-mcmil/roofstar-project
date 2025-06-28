/**
 * accounts/index.ts
 * 
 * Updated AccountsService to include the change password endpoint
 * which should be in the auth controller according to the API spec.
 */

import { apiClient, APIResponse } from "@/lib/http-service//apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  RefreshTokenPayload, 
  RefreshTokenResponse, 
  SignInPayload, 
  SignInResponse,
  ChangePasswordPayload,
  ChangePasswordResponse
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class AccountsService extends BaseAPIRequests {
    
  /**
   * Sign in user
   * 
   * POST /api/auth/login
   */
  async signIn(payload: SignInPayload): Promise<APIResponse<SignInResponse>> {
    const url = '/api/auth/login';

    try {
      const headers = await this.apiHeaders.getHeaders();
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<SignInResponse>(response);
    } catch (error) {
      console.error('Accounts Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Refresh access token
   * 
   * POST /api/auth/refresh-token
   */
  async refreshToken(payload: RefreshTokenPayload): Promise<APIResponse<RefreshTokenResponse>> {
    const url = '/api/auth/refresh-token';

    const session = await getServerSession(authOptions);

    try {
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<RefreshTokenResponse>(response);
    } catch (error) {
      console.error('Accounts Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Change password (moved from users service to auth service per API spec)
   * 
   * POST /api/auth/change-password
   */
  async changePassword(payload: ChangePasswordPayload): Promise<APIResponse<ChangePasswordResponse>> {
    const url = '/api/auth/change-password';

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<ChangePasswordResponse>(response);
    } catch (error) {
      console.error('Accounts Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const accountsService = new AccountsService(apiClient, apiHeaderService);