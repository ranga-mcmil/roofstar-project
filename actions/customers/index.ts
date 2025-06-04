// actions/customers/index.ts
'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { customerService } from "@/lib/http-service/customers";
import { CreateCustomerSchema, UpdateCustomerSchema } from "@/lib/http-service/customers/schema";
import { 
  CreateCustomerPayload, 
  CreateCustomerResponse, 
  GetCustomersResponse, 
  GetCustomerResponse, 
  UpdateCustomerPayload, 
  UpdateCustomerResponse,
  CustomerPaginationParams
} from "@/lib/http-service/customers/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createCustomerAction(formData: FormData): Promise<APIResponse<CreateCustomerResponse, CreateCustomerPayload>> {
  const rawData: CreateCustomerPayload = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    email: formData.get('email') as string || undefined,
    address: formData.get('address') as string || undefined,
    tin: formData.get('tin') as string || undefined,
    vatNumber: formData.get('vatNumber') as string || undefined,
  }

  // Validate the form data
  const validatedData = CreateCustomerSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await customerService.createCustomer(validatedData.data as CreateCustomerPayload);

  if (res.success) {
    revalidatePath('/customers');
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

export async function updateCustomerAction(formData: FormData, customerId: number): Promise<APIResponse<UpdateCustomerResponse, UpdateCustomerPayload>> {
  const rawData: UpdateCustomerPayload = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    email: formData.get('email') as string || undefined,
    address: formData.get('address') as string || undefined,
    tin: formData.get('tin') as string || undefined,
    vatNumber: formData.get('vatNumber') as string || undefined,
  }

  // Validate the form data
  const validatedData = UpdateCustomerSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await customerService.updateCustomer(validatedData.data as UpdateCustomerPayload, customerId);

  if (res.success) {
    revalidatePath(`/customers/${customerId}`);
    revalidatePath('/customers');
    revalidatePath(`/customers/${customerId}/edit`);
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

export async function deleteCustomerAction(customerId: number): Promise<APIResponse<void>> {
  const res = await customerService.deleteCustomer(customerId);
  
  if (res.success) {
    revalidatePath('/customers');
  }
  
  return res;
}

export async function getCustomerAction(customerId: number): Promise<APIResponse<GetCustomerResponse>> {
  return await customerService.get_customer(customerId);
}

export async function getCustomersAction(params?: CustomerPaginationParams): Promise<APIResponse<GetCustomersResponse>> {
  return await customerService.get_customers(params);
}