'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { thicknessService } from "@/lib/http-service/thicknesses";
import { CreateThicknessSchema, UpdateThicknessSchema } from "@/lib/http-service/thicknesses/schema";
import { 
  CreateThicknessPayload, 
  CreateThicknessResponse, 
  GetThicknessesResponse, 
  GetThicknessResponse, 
  UpdateThicknessPayload, 
  UpdateThicknessResponse 
} from "@/lib/http-service/thicknesses/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createThicknessAction(formData: FormData): Promise<APIResponse<CreateThicknessResponse, CreateThicknessPayload>> {
  const rawData: CreateThicknessPayload = {
    thickness: parseFloat(formData.get('thickness') as string),
  }

  // Validate the form data
  const validatedData = CreateThicknessSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await thicknessService.createThickness(validatedData.data as CreateThicknessPayload);

  if (res.success) {
    revalidatePath('/thicknesses');
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

export async function updateThicknessAction(formData: FormData, thicknessId: number): Promise<APIResponse<UpdateThicknessResponse, UpdateThicknessPayload>> {
  const rawData: UpdateThicknessPayload = {
    thickness: parseFloat(formData.get('thickness') as string),
  }

  // Validate the form data
  const validatedData = UpdateThicknessSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await thicknessService.updateThickness(validatedData.data as UpdateThicknessPayload, thicknessId);

  if (res.success) {
    revalidatePath(`/thicknesses/${thicknessId}`);
    revalidatePath('/thicknesses');
    revalidatePath(`/thicknesses/${thicknessId}/edit`);
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

export async function deleteThicknessAction(thicknessId: number): Promise<APIResponse<void>> {
  return await thicknessService.deleteThickness(thicknessId);
}

export async function getThicknessAction(thicknessId: number): Promise<APIResponse<GetThicknessResponse>> {
  return await thicknessService.get_thickness(thicknessId);
}

export async function getThicknessesAction(): Promise<APIResponse<GetThicknessesResponse>> {
  return await thicknessService.get_thicknesses();
}