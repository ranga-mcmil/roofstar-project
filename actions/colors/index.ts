'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { colorService } from "@/lib/http-service/colors";
import { CreateColorSchema, UpdateColorSchema } from "@/lib/http-service/colors/schema";
import { 
  CreateColorPayload, 
  CreateColorResponse, 
  GetColorsResponse, 
  GetColorResponse, 
  UpdateColorPayload, 
  UpdateColorResponse 
} from "@/lib/http-service/colors/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createColorAction(formData: FormData): Promise<APIResponse<CreateColorResponse, CreateColorPayload>> {
  const rawData: CreateColorPayload = {
    name: formData.get('name') as string,
  }

  // Validate the form data
  const validatedData = CreateColorSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await colorService.createColor(validatedData.data as CreateColorPayload);

  if (res.success) {
    revalidatePath('/colors');
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

export async function updateColorAction(formData: FormData, colorId: number): Promise<APIResponse<UpdateColorResponse, UpdateColorPayload>> {
  const rawData: UpdateColorPayload = {
    name: formData.get('name') as string,
  }

  // Validate the form data
  const validatedData = UpdateColorSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await colorService.updateColor(validatedData.data as UpdateColorPayload, colorId);

  if (res.success) {
    revalidatePath(`/colors/${colorId}`);
    revalidatePath('/colors');
    revalidatePath(`/colors/${colorId}/edit`);
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

export async function deleteColorAction(colorId: number): Promise<APIResponse<void>> {
  return await colorService.deleteColor(colorId);
}

export async function getColorAction(colorId: number): Promise<APIResponse<GetColorResponse>> {
  return await colorService.get_color(colorId);
}

export async function getColorsAction(): Promise<APIResponse<GetColorsResponse>> {
  return await colorService.get_colors();
}