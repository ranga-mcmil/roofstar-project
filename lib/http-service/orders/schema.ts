/**
 * orders/schema.ts
 * 
 * This file contains the Zod validation schemas for order-related data.
 * Updated to match API specification requirements.
 */

import { z } from 'zod';

// Enums
export const OrderTypeEnum = z.enum(["IMMEDIATE_SALE", "FUTURE_COLLECTION", "LAYAWAY", "QUOTATION"]);
export const OrderStatusEnum = z.enum(["PENDING", "CONFIRMED", "PARTIALLY_PAID", "FULLY_PAID", "READY_FOR_COLLECTION", "COMPLETED", "CANCELLED", "REVERSED"]);
export const PaymentMethodEnum = z.enum(["CASH", "CARD", "BANK_TRANSFER", "MOBILE_MONEY", "MIXED"]);

// Base schemas for order items and layaway plans - Updated to match API spec
export const OrderItemSchema = z.object({
  productId: z.number().int().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  length: z.number().min(0.01, 'Length must be greater than 0'),
  width: z.number().min(0.01, 'Width must be greater than 0'),
  discount: z.number().min(0.00).max(100.00).default(0), // Added default value
  notes: z.string().optional(),
});

export const LayawayPlanSchema = z.object({
  depositAmount: z.number().min(0, 'Deposit amount must be non-negative'),
  installmentAmount: z.number().min(0.01, 'Installment amount must be greater than 0'),
  numberOfInstallments: z.number().int().min(1, 'Must have at least 1 installment'),
  installmentFrequencyDays: z.number().int().min(1, 'Frequency must be at least 1 day'),
  firstInstallmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const PaymentSchema = z.object({
  amount: z.number().min(0.01, 'Payment amount must be greater than 0'),
  paymentMethod: PaymentMethodEnum,
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
});

// Order creation schemas
export const CreateQuotationSchema = z.object({
  orderItems: z.array(OrderItemSchema).min(1, 'At least one order item is required'),
  notes: z.string().optional(),
});

export const CreateLayawaySchema = z.object({
  orderItems: z.array(OrderItemSchema).min(1, 'At least one order item is required'),
  notes: z.string().optional(),
  paymentAmount: z.number().min(0.00, 'Payment amount must be non-negative'),
  paymentMethod: PaymentMethodEnum,
  layawayPlan: LayawayPlanSchema,
});

export const CreateImmediateSaleSchema = z.object({
  orderItems: z.array(OrderItemSchema).min(1, 'At least one order item is required'),
  notes: z.string().optional(),
  paymentAmount: z.number().min(0.01, 'Payment amount must be greater than 0'),
  paymentMethod: PaymentMethodEnum,
});

export const CreateFutureCollectionSchema = z.object({
  orderItems: z.array(OrderItemSchema).min(1, 'At least one order item is required'),
  notes: z.string().optional(),
  paymentAmount: z.number().min(0.01, 'Payment amount must be greater than 0'),
  paymentMethod: PaymentMethodEnum,
  expectedCollectionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// Convert quotation schema
export const ConvertQuotationSchema = z.object({
  orderItems: z.array(OrderItemSchema),
  paymentAmount: z.number().min(0).optional(),
  paymentMethod: PaymentMethodEnum.optional(),
  expectedCollectionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  layawayPlan: LayawayPlanSchema.optional(),
  notes: z.string().optional(),
});

// Layaway payment schema
export const LayawayPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Payment amount must be greater than 0'),
  paymentMethod: PaymentMethodEnum,
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
});

// Order search schema
export const OrderSearchSchema = z.object({
  orderNumber: z.string().optional(),
  orderType: OrderTypeEnum.optional(),
  status: OrderStatusEnum.optional(),
  customerName: z.string().optional(),
  branchName: z.string().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  userName: z.string().optional(),
  pageNo: z.number().int().min(0).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
});

// Parameter schemas for list operations
export const OrderListParamsSchema = z.object({
  pageNo: z.number().int().min(0).optional(), // Fixed to match API spec
  pageSize: z.number().int().min(1).max(100).optional(), // Fixed to match API spec
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
  orderType: OrderTypeEnum.optional(),
  status: OrderStatusEnum.optional(),
  customerId: z.number().int().optional(),
  branchId: z.string().uuid().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

export const StockMovementParamsSchema = z.object({
  productId: z.number().int().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

export const SalesReportParamsSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  branchId: z.number().int().optional(),
});

// Reversal schema
export const ReverseOrderSchema = z.object({
  reversalReason: z.string().min(1, 'Reversal reason is required'),
});