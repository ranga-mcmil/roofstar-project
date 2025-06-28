'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { accountsService } from "@/lib/http-service/accounts";
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
  UserPaginationParams,
  ToggleUserStatusResponse,
  ChangePasswordResponse,
  ForgotPasswordResponse,
  GetCurrentUserResponse
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
    revalidatePath('/admin/users');
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
    revalidatePath('/admin/users');
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

export async function toggleUserStatusAction(userId: string): Promise<APIResponse<ToggleUserStatusResponse>> {
  const res = await userService.toggleUserStatus(userId);
  
  if (res.success) {
    revalidatePath(`/users/${userId}`);
    revalidatePath('/users');
    revalidatePath('/admin/users');
  }
  
  return res;
}

export async function getUserAction(userId: string): Promise<APIResponse<GetUserResponse>> {
  return await userService.get_user(userId);
}

export async function getUsersAction(params?: UserPaginationParams): Promise<APIResponse<GetUsersResponse>> {
  return await userService.get_users(params);
}

export async function getCurrentUserAction(): Promise<APIResponse<GetCurrentUserResponse>> {
  return await userService.getCurrentUser();
}

export async function forgotPasswordAction(formData: FormData, userId: string): Promise<APIResponse<ForgotPasswordResponse, ForgotPasswordPayload>> {
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
    // Don't revalidate user pages as this is a password reset, not user data change
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

/**
 * Get users with revalidation - useful for pages that need fresh data
 */
export async function getUsersWithRevalidationAction(params?: UserPaginationParams): Promise<APIResponse<GetUsersResponse>> {
  const res = await userService.get_users(params);
  
  if (res.success) {
    revalidatePath('/users');
    revalidatePath('/admin/users');
  }
  
  return res;
}

/**
 * Get user details with revalidation
 */
export async function getUserWithRevalidationAction(userId: string): Promise<APIResponse<GetUserResponse>> {
  const res = await userService.get_user(userId);
  
  if (res.success) {
    revalidatePath(`/users/${userId}`);
  }
  
  return res;
}

/**
 * Get current user with revalidation
 */
export async function getCurrentUserWithRevalidationAction(): Promise<APIResponse<GetCurrentUserResponse>> {
  const res = await userService.getCurrentUser();
  
  if (res.success) {
    revalidatePath('/profile');
    revalidatePath('/dashboard');
  }
  
  return res;
}

/**
 * Get users by branch with filtering
 */
export async function getUsersByBranchAction(branchId: string, params?: Omit<UserPaginationParams, 'branchId'>): Promise<APIResponse<GetUsersResponse>> {
  const queryParams: UserPaginationParams = {
    ...params,
    branchId
  };
  
  return await userService.get_users(queryParams);
}

/**
 * Batch toggle user status for multiple users
 */
export async function batchToggleUserStatusAction(userIds: string[]): Promise<APIResponse<ToggleUserStatusResponse>[]> {
  const promises = userIds.map(userId => userService.toggleUserStatus(userId));
  const results = await Promise.all(promises);
  
  // Revalidate if any were successful
  if (results.some(result => result.success)) {
    revalidatePath('/users');
    revalidatePath('/admin/users');
    userIds.forEach(userId => {
      revalidatePath(`/users/${userId}`);
    });
  }
  
  return results;
}


/**
 * Change password for the current user (uses auth endpoint)
 * 
 * POST /api/auth/change-password
 */
export async function changePasswordAction(formData: FormData): Promise<APIResponse<ChangePasswordResponse, ChangePasswordPayload>> {
  const rawData: ChangePasswordPayload = {
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

  const res = await accountsService.changePassword(validatedData.data as ChangePasswordPayload);

  if (res.success) {
    // Don't revalidate user pages as this is a password change, not user data change
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

