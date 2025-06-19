'use server';

import { APIResponse } from "@/lib/http-service/apiClient";
import { batchService } from "@/lib/http-service/batches";
import { CreateBatchSchema, UpdateBatchSchema } from "@/lib/http-service/batches/schema";
import { 
  CreateBatchPayload, 
  CreateBatchResponse, 
  GetBatchesResponse, 
  GetBatchResponse, 
  UpdateBatchPayload, 
  UpdateBatchResponse,
  BatchPaginationParams
} from "@/lib/http-service/batches/types";
import { revalidatePath } from "next/cache";

export async function createBatchAction(formData: FormData, branchId: string): Promise<APIResponse<CreateBatchResponse, CreateBatchPayload>> {
  const rawData: CreateBatchPayload = {
    batchNumber: formData.get('batchNumber') as string,
    description: formData.get('description') as string || undefined,
  }

  // Validate the form data
  const validatedData = CreateBatchSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await batchService.createBatch(branchId, validatedData.data as CreateBatchPayload);

  if (res.success) {
    revalidatePath('/batches');
    revalidatePath(`/branches/${branchId}/batches`);
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

export async function updateBatchAction(formData: FormData, batchId: number): Promise<APIResponse<UpdateBatchResponse, UpdateBatchPayload>> {
  const rawData: UpdateBatchPayload = {
    batchNumber: formData.get('batchNumber') as string,
    description: formData.get('description') as string || undefined,
  }

  // Validate the form data
  const validatedData = UpdateBatchSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await batchService.updateBatch(validatedData.data as UpdateBatchPayload, batchId);

  if (res.success) {
    revalidatePath(`/batches/${batchId}`);
    revalidatePath('/batches');
    revalidatePath(`/batches/${batchId}/edit`);
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

export async function deleteBatchAction(batchId: number): Promise<APIResponse<void>> {
  const res = await batchService.deleteBatch(batchId);
  
  if (res.success) {
    revalidatePath('/batches');
  }
  
  return res;
}

export async function getBatchAction(batchId: number): Promise<APIResponse<GetBatchResponse>> {
  return await batchService.get_batch(batchId);
}

export async function getBatchByNumberAction(batchNumber: string): Promise<APIResponse<GetBatchResponse>> {
  return await batchService.getBatchByNumber(batchNumber);
}

export async function getBatchesAction(params?: BatchPaginationParams): Promise<APIResponse<GetBatchesResponse>> {
  return await batchService.get_batches(params);
}

/**
 * Get batches with revalidation - useful for pages that need fresh data
 */
export async function getBatchesWithRevalidationAction(params?: BatchPaginationParams): Promise<APIResponse<GetBatchesResponse>> {
  const res = await batchService.get_batches(params);
  
  if (res.success) {
    revalidatePath('/batches');
  }
  
  return res;
}

/**
 * Get batch details with revalidation
 */
export async function getBatchWithRevalidationAction(batchId: number): Promise<APIResponse<GetBatchResponse>> {
  const res = await batchService.get_batch(batchId);
  
  if (res.success) {
    revalidatePath(`/batches/${batchId}`);
  }
  
  return res;
}