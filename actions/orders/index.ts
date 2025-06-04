'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { orderService } from "@/lib/http-service/orders";
import { 
  CreateQuotationSchema, 
  CreateLayawaySchema, 
  CreateImmediateSaleSchema, 
  CreateFutureCollectionSchema,
  ConvertQuotationSchema,
  LayawayPaymentSchema,
  OrderSearchSchema,
  ReverseOrderSchema
} from "@/lib/http-service/orders/schema";
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
  OrderListParams,
  StockMovementParams,
  SalesReportParams,
  OrderType,
  OrderStatus
} from "@/lib/http-service/orders/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// =====================================
// ORDER CREATION ACTIONS
// =====================================

export async function createQuotationAction(
  formData: FormData, 
  customerId: number, 
  branchId: string
): Promise<APIResponse<CreateOrderResponse, CreateQuotationPayload>> {
  const rawData: CreateQuotationPayload = {
    orderItems: JSON.parse(formData.get('orderItems') as string),
    notes: formData.get('notes') as string || undefined,
  }

  // Validate the form data
  const validatedData = CreateQuotationSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await orderService.createQuotation(customerId, branchId, validatedData.data);

  if (res.success) {
    revalidatePath('/orders');
    revalidatePath('/quotations');
    revalidatePath(`/customers/${customerId}/orders`);
    return {
      success: true,
      data: res.data,
    };
  } else {
    return {
      success: false,
      error: res.error,
      inputData: rawData
    }
  }
}

export async function createLayawayAction(
  formData: FormData, 
  customerId: number, 
  branchId: string
): Promise<APIResponse<CreateOrderResponse, CreateLayawayPayload>> {
  const rawData: CreateLayawayPayload = {
    orderItems: JSON.parse(formData.get('orderItems') as string),
    notes: formData.get('notes') as string || undefined,
    paymentAmount: parseFloat(formData.get('paymentAmount') as string),
    paymentMethod: formData.get('paymentMethod') as any,
    layawayPlan: JSON.parse(formData.get('layawayPlan') as string),
  }

  // Validate the form data
  const validatedData = CreateLayawaySchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await orderService.createLayaway(customerId, branchId, validatedData.data);

  if (res.success) {
    revalidatePath('/orders');
    revalidatePath('/layaway');
    revalidatePath(`/customers/${customerId}/orders`);
    return {
      success: true,
      data: res.data,
    };
  } else {
    return {
      success: false,
      error: res.error,
      inputData: rawData
    }
  }
}

export async function createImmediateSaleAction(
  formData: FormData, 
  customerId: number, 
  branchId: string
): Promise<APIResponse<CreateOrderResponse, CreateImmediateSalePayload>> {
  const rawData: CreateImmediateSalePayload = {
    orderItems: JSON.parse(formData.get('orderItems') as string),
    notes: formData.get('notes') as string || undefined,
    paymentAmount: parseFloat(formData.get('paymentAmount') as string),
    paymentMethod: formData.get('paymentMethod') as any,
  }

  // Validate the form data
  const validatedData = CreateImmediateSaleSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await orderService.createImmediateSale(customerId, branchId, validatedData.data);

  if (res.success) {
    revalidatePath('/orders');
    revalidatePath('/sales');
    revalidatePath(`/customers/${customerId}/orders`);
    revalidatePath(`/products`); // Update stock levels
    return {
      success: true,
      data: res.data,
    };
  } else {
    return {
      success: false,
      error: res.error,
      inputData: rawData
    }
  }
}

export async function createFutureCollectionAction(
  formData: FormData, 
  customerId: number, 
  branchId: string
): Promise<APIResponse<CreateOrderResponse, CreateFutureCollectionPayload>> {
  const rawData: CreateFutureCollectionPayload = {
    orderItems: JSON.parse(formData.get('orderItems') as string),
    notes: formData.get('notes') as string || undefined,
    paymentAmount: parseFloat(formData.get('paymentAmount') as string),
    paymentMethod: formData.get('paymentMethod') as any,
    expectedCollectionDate: formData.get('expectedCollectionDate') as string,
  }

  // Validate the form data
  const validatedData = CreateFutureCollectionSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await orderService.createFutureCollection(customerId, branchId, validatedData.data);

  if (res.success) {
    revalidatePath('/orders');
    revalidatePath('/future-collections');
    revalidatePath(`/customers/${customerId}/orders`);
    return {
      success: true,
      data: res.data,
    };
  } else {
    return {
      success: false,
      error: res.error,
      inputData: rawData
    }
  }
}

// =====================================
// ORDER RETRIEVAL ACTIONS
// =====================================

export async function getAllOrdersAction(params?: OrderListParams): Promise<APIResponse<GetOrdersResponse>> {
  return await orderService.getAllOrders(params);
}

export async function getOrderAction(orderId: number): Promise<APIResponse<GetOrderResponse>> {
  return await orderService.getOrder(orderId);
}

export async function getOrderByNumberAction(orderNumber: string): Promise<APIResponse<GetOrderResponse>> {
  return await orderService.getOrderByNumber(orderNumber);
}

export async function searchOrdersAction(formData: FormData): Promise<APIResponse<GetOrdersResponse, OrderSearchPayload>> {
  const rawData: OrderSearchPayload = {
    orderNumber: formData.get('orderNumber') as string || undefined,
    orderType: formData.get('orderType') as OrderType || undefined,
    status: formData.get('status') as OrderStatus || undefined,
    customerId: formData.get('customerId') ? parseInt(formData.get('customerId') as string) : undefined,
    branchId: formData.get('branchId') as string || undefined,
    startDate: formData.get('startDate') as string || undefined,
    endDate: formData.get('endDate') as string || undefined,
    page: formData.get('page') ? parseInt(formData.get('page') as string) : undefined,
    size: formData.get('size') ? parseInt(formData.get('size') as string) : undefined,
  }

  // Validate the form data
  const validatedData = OrderSearchSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the search form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  return await orderService.searchOrders(validatedData.data);
}

// =====================================
// SPECIALIZED RETRIEVAL ACTIONS
// =====================================

export async function getOrdersReadyForCollectionAction(): Promise<APIResponse<CreateOrderResponse[]>> {
  return await orderService.getOrdersReadyForCollection();
}

export async function getActiveLayawayOrdersAction(): Promise<APIResponse<CreateOrderResponse[]>> {
  return await orderService.getActiveLayawayOrders();
}

export async function getOverdueLayawayOrdersAction(): Promise<APIResponse<CreateOrderResponse[]>> {
  return await orderService.getOverdueLayawayOrders();
}

export async function getCustomerOrdersAction(customerId: number): Promise<APIResponse<CreateOrderResponse[]>> {
  return await orderService.getCustomerOrders(customerId);
}

export async function getOrdersByBranchAction(branchId: string, status?: OrderStatus): Promise<APIResponse<CreateOrderResponse[]>> {
  return await orderService.getOrdersByBranch(branchId, status);
}

// =====================================
// ORDER MANAGEMENT ACTIONS
// =====================================

export async function convertQuotationAction(
  formData: FormData, 
  quotationId: number, 
  orderType: OrderType
): Promise<APIResponse<CreateOrderResponse, ConvertQuotationPayload>> {
  const rawData: ConvertQuotationPayload = {
    orderItems: JSON.parse(formData.get('orderItems') as string),
    paymentAmount: formData.get('paymentAmount') ? parseFloat(formData.get('paymentAmount') as string) : undefined,
    paymentMethod: formData.get('paymentMethod') as any || undefined,
    expectedCollectionDate: formData.get('expectedCollectionDate') as string || undefined,
    layawayPlan: formData.get('layawayPlan') ? JSON.parse(formData.get('layawayPlan') as string) : undefined,
    notes: formData.get('notes') as string || undefined,
  }

  // Validate the form data
  const validatedData = ConvertQuotationSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await orderService.convertQuotation(quotationId, orderType, validatedData.data);

  if (res.success) {
    revalidatePath('/orders');
    revalidatePath('/quotations');
    revalidatePath(`/orders/${quotationId}`);
    return {
      success: true,
      data: res.data,
    };
  } else {
    return {
      success: false,
      error: res.error,
      inputData: rawData
    }
  }
}

export async function markReadyForCollectionAction(orderId: number): Promise<APIResponse<CreateOrderResponse>> {
  const res = await orderService.markReadyForCollection(orderId);
  
  if (res.success) {
    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/orders');
    revalidatePath('/orders/ready-for-collection');
  }
  
  return res;
}

export async function completeCollectionAction(orderId: number): Promise<APIResponse<CreateOrderResponse>> {
  const res = await orderService.completeCollection(orderId);
  
  if (res.success) {
    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/orders');
    revalidatePath('/orders/ready-for-collection');
  }
  
  return res;
}

export async function reverseOrderAction(formData: FormData, orderId: number): Promise<APIResponse<CreateOrderResponse>> {
  const rawData = {
    reversalReason: formData.get('reversalReason') as string,
  }

  // Validate the form data
  const validatedData = ReverseOrderSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please provide a reversal reason',
      fieldErrors: validatedData.error.flatten().fieldErrors,
    }
  }

  const res = await orderService.reverseOrder(orderId, validatedData.data.reversalReason);
  
  if (res.success) {
    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/orders');
    revalidatePath(`/products`); // Update stock levels
  }
  
  return res;
}

// =====================================
// PAYMENT ACTIONS
// =====================================

export async function processLayawayPaymentAction(
  formData: FormData, 
  orderId: number
): Promise<APIResponse<CreateOrderResponse, LayawayPaymentPayload>> {
  const rawData: LayawayPaymentPayload = {
    amount: parseFloat(formData.get('amount') as string),
    paymentMethod: formData.get('paymentMethod') as any,
    paymentReference: formData.get('paymentReference') as string || undefined,
    notes: formData.get('notes') as string || undefined,
  }

  // Validate the form data
  const validatedData = LayawayPaymentSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the payment form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await orderService.processLayawayPayment(orderId, validatedData.data);

  if (res.success) {
    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}/payments`);
    revalidatePath(`/orders/${orderId}/layaway-summary`);
    revalidatePath('/layaway');
    revalidatePath('/layaway/active');
    revalidatePath('/layaway/overdue');
    return {
      success: true,
      data: res.data,
    };
  } else {
    return {
      success: false,
      error: res.error,
      inputData: rawData
    }
  }
}

export async function getOrderPaymentsAction(orderId: number): Promise<APIResponse<GetOrderPaymentsResponse>> {
  return await orderService.getOrderPayments(orderId);
}

// =====================================
// LAYAWAY SPECIFIC ACTIONS
// =====================================

export async function getLayawayPaymentSummaryAction(orderId: number): Promise<APIResponse<GetLayawayPaymentSummaryResponse>> {
  return await orderService.getLayawayPaymentSummary(orderId);
}

export async function getLayawayScheduleAction(orderId: number): Promise<APIResponse<GetLayawayScheduleResponse>> {
  return await orderService.getLayawaySchedule(orderId);
}

// =====================================
// REPORTING ACTIONS
// =====================================

export async function getStockMovementsAction(params?: StockMovementParams): Promise<APIResponse<GetStockMovementsResponse>> {
  return await orderService.getStockMovements(params);
}

export async function getSalesReportAction(params: SalesReportParams): Promise<APIResponse<GetSalesReportResponse>> {
  return await orderService.getSalesReport(params);
}

// =====================================
// UTILITY ACTIONS
// =====================================

/**
 * Get orders with revalidation - useful for pages that need fresh data
 */
export async function getOrdersWithRevalidationAction(params?: OrderListParams): Promise<APIResponse<GetOrdersResponse>> {
  const res = await orderService.getAllOrders(params);
  
  if (res.success) {
    revalidatePath('/orders');
  }
  
  return res;
}

/**
 * Get order details with revalidation
 */
export async function getOrderWithRevalidationAction(orderId: number): Promise<APIResponse<GetOrderResponse>> {
  const res = await orderService.getOrder(orderId);
  
  if (res.success) {
    revalidatePath(`/orders/${orderId}`);
  }
  
  return res;
}