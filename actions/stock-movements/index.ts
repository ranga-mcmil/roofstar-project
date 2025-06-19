'use server';

import { APIResponse } from "@/lib/http-service/apiClient";
import { stockMovementService } from "@/lib/http-service/stock-movements";
import { StockMovementSearchSchema } from "@/lib/http-service/stock-movements/schema";
import { 
  StockMovementSearchPayload,
  StockMovementPaginationParams,
  UserStockMovementParams,
  ProductStockSummaryParams,
  BranchStockMovementParams,
  MovementTypeParams,
  GetAllStockMovementsResponse,
  GetStockMovementResponse,
  GetUserStockMovementsResponse,
  GetProductStockSummaryResponse,
  SearchStockMovementsResponse,
  GetProductStockHistoryResponse,
  GetOrderStockMovementsResponse,
  GetStockMovementsByTypeResponse,
  GetBranchStockMovementsResponse
} from "@/lib/http-service/stock-movements/types";
import { revalidatePath } from "next/cache";

// =====================================
// MAIN RETRIEVAL ACTIONS
// =====================================

export async function getAllStockMovementsAction(params?: StockMovementPaginationParams): Promise<APIResponse<GetAllStockMovementsResponse>> {
  return await stockMovementService.getAllStockMovements(params);
}

export async function getStockMovementByIdAction(stockMovementId: number): Promise<APIResponse<GetStockMovementResponse>> {
  return await stockMovementService.getStockMovementById(stockMovementId);
}

// =====================================
// USER-SPECIFIC ACTIONS
// =====================================

export async function getUserStockMovementsAction(
  userId: string, 
  params?: UserStockMovementParams
): Promise<APIResponse<GetUserStockMovementsResponse>> {
  return await stockMovementService.getUserStockMovements(userId, params);
}

// =====================================
// PRODUCT-SPECIFIC ACTIONS
// =====================================

export async function getProductStockSummaryAction(
  productId: number, 
  params?: ProductStockSummaryParams
): Promise<APIResponse<GetProductStockSummaryResponse>> {
  return await stockMovementService.getProductStockSummary(productId, params);
}

export async function getProductStockHistoryAction(
  productId: number, 
  params?: StockMovementPaginationParams
): Promise<APIResponse<GetProductStockHistoryResponse>> {
  return await stockMovementService.getProductStockHistory(productId, params);
}

// =====================================
// SEARCH ACTIONS
// =====================================

export async function searchStockMovementsAction(formData: FormData): Promise<APIResponse<SearchStockMovementsResponse, StockMovementSearchPayload>> {
  const rawData: StockMovementSearchPayload = {
    productId: formData.get('productId') ? parseInt(formData.get('productId') as string) : undefined,
    productName: formData.get('productName') as string || undefined,
    orderId: formData.get('orderId') ? parseInt(formData.get('orderId') as string) : undefined,
    orderNumber: formData.get('orderNumber') as string || undefined,
    movementType: formData.get('movementType') as string || undefined,
    branchId: formData.get('branchId') as string || undefined,
    createdById: formData.get('createdById') as string || undefined,
    createdByName: formData.get('createdByName') as string || undefined,
    isReversed: formData.get('isReversed') ? formData.get('isReversed') === 'true' : undefined,
    fromDate: formData.get('fromDate') as string || undefined,
    toDate: formData.get('toDate') as string || undefined,
    pageNo: formData.get('pageNo') ? parseInt(formData.get('pageNo') as string) : undefined,
    pageSize: formData.get('pageSize') ? parseInt(formData.get('pageSize') as string) : undefined,
    sortBy: formData.get('sortBy') as string || undefined,
    sortDir: formData.get('sortDir') as 'asc' | 'desc' || undefined,
  }

  // Validate the form data
  const validatedData = StockMovementSearchSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the search form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await stockMovementService.searchStockMovements(validatedData.data);

  if (res.success) {
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

export async function searchStockMovementsDirectAction(params: StockMovementSearchPayload): Promise<APIResponse<SearchStockMovementsResponse>> {
  return await stockMovementService.searchStockMovements(params);
}

// =====================================
// ORDER-SPECIFIC ACTIONS
// =====================================

export async function getOrderStockMovementsAction(orderId: number): Promise<APIResponse<GetOrderStockMovementsResponse>> {
  return await stockMovementService.getOrderStockMovements(orderId);
}

// =====================================
// MOVEMENT TYPE ACTIONS
// =====================================

export async function getStockMovementsByTypeAction(
  movementType: string, 
  params?: MovementTypeParams
): Promise<APIResponse<GetStockMovementsByTypeResponse>> {
  return await stockMovementService.getStockMovementsByType(movementType, params);
}

// =====================================
// BRANCH-SPECIFIC ACTIONS
// =====================================

export async function getBranchStockMovementsAction(
  branchId: string, 
  params?: BranchStockMovementParams
): Promise<APIResponse<GetBranchStockMovementsResponse>> {
  return await stockMovementService.getBranchStockMovements(branchId, params);
}

// =====================================
// ACTIONS WITH REVALIDATION
// =====================================

export async function getAllStockMovementsWithRevalidationAction(params?: StockMovementPaginationParams): Promise<APIResponse<GetAllStockMovementsResponse>> {
  const res = await stockMovementService.getAllStockMovements(params);
  
  if (res.success) {
    revalidatePath('/stock-movements');
  }
  
  return res;
}

export async function getProductStockHistoryWithRevalidationAction(
  productId: number, 
  params?: StockMovementPaginationParams
): Promise<APIResponse<GetProductStockHistoryResponse>> {
  const res = await stockMovementService.getProductStockHistory(productId, params);
  
  if (res.success) {
    revalidatePath(`/products/${productId}/stock-history`);
    revalidatePath('/stock-movements');
  }
  
  return res;
}

export async function getBranchStockMovementsWithRevalidationAction(
  branchId: string, 
  params?: BranchStockMovementParams
): Promise<APIResponse<GetBranchStockMovementsResponse>> {
  const res = await stockMovementService.getBranchStockMovements(branchId, params);
  
  if (res.success) {
    revalidatePath(`/branches/${branchId}/stock-movements`);
    revalidatePath('/stock-movements');
  }
  
  return res;
}

// =====================================
// REPORTING ACTIONS
// =====================================

export async function getStockMovementReportAction(
  params: StockMovementSearchPayload
): Promise<APIResponse<SearchStockMovementsResponse>> {
  // Enhanced search for reporting purposes
  const reportParams = {
    ...params,
    pageSize: 1000, // Get more records for reports
    sortBy: 'movementDate',
    sortDir: 'desc' as const
  };
  
  return await stockMovementService.searchStockMovements(reportParams);
}

// =====================================
// UTILITY ACTIONS
// =====================================

/**
 * Get stock movements for multiple products
 */
export async function getMultipleProductsStockHistoryAction(
  productIds: number[], 
  params?: StockMovementPaginationParams
): Promise<APIResponse<GetProductStockHistoryResponse>[]> {
  const promises = productIds.map(productId => 
    stockMovementService.getProductStockHistory(productId, params)
  );
  
  return await Promise.all(promises);
}

/**
 * Get comprehensive stock data for a product (history + summary)
 */
export async function getProductStockOverviewAction(
  productId: number,
  historyParams?: StockMovementPaginationParams,
  summaryParams?: ProductStockSummaryParams
): Promise<{
  history: APIResponse<GetProductStockHistoryResponse>;
  summary: APIResponse<GetProductStockSummaryResponse>;
}> {
  const [history, summary] = await Promise.all([
    stockMovementService.getProductStockHistory(productId, historyParams),
    stockMovementService.getProductStockSummary(productId, summaryParams)
  ]);
  
  return { history, summary };
}