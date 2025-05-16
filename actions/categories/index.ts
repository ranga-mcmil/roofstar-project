'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { productCategoryService } from "@/lib/http-service/categories";
import { CreateCategorySchema, UpdateCategorySchema } from "@/lib/http-service/categories/schema";
import { 
  CreateCategoryPayload, 
  CreateCategoryResponse, 
  GetCategoriesResponse, 
  GetCategoryResponse, 
  UpdateCategoryPayload, 
  UpdateCategoryResponse 
} from "@/lib/http-service/categories/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData): Promise<APIResponse<CreateCategoryResponse, CreateCategoryPayload>> {
  const rawData: CreateCategoryPayload = {
    name: formData.get('name') as string,
  }

  // Validate the form data
  const validatedData = CreateCategorySchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await productCategoryService.createCategory(validatedData.data as CreateCategoryPayload);

  if (res.success) {
    revalidatePath('/categories');
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

export async function updateCategoryAction(formData: FormData, categoryId: number): Promise<APIResponse<UpdateCategoryResponse, UpdateCategoryPayload>> {
  const rawData: UpdateCategoryPayload = {
    name: formData.get('name') as string,
  }

  // Validate the form data
  const validatedData = UpdateCategorySchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await productCategoryService.updateCategory(validatedData.data as UpdateCategoryPayload, categoryId);

  if (res.success) {
    revalidatePath(`/categories/${categoryId}`);
    revalidatePath('/categories');
    revalidatePath(`/categories/${categoryId}/edit`);
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

export async function deleteCategoryAction(categoryId: number): Promise<APIResponse<void>> {
  return await productCategoryService.deleteCategory(categoryId);
}

export async function getCategoryAction(categoryId: number): Promise<APIResponse<GetCategoryResponse>> {
  return await productCategoryService.get_category(categoryId);
}

export async function getCategoriesAction(): Promise<APIResponse<GetCategoriesResponse>> {
  return await productCategoryService.get_categories();
}