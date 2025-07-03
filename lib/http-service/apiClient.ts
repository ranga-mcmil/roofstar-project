export interface APIResponse<T, I = undefined> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  inputData?: I;
}

export interface APIErrorResponse {
  success: boolean;
  error: string;
  data: {
    timestamp: number;
    message: string;
    details: string;
  };
}

export class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }


  private async request<T>(url: string, options: RequestInit): Promise<APIResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`, options);

    console.log("**")
    console.log("**")
    console.log("**")
    console.log(`Request to: ${this.baseUrl}${url}`);
    console.log(`Status: ${response.status}`);
    console.log(options)
    console.log("**")
    console.log("**")
   
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      const jsonContentType = 'application/json; charset=utf-8';

      if (jsonContentType.includes(contentType!)) {
          const data = await response.json();          
          return { success: false, error: data.detail, data: data };
          
      } else {
          return { success: false, error: `${response.statusText}`, data: undefined };
      }
    } 


    if (options.method === 'DELETE') {
      return { success: true };
    }
    
    const data = await response.json();
    return { success: true, data };
  }

  async get<T>(url: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    return this.request<T>(url, { method: 'GET', ...options });
  }

  async post<T>(url: string, data: unknown, options: RequestInit = {}): Promise<APIResponse<T>> {
    
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  }

  async patch<T>(url: string, data: unknown, options: RequestInit = {}): Promise<APIResponse<T>> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  }

  async put<T>(url: string, data: unknown, options: RequestInit = {}): Promise<APIResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  }

  async delete<T>(url: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    return this.request<T>(url, { method: 'DELETE', ...options });
  }
  


}

export const apiClient = new APIClient(process.env.BACKEND_BASE_URL!);