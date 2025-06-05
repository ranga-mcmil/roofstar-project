'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { userService } from "@/lib/http-service/users";
import { 
  CreateUserSchema, 
  UpdateUserSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema
} from "@/lib/http-service/users/schema";
import { 
  CreateUserPayload, 
  CreateUserResponse, 
  GetUsersResponse, 
  GetUserResponse, 
  UpdateUserPayload, 
  UpdateUserResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  UserPaginationParams
} from "@/lib/http-service/users/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createUserAction(formData: FormData): Promise<APIResponse<CreateUserResponse, CreateUserPayload>> {
  const rawData: CreateUserPayload = {
    email: formData.get('email') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    password: formData.get('password') as string,
    role: formData.get('role') as string,
    branchId: formData.get('branchId') as string || undefined,
  }

  // Validate the form data
  const validatedData = CreateUserSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await userService.createUser(validatedData.data as CreateUserPayload);

  if (res.success) {
    revalidatePath('/users');
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

export async function updateUserAction(formData: FormData, userId: string): Promise<APIResponse<UpdateUserResponse, UpdateUserPayload>> {
  const rawData: UpdateUserPayload = {
    email: formData.get('email') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    role: formData.get('role') as string,
  }

  // Validate the form data
  const validatedData = UpdateUserSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await userService.updateUser(validatedData.data as UpdateUserPayload, userId);

  if (res.success) {
    revalidatePath(`/users/${userId}`);
    revalidatePath('/users');
    revalidatePath(`/users/${userId}/edit`);
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

export async function toggleUserStatusAction(userId: string): Promise<APIResponse<Record<string, boolean>>> {
  const res = await userService.toggleUserStatus(userId);
  
  if (res.success) {
    revalidatePath(`/users/${userId}`);
    revalidatePath('/users');
  }
  
  return res;
}

export async function getUserAction(userId: string): Promise<APIResponse<GetUserResponse>> {
  return await userService.get_user(userId);
}

export async function getUsersAction(params?: UserPaginationParams): Promise<APIResponse<GetUsersResponse>> {
  return await userService.get_users(params);
}

export async function getCurrentUserAction(): Promise<APIResponse<GetUserResponse>> {
  return await userService.getCurrentUser();
}

export async function changePasswordAction(formData: FormData, userId: string): Promise<APIResponse<Record<string, string>, ChangePasswordPayload>> {
  const rawData: ChangePasswordPayload = {
    email: formData.get('email') as string,
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
  }

  // Validate the form data
  const validatedData = ChangePasswordSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await userService.changePassword(userId, validatedData.data as ChangePasswordPayload);

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

export async function forgotPasswordAction(formData: FormData, userId: string): Promise<APIResponse<Record<string, string>, ForgotPasswordPayload>> {
  const rawData: ForgotPasswordPayload = {
    newPassword: formData.get('newPassword') as string,
  }

  // Validate the form data
  const validatedData = ForgotPasswordSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await userService.forgotPassword(userId, validatedData.data as ForgotPasswordPayload);

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