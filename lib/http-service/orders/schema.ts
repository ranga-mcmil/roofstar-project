/**
 * orders/schema.ts
 * 
 * This file contains the Zod validation schemas for order-related data.
 */

import { z } from 'zod';

// Enums
export const OrderTypeEnum = z.enum(["IMMEDIATE_SALE", "FUTURE_COLLECTION", "LAYAWAY", "QUOTATION"]);
export const OrderStatusEnum = z.enum(["PENDING", "CONFIRMED", "PARTIALLY_PAID", "FULLY_PAID", "READY_FOR_COLLECTION", "COMPLETED", "CANCELLED", "REVERSED"]);
export const PaymentMethodEnum = z.enum(["CASH", "CARD", "BANK_TRANSFER", "MOBILE_MONEY", "MIXED"]);

// Base schemas for order items and layaway plans
export const OrderItemSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().min(1),
  length: z.number().min(0.01),
  width: z.number().min(0.01),
  unitPrice: z.number().min(0.01),
  discount: z.number().min(0.00).max(100.00),
  notes: z.string().optional(),
  area: z.number().optional(),
  lineTotalBeforeDiscount: z.number().optional(),
});

export const LayawayPlanSchema = z.object({
  depositAmount: z.number(),
  installmentAmount: z.number(),
  numberOfInstallments: z.number().int(),
  installmentFrequencyDays: z.number().int(),
  firstInstallmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const PaymentSchema = z.object({
  orderId: z.number().int(),
  amount: z.number(),
  paymentMethod: PaymentMethodEnum,
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
});

// Order creation schemas
export const CreateQuotationSchema = z.object({
  orderItems: z.array(OrderItemSchema).min(1),
  notes: z.string().optional(),
});

export const CreateLayawaySchema = z.object({
  orderItems: z.array(OrderItemSchema).min(1),
  notes: z.string().optional(),
  paymentAmount: z.number().min(0.00),
  paymentMethod: PaymentMethodEnum,
  layawayPlan: LayawayPlanSchema,
});

export const CreateImmediateSaleSchema = z.object({
  orderItems: z.array(OrderItemSchema).min(1),
  notes: z.string().optional(),
  paymentAmount: z.number().min(0.01),
  paymentMethod: PaymentMethodEnum,
});

export const CreateFutureCollectionSchema = z.object({
  orderItems: z.array(OrderItemSchema).min(1),
  notes: z.string().optional(),
  paymentAmount: z.number().min(0.01),
  paymentMethod: PaymentMethodEnum,
  expectedCollectionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// Convert quotation schema
export const ConvertQuotationSchema = z.object({
  orderItems: z.array(OrderItemSchema),
  paymentAmount: z.number().optional(),
  paymentMethod: PaymentMethodEnum.optional(),
  expectedCollectionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  layawayPlan: LayawayPlanSchema.optional(),
  notes: z.string().optional(),
});

// Layaway payment schema
export const LayawayPaymentSchema = z.object({
  amount: z.number(),
  paymentMethod: PaymentMethodEnum,
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
});

// Order search schema
export const OrderSearchSchema = z.object({
  orderNumber: z.string().optional(),
  orderType: OrderTypeEnum.optional(),
  status: OrderStatusEnum.optional(),
  customerId: z.number().int().optional(),
  branchId: z.string().uuid().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  page: z.number().int().optional(),
  size: z.number().int().optional(),
});

// Parameter schemas for list operations
export const OrderListParamsSchema = z.object({
  page: z.number().int().optional(),
  size: z.number().int().optional(),
  sortBy: z.string().optional(),
  sortDir: z.string().optional(),
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