'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { inventoryService } from "@/lib/http-service/inventory";
import { AddInventorySchema, AdjustInventorySchema } from "@/lib/http-service/inventory/schema";
import { 
  AddInventoryPayload, 
  AdjustInventoryPayload,
  GetInventoryHistoryResponse,
  GetInventoryByBranchResponse,
  GetInventoryByBatchResponse,
  GetInventoryAdjustmentsResponse,
  PaginationParams
} from "@/lib/http-service/inventory/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function addInventoryAction(
  formData: FormData, 
  productId: number, 
  batchId: number // Added missing batchId parameter
): Promise<APIResponse<Record<string, string>, AddInventoryPayload>> {
  const rawData: AddInventoryPayload = {
    length: formData.get('length') ? parseFloat(formData.get('length') as string) : undefined,
    width: formData.get('width') ? parseFloat(formData.get('width') as string) : undefined,
    weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined,
    quantity: parseFloat(formData.get('quantity') as string),
    remarks: formData.get('remarks') as string || undefined,
  }

  // Validate the form data
  const validatedData = AddInventorySchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await inventoryService.addInventory(productId, batchId, validatedData.data as AddInventoryPayload);

  if (res.success) {
    revalidatePath(`/products/${productId}`);
    revalidatePath(`/inventory/products/${productId}/history`);
    revalidatePath(`/batches/${batchId}`);
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

export async function adjustInventoryAction(
  formData: FormData, 
  productId: number, 
  batchId: number, // Added missing batchId parameter
  movementType: string
): Promise<APIResponse<Record<string, string>, AdjustInventoryPayload>> {
  const rawData: AdjustInventoryPayload = {
    length: formData.get('length') ? parseFloat(formData.get('length') as string) : undefined,
    width: formData.get('width') ? parseFloat(formData.get('width') as string) : undefined,
    weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined,
    quantity: parseFloat(formData.get('quantity') as string),
    remarks: formData.get('remarks') as string,
  }

  // Validate the form data
  const validatedData = AdjustInventorySchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await inventoryService.adjustInventory(
    productId, 
    batchId,
    movementType, 
    validatedData.data as AdjustInventoryPayload
  );

  if (res.success) {
    revalidatePath(`/products/${productId}`);
    revalidatePath(`/inventory/products/${productId}/history`);
    revalidatePath(`/inventory/adjustments`);
    revalidatePath(`/batches/${batchId}`);
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

export async function getInventoryHistoryAction(
  productId: number, 
  params?: PaginationParams
): Promise<APIResponse<GetInventoryHistoryResponse>> {
  return await inventoryService.getInventoryHistory(productId, params);
}

export async function getInventoryByBranchAction(
  branchId: string, 
  params?: PaginationParams
): Promise<APIResponse<GetInventoryByBranchResponse>> {
  return await inventoryService.getInventoryByBranch(branchId, params);
}

export async function getInventoryAdjustmentsAction(
  params?: PaginationParams
): Promise<APIResponse<GetInventoryAdjustmentsResponse>> {
  return await inventoryService.getInventoryAdjustments(params);
}

export async function getInventoryByBatchAction(
  batchNumber: string, 
  params?: PaginationParams
): Promise<APIResponse<GetInventoryByBatchResponse>> {
  return await inventoryService.getInventoryByBatch(batchNumber, params);
}

/**
 * Get inventory by batch with revalidation - useful for pages that need fresh data
 */
export async function getInventoryByBatchWithRevalidationAction(
  batchNumber: string, 
  params?: PaginationParams
): Promise<APIResponse<GetInventoryByBatchResponse>> {
  const res = await inventoryService.getInventoryByBatch(batchNumber, params);
  
  if (res.success) {
    revalidatePath(`/inventory/batches/${batchNumber}/history`);
    revalidatePath('/inventory');
  }
  
  return res;
}