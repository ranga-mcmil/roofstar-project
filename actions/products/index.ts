'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { productService } from "@/lib/http-service/products";
import { CreateProductSchema, UpdateProductSchema, TypeOfProductStatusEnum } from "@/lib/http-service/products/schema";
import { 
  CreateProductPayload, 
  CreateProductResponse, 
  GetProductsResponse, 
  GetProductResponse, 
  UpdateProductPayload, 
  UpdateProductResponse,
  PaginationParams,
  TypeOfProductStatus
} from "@/lib/http-service/products/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData): Promise<APIResponse<CreateProductResponse, CreateProductPayload>> {
  const rawData: CreateProductPayload = {
    name: formData.get('name') as string || undefined,
    code: parseInt(formData.get('code') as string),
    colorId: parseInt(formData.get('colorId') as string),
    thicknessId: parseInt(formData.get('thicknessId') as string),
    productCategoryId: parseInt(formData.get('productCategoryId') as string),
    price: parseFloat(formData.get('price') as string),
    unitOfMeasureId: parseInt(formData.get('unitOfMeasureId') as string),
    typeOfProduct: formData.get('typeOfProduct') as TypeOfProductStatus,
    isReferable: formData.get('isReferable') === 'true' || undefined,
    referrablePercentage: formData.get('referrablePercentage') ? parseFloat(formData.get('referrablePercentage') as string) : undefined,
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
    name: formData.get('name') as string || undefined,
    code: parseInt(formData.get('code') as string),
    colorId: parseInt(formData.get('colorId') as string),
    thicknessId: parseInt(formData.get('thicknessId') as string),
    productCategoryId: parseInt(formData.get('productCategoryId') as string),
    price: parseFloat(formData.get('price') as string),
    unitOfMeasureId: parseInt(formData.get('unitOfMeasureId') as string),
    typeOfProduct: formData.get('typeOfProduct') as TypeOfProductStatus,
    isReferable: formData.get('isReferable') === 'true' || undefined,
    referrablePercentage: formData.get('referrablePercentage') ? parseFloat(formData.get('referrablePercentage') as string) : undefined,
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
  const res = await productService.deleteProduct(productId);
  
  if (res.success) {
    revalidatePath('/products');
  }
  
  return res;
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

/**
 * Get products with revalidation - useful for pages that need fresh data
 */
export async function getProductsWithRevalidationAction(params?: PaginationParams): Promise<APIResponse<GetProductsResponse>> {
  const res = await productService.get_products(params);
  
  if (res.success) {
    revalidatePath('/products');
  }
  
  return res;
}

/**
 * Get product details with revalidation
 */
export async function getProductWithRevalidationAction(productId: number): Promise<APIResponse<GetProductResponse>> {
  const res = await productService.get_product(productId);
  
  if (res.success) {
    revalidatePath(`/products/${productId}`);
  }
  
  return res;
}

/**
 * Helper action to get products by category with revalidation
 */
export async function getProductsByCategoryWithRevalidationAction(
  categoryId: number, 
  params?: PaginationParams
): Promise<APIResponse<GetProductsResponse>> {
  const res = await productService.getProductsByCategory(categoryId, params);
  
  if (res.success) {
    revalidatePath(`/categories/${categoryId}/products`);
    revalidatePath('/products');
  }
  
  return res;
}

/**
 * Helper action to get products by branch with revalidation
 */
export async function getProductsByBranchWithRevalidationAction(
  branchId: string, 
  params?: PaginationParams
): Promise<APIResponse<GetProductsResponse>> {
  const res = await productService.getProductsByBranch(branchId, params);
  
  if (res.success) {
    revalidatePath(`/branches/${branchId}/products`);
    revalidatePath('/products');
  }
  
  return res;
}