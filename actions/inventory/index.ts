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
  GetInventoryAdjustmentsResponse,
  PaginationParams
} from "@/lib/http-service/inventory/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function addInventoryAction(formData: FormData, productId: number): Promise<APIResponse<Record<string, string>, AddInventoryPayload>> {
  const rawData: AddInventoryPayload = {
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

  const res = await inventoryService.addInventory(productId, validatedData.data as AddInventoryPayload);

  if (res.success) {
    revalidatePath(`/products/${productId}`);
    revalidatePath(`/inventory/products/${productId}/history`);
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
  movementType: string
): Promise<APIResponse<Record<string, string>, AdjustInventoryPayload>> {
  const rawData: AdjustInventoryPayload = {
    quantity: parseFloat(formData.get('quantity') as string),
    reason: formData.get('reason') as string,
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
    movementType, 
    validatedData.data as AdjustInventoryPayload
  );

  if (res.success) {
    revalidatePath(`/products/${productId}`);
    revalidatePath(`/inventory/products/${productId}/history`);
    revalidatePath(`/inventory/adjustments`);
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