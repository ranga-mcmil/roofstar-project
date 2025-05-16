'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { productService } from "@/lib/http-service/products";
import { CreateProductSchema, UpdateProductSchema } from "@/lib/http-service/products/schema";
import { 
  CreateProductPayload, 
  CreateProductResponse, 
  GetProductsResponse, 
  GetProductResponse, 
  UpdateProductPayload, 
  UpdateProductResponse,
  PaginationParams
} from "@/lib/http-service/products/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData): Promise<APIResponse<CreateProductResponse, CreateProductPayload>> {
  const rawData: CreateProductPayload = {
    name: formData.get('name') as string,
    code: parseInt(formData.get('code') as string),
    colorId: parseInt(formData.get('colorId') as string),
    thicknessId: parseInt(formData.get('thicknessId') as string),
    productCategoryId: parseInt(formData.get('productCategoryId') as string),
    price: parseFloat(formData.get('price') as string),
  }

  // Validate the form data
  const validatedData = CreateProductSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await productService.createProduct(validatedData.data as CreateProductPayload);

  if (res.success) {
    revalidatePath('/products');
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

export async function updateProductAction(formData: FormData, productId: number): Promise<APIResponse<UpdateProductResponse, UpdateProductPayload>> {
  const rawData: UpdateProductPayload = {
    name: formData.get('name') as string,
    code: parseInt(formData.get('code') as string),
    colorId: parseInt(formData.get('colorId') as string),
    thicknessId: parseInt(formData.get('thicknessId') as string),
    productCategoryId: parseInt(formData.get('productCategoryId') as string),
    price: parseFloat(formData.get('price') as string),
  }

  // Validate the form data
  const validatedData = UpdateProductSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await productService.updateProduct(validatedData.data as UpdateProductPayload, productId);

  if (res.success) {
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    revalidatePath(`/products/${productId}/edit`);
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

export async function deleteProductAction(productId: number): Promise<APIResponse<void>> {
  return await productService.deleteProduct(productId);
}

export async function getProductAction(productId: number): Promise<APIResponse<GetProductResponse>> {
  return await productService.get_product(productId);
}

export async function getProductsAction(params?: PaginationParams): Promise<APIResponse<GetProductsResponse>> {
  return await productService.get_products(params);
}

export async function getProductsByCategoryAction(categoryId: number, params?: PaginationParams): Promise<APIResponse<GetProductsResponse>> {
  return await productService.getProductsByCategory(categoryId, params);
}

export async function getProductsByBranchAction(branchId: string, params?: PaginationParams): Promise<APIResponse<GetProductsResponse>> {
  return await productService.getProductsByBranch(branchId, params);
}