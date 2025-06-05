/**
 * orders/index.ts
 * 
 * This file contains the OrderService class that implements API requests
 * to the order-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  CreateQuotationPayload,
  CreateLayawayPayload,
  CreateImmediateSalePayload,
  CreateFutureCollectionPayload,
  ConvertQuotationPayload,
  LayawayPaymentPayload,
  OrderSearchPayload,
  CreateOrderResponse,
  GetOrderResponse,
  GetOrdersResponse,
  GetOrderPaymentsResponse,
  GetLayawayScheduleResponse,
  GetLayawayPaymentSummaryResponse,
  GetStockMovementsResponse,
  GetSalesReportResponse,
  GetOrdersReadyForCollectionResponse,
  GetActiveLayawayOrdersResponse,
  GetOverdueLayawayOrdersResponse,
  GetCustomerOrdersResponse,
  GetOrdersByBranchResponse,
  OrderListParams,
  StockMovementParams,
  SalesReportParams,
  OrderType,
  OrderStatus
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class OrderService extends BaseAPIRequests {

  // =====================================
  // ORDER CREATION METHODS
  // =====================================

  /**
   * Create a quotation
   * 
   * POST /api/orders/{customerId}/{branchId}/quotation
   */
  async createQuotation(
    customerId: number,
    branchId: string,
    payload: CreateQuotationPayload
  ): Promise<APIResponse<CreateOrderResponse>> {
    const url = `/api/orders/${customerId}/${branchId}/quotation`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a layaway order
   * 
   * POST /api/orders/{customerId}/{branchId}/laybye
   */
  async createLayaway(
    customerId: number,
    branchId: string,
    payload: CreateLayawayPayload
  ): Promise<APIResponse<CreateOrderResponse>> {
    const url = `/api/orders/${customerId}/${branchId}/laybye`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create an immediate sale
   * 
   * POST /api/orders/{customerId}/{branchId}/immediate-sale
   */
  async createImmediateSale(
    customerId: number,
    branchId: string,
    payload: CreateImmediateSalePayload
  ): Promise<APIResponse<CreateOrderResponse>> {
    const url = `/api/orders/${customerId}/${branchId}/immediate-sale`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Create a future collection order
   * 
   * POST /api/orders/{customerId}/{branchId}/future-collection
   */
  async createFutureCollection(
    customerId: number,
    branchId: string,
    payload: CreateFutureCollectionPayload
  ): Promise<APIResponse<CreateOrderResponse>> {
    const url = `/api/orders/${customerId}/${branchId}/future-collection`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  // =====================================
  // ORDER RETRIEVAL METHODS
  // =====================================

  /**
   * Get all orders with filtering and pagination
   * 
   * GET /api/orders
   */
  async getAllOrders(params?: OrderListParams): Promise<APIResponse<GetOrdersResponse>> {
    const defaultParams: OrderListParams = {
      pageNo: 0,
      pageSize: 20,
      sortBy: 'createdDate',
      sortDir: 'desc'
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = `/api/orders?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetOrdersResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get a specific order by ID
   * 
   * GET /api/orders/{orderId}
   */
  async getOrder(orderId: number): Promise<APIResponse<GetOrderResponse>> {
    const url = `/api/orders/${orderId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get order by order number
   * 
   * GET /api/orders/number/{orderNumber}
   */
  async getOrderByNumber(orderNumber: string): Promise<APIResponse<GetOrderResponse>> {
    const url = `/api/orders/number/${orderNumber}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Search orders with complex criteria
   * 
   * POST /api/orders/search
   */
  async searchOrders(payload: OrderSearchPayload): Promise<APIResponse<GetOrdersResponse>> {
    const url = `/api/orders/search`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<GetOrdersResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  // =====================================
  // SPECIALIZED ORDER RETRIEVAL
  // =====================================

  /**
   * Get orders ready for collection
   * 
   * GET /api/orders/ready-for-collection
   */
  async getOrdersReadyForCollection(): Promise<APIResponse<GetOrdersReadyForCollectionResponse>> {
    const url = `/api/orders/ready-for-collection`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetOrdersReadyForCollectionResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get active layaway orders
   * 
   * GET /api/orders/laybye/active
   */
  async getActiveLayawayOrders(): Promise<APIResponse<GetActiveLayawayOrdersResponse>> {
    const url = `/api/orders/laybye/active`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetActiveLayawayOrdersResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get overdue layaway orders
   * 
   * GET /api/orders/laybye/overdue
   */
  async getOverdueLayawayOrders(): Promise<APIResponse<GetOverdueLayawayOrdersResponse>> {
    const url = `/api/orders/laybye/overdue`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetOverdueLayawayOrdersResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get orders for a specific customer
   * 
   * GET /api/orders/customer/{customerId}
   */
  async getCustomerOrders(customerId: number): Promise<APIResponse<GetCustomerOrdersResponse>> {
    const url = `/api/orders/customer/${customerId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetCustomerOrdersResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get orders for a specific branch
   * 
   * GET /api/orders/branch/{branchId}
   */
  async getOrdersByBranch(branchId: string, status?: OrderStatus): Promise<APIResponse<GetOrdersByBranchResponse>> {
    const url = status 
      ? `/api/orders/branch/${branchId}?status=${status}`
      : `/api/orders/branch/${branchId}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetOrdersByBranchResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  // =====================================
  // ORDER MANAGEMENT METHODS
  // =====================================

  /**
   * Convert quotation to order
   * 
   * POST /api/orders/{quotationId}/convert
   */
  async convertQuotation(
    quotationId: number,
    orderType: OrderType,
    payload: ConvertQuotationPayload
  ): Promise<APIResponse<CreateOrderResponse>> {
    const url = `/api/orders/${quotationId}/convert?orderType=${orderType}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Mark order as ready for collection
   * 
   * PUT /api/orders/{orderId}/ready-for-collection
   */
  async markReadyForCollection(orderId: number): Promise<APIResponse<CreateOrderResponse>> {
    const url = `/api/orders/${orderId}/ready-for-collection`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.put(url, {}, { headers });
      return this.handleResponse<CreateOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Complete collection
   * 
   * POST /api/orders/{orderId}/complete-collection
   */
  async completeCollection(orderId: number): Promise<APIResponse<CreateOrderResponse>> {
    const url = `/api/orders/${orderId}/complete-collection`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, {}, { headers });
      return this.handleResponse<CreateOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Reverse an order
   * 
   * POST /api/orders/{orderId}/reverse
   */
  async reverseOrder(orderId: number, reversalReason: string): Promise<APIResponse<CreateOrderResponse>> {
    const url = `/api/orders/${orderId}/reverse?reversalReason=${encodeURIComponent(reversalReason)}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, {}, { headers });
      return this.handleResponse<CreateOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  // =====================================
  // PAYMENT METHODS
  // =====================================

  /**
   * Process layaway payment
   * 
   * POST /api/orders/{orderId}/laybye-payment
   */
  async processLayawayPayment(
    orderId: number,
    payload: LayawayPaymentPayload
  ): Promise<APIResponse<CreateOrderResponse>> {
    const url = `/api/orders/${orderId}/laybye-payment`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.post(url, payload, { headers });
      return this.handleResponse<CreateOrderResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get order payments
   * 
   * GET /api/orders/{orderId}/payments
   */
  async getOrderPayments(orderId: number): Promise<APIResponse<GetOrderPaymentsResponse>> {
    const url = `/api/orders/${orderId}/payments`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetOrderPaymentsResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  // =====================================
  // LAYAWAY SPECIFIC METHODS
  // =====================================

  /**
   * Get layaway payment summary
   * 
   * GET /api/orders/{orderId}/laybye-summary
   */
  async getLayawayPaymentSummary(orderId: number): Promise<APIResponse<GetLayawayPaymentSummaryResponse>> {
    const url = `/api/orders/${orderId}/laybye-summary`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetLayawayPaymentSummaryResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get layaway schedule
   * 
   * GET /api/orders/{orderId}/laybye-schedule
   */
  async getLayawaySchedule(orderId: number): Promise<APIResponse<GetLayawayScheduleResponse>> {
    const url = `/api/orders/${orderId}/laybye-schedule`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetLayawayScheduleResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  // =====================================
  // REPORTING METHODS
  // =====================================

  /**
   * Get stock movements
   * 
   * GET /api/orders/reports/stock-movements
   */
  async getStockMovements(params?: StockMovementParams): Promise<APIResponse<GetStockMovementsResponse>> {
    const queryString = params ? new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';

    const url = queryString 
      ? `/api/orders/reports/stock-movements?${queryString}`
      : `/api/orders/reports/stock-movements`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetStockMovementsResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get sales report
   * 
   * GET /api/orders/reports/sales
   */
  async getSalesReport(params: SalesReportParams): Promise<APIResponse<GetSalesReportResponse>> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = `/api/orders/reports/sales?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetSalesReportResponse>(response);
    } catch (error) {
      console.error('Order Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const orderService = new OrderService(apiClient, apiHeaderService);