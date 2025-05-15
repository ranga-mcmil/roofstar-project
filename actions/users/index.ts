'use server';

import { APIResponse } from "@/lib/http-service/apiClient";
import { usersService } from "@/lib/http-service/users";
import { CreateUserSchema, UpdateUserSchema } from "@/lib/http-service/users/schema";
import { CreateUserPayload, CreateUserResponse, GetUserResponse, GetUsersResponse, UpdateUserPayload, UpdateUserResponse } from "@/lib/http-service/users/types";
import { revalidatePath } from "next/cache";

export async function createUserAction(formData: FormData): Promise<APIResponse<CreateUserResponse, CreateUserPayload>>  {
    const rawData: CreateUserPayload = {
        email: formData.get('email') as string,
        name: formData.get('name') as string,
        lastName: formData.get('lastName') as string,
        password: formData.get('password') as string,
        role: formData.get('role') as "ROLE_SALES_REP" | "ROLE_MANAGER" | "ROLE_ADMIN",
        branchId: formData.get('branchId') as string,
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

    const res = await usersService.createUser(validatedData.data);

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

export async function updateUserAction(formData: FormData, userId: string): Promise<APIResponse<UpdateUserResponse, UpdateUserPayload>>  {
    const rawData: UpdateUserPayload = {
        email: formData.get('email') as string,
        name: formData.get('name') as string,
        lastName: formData.get('lastName') as string,
        role: formData.get('role') as "ROLE_SALES_REP" | "ROLE_MANAGER" | "ROLE_ADMIN",
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

    const res = await usersService.updateUser(validatedData.data, userId);

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

export async function getUserAction(userId: string): Promise<APIResponse<GetUserResponse>> {
    return await usersService.get_user(userId);
}

export async function getUsersAction(): Promise<APIResponse<GetUsersResponse>> {
    return await usersService.get_users();
}

