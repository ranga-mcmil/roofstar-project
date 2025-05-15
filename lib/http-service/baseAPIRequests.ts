import { APIClient, APIResponse } from './apiClient';
import { HeaderService } from './apiHeaders';

export abstract class BaseAPIRequests {
  protected client: APIClient;
  protected apiHeaders: HeaderService;

  constructor(client: APIClient, apiHeaders: HeaderService) {
    this.client = client;
    this.apiHeaders = apiHeaders;
  }

  protected handleResponse<T>(response: any): APIResponse<T> {
    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Unknown error occurred',
      };
    }

    return {
      success: true,
      data: response.data as T,
    };
  }

}