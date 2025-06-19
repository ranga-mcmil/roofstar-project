/**
 * orders/types.ts
 * 
 * This file contains the TypeScript type definitions for order-related data
 * based on the OpenAPI specification.
 * Updated to match API spec exactly.
 */

import { z } from 'zod';
import { 
  CreateQuotationSchema, 
  CreateLayawaySchema, 
  CreateImmediateSaleSchema, 
  CreateFutureCollectionSchema,
  ConvertQuotationSchema,
  LayawayPaymentSchema,
  OrderSearchSchema
} from './schema';

// Schema-derived types
export type CreateQuotationPayload = z.infer<typeof CreateQuotationSchema>;
export type CreateLayawayPayload = z.infer<typeof CreateLayawaySchema>;
export type CreateImmediateSalePayload = z.infer<typeof CreateImmediateSaleSchema>;
export type CreateFutureCollectionPayload = z.infer<typeof CreateFutureCollectionSchema>;
export type ConvertQuotationPayload = z.infer<typeof ConvertQuotationSchema>;
export type LayawayPaymentPayload = z.infer<typeof LayawayPaymentSchema>;
export type OrderSearchPayload = z.infer<typeof OrderSearchSchema>;

// Enums from API
export type OrderType = "IMMEDIATE_SALE" | "FUTURE_COLLECTION" | "LAYAWAY" | "QUOTATION";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PARTIALLY_PAID" | "FULLY_PAID" | "READY_FOR_COLLECTION" | "COMPLETED" | "CANCELLED" | "REVERSED";
export type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY" | "MIXED";

// Core DTOs from API
export interface OrderItemDTO {
  productId: number;
  quantity: number;
  length: number;
  width: number;
  discount: number;
  notes?: string;
}

export interface LayawayPlanDTO {
  depositAmount: number;
  installmentAmount: number;
  numberOfInstallments: number;
  installmentFrequencyDays: number;
  firstInstallmentDate: string; // date format
}

export interface PaymentDTO {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  notes?: string;
}

// Response DTOs - Updated to match API spec exactly
export interface OrderItemResponseDTO {
  id: number;
  productName: string;
  productCode: string;
  quantity: number;
  length: number; // Added missing field
  width: number; // Added missing field
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface PaymentResponseDTO {
  id: number;
  paymentReference: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string; // date-time
  receivedBy: string;
  reversedDate?: string; // date-time
  reversalReason?: string;
  notes?: string;
  reversed: boolean;
}

export interface OrderResponseDTO {
  id: number;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  customerName: string;
  branchName: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  createdDate: string; // date-time
  expectedCollectionDate?: string; // date
  completionDate?: string; // date-time
  orderItems: OrderItemResponseDTO[];
  payments: PaymentResponseDTO[];
  notes?: string;
}

export interface LayawayInstallmentDTO {
  id: number;
  installmentNumber: number;
  expectedAmount: number;
  dueDate: string; // date
  paidAmount: number;
  paidDate?: string; // date
  paid: boolean;
  overdue: boolean;
}

export interface LayawayScheduleDTO {
  id: number;
  depositAmount: number;
  installmentAmount: number;
  numberOfInstallments: number;
  installmentFrequencyDays: number;
  firstInstallmentDate: string; // date
  finalPaymentDate: string; // date
  installments: LayawayInstallmentDTO[];
}

export interface LayawayPaymentSummaryDTO {
  orderId: number;
  orderNumber: string;
  totalExpected: number;
  totalPaid: number;
  remainingBalance: number;
  totalInstallments: number;
  paidInstallments: number;
  overdueInstallments: number;
  nextDueDate?: string; // date
  nextDueAmount: number;
  fullyPaid: boolean;
  paymentProgress: number; // double
}

export interface StockMovementDTO {
  id: number;
  productId: number;
  productName: string;
  orderId: number;
  orderNumber: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  movementType: string;
  movementDate: string; // date-time
  createdById: string; // uuid
  createdByName: string;
  notes?: string;
  reversedDate?: string; // date-time
  reversed: boolean;
}

export interface SalesReportDTO {
  totalSales: number;
  totalOrders: number;
  startDate: string; // date
  endDate: string; // date
}

// Pagination and Page interfaces - Updated to match API spec
export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortObject;
  unpaged: boolean;
}

export interface SortObject {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface PageOrderResponseDTO {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  size: number;
  content: OrderResponseDTO[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Parameters for API calls - Fixed to match API spec exactly
export interface OrderListParams {
  pageNo?: number;    // Correct parameter name
  pageSize?: number;  // Correct parameter name
  sortBy?: string;
  sortDir?: string;
  orderType?: OrderType;
  status?: OrderStatus;
  customerId?: number;
  branchId?: string;
  startDate?: string; // date
  endDate?: string; // date
}

export interface StockMovementParams {
  productId?: number;
  startDate?: string; // date
  endDate?: string; // date
}

export interface SalesReportParams {
  startDate: string; // date - required
  endDate: string; // date - required
  branchId?: number;
}

// Response type aliases
export type CreateOrderResponse = OrderResponseDTO;
export type GetOrderResponse = OrderResponseDTO;
export type GetOrdersResponse = PageOrderResponseDTO;
export type GetOrderPaymentsResponse = PaymentResponseDTO[];
export type GetLayawayScheduleResponse = LayawayScheduleDTO;
export type GetLayawayPaymentSummaryResponse = LayawayPaymentSummaryDTO;
export type GetStockMovementsResponse = StockMovementDTO[];
export type GetSalesReportResponse = SalesReportDTO;
export type GetOrdersReadyForCollectionResponse = OrderResponseDTO[];
export type GetActiveLayawayOrdersResponse = OrderResponseDTO[];
export type GetOverdueLayawayOrdersResponse = OrderResponseDTO[];
export type GetCustomerOrdersResponse = OrderResponseDTO[];
export type GetOrdersByBranchResponse = OrderResponseDTO[];