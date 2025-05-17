'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { branchesService } from "@/lib/http-service/branches";
import { CreateBranchSchema, UpdateBranchSchema } from "@/lib/http-service/branches/schema";
import { 
  CreateBranchPayload, 
  CreateBranchResponse, 
  GetBranchesResponse, 
  GetBranchResponse, 
  UpdateBranchPayload, 
  UpdateBranchResponse,
  PaginationParams 
} from "@/lib/http-service/branches/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createBranchAction(formData: FormData): Promise<APIResponse<CreateBranchResponse, CreateBranchPayload>> {
  const rawData: CreateBranchPayload = {
    name: formData.get('name') as string,
    address: {
      street: formData.get('street') as string,
      city: formData.get('city') as string,
      province: formData.get('province') as string,
      country: formData.get('country') as string,
      postalCode: formData.get('postalCode') as string,
    },
    location: formData.get('location') as string,
  }

  // Validate the form data
  const validatedData = CreateBranchSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await branchesService.createBranch(validatedData.data as CreateBranchPayload);

  if (res.success) {
    revalidatePath('/branches');

    
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

export async function updateBranchAction(formData: FormData, branchId: string): Promise<APIResponse<UpdateBranchResponse, UpdateBranchPayload>> {
  const rawData: UpdateBranchPayload = {
    name: formData.get('name') as string,
    address: {
      street: formData.get('street') as string,
      city: formData.get('city') as string,
      province: formData.get('province') as string,
      country: formData.get('country') as string,
      postalCode: formData.get('postalCode') as string,
    },
    location: formData.get('location') as string,
  }

  // Validate the form data
  const validatedData = UpdateBranchSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await branchesService.updateBranch(validatedData.data as UpdateBranchPayload, branchId);

  if (res.success) {
    revalidatePath(`/branches/${branchId}`);
    revalidatePath('/branches');
    revalidatePath(`/branches/${branchId}/edit`);
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

export async function deleteBranchAction(branchId: string): Promise<APIResponse<void>> {
  const res = await branchesService.deleteBranch(branchId);
  

  if (res.success) {
    revalidatePath('/branches');
  }
  
  return res;
}

export async function getBranchAction(branchId: string): Promise<APIResponse<GetBranchResponse>> {
  return await branchesService.get_branch(branchId);
}

export async function getBranchesAction(params?: PaginationParams): Promise<APIResponse<GetBranchesResponse>> {
  return await branchesService.get_branches(params);
}

export async function activateBranchAction(branchId: string): Promise<APIResponse<Record<string, string>>> {
  const res = await branchesService.activateBranch(branchId);
  
  if (res.success) {
    revalidatePath(`/branches/${branchId}`);
    revalidatePath('/branches');
  }
  
  return res;
}

export async function deactivateBranchAction(branchId: string): Promise<APIResponse<Record<string, string>>> {
  const res = await branchesService.deactivateBranch(branchId);
  
  if (res.success) {
    revalidatePath(`/branches/${branchId}`);
    revalidatePath('/branches');
  }
  
  return res;
}

export async function getBranchStatsAction(): Promise<APIResponse<any>> {
  return await branchesService.getBranchStats();
}