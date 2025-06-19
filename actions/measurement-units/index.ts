'use server';

import { APIResponse } from "@/lib/http-service/apiClient";
import { measurementUnitService } from "@/lib/http-service/measurement-units";
import { CreateMeasurementUnitSchema, UpdateMeasurementUnitSchema } from "@/lib/http-service/measurement-units/schema";
import { 
  CreateMeasurementUnitPayload, 
  CreateMeasurementUnitResponse, 
  GetMeasurementUnitsResponse, 
  GetMeasurementUnitResponse, 
  UpdateMeasurementUnitPayload, 
  UpdateMeasurementUnitResponse 
} from "@/lib/http-service/measurement-units/types";
import { revalidatePath } from "next/cache";

export async function createMeasurementUnitAction(formData: FormData): Promise<APIResponse<CreateMeasurementUnitResponse, CreateMeasurementUnitPayload>> {
  const rawData: CreateMeasurementUnitPayload = {
    unitOfMeasure: formData.get('unitOfMeasure') as string,
  }

  // Validate the form data
  const validatedData = CreateMeasurementUnitSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await measurementUnitService.createMeasurementUnit(validatedData.data as CreateMeasurementUnitPayload);

  if (res.success) {
    revalidatePath('/measurement-units');
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

export async function updateMeasurementUnitAction(formData: FormData, measurementUnitId: number): Promise<APIResponse<UpdateMeasurementUnitResponse, UpdateMeasurementUnitPayload>> {
  const rawData: UpdateMeasurementUnitPayload = {
    unitOfMeasure: formData.get('unitOfMeasure') as string,
  }

  // Validate the form data
  const validatedData = UpdateMeasurementUnitSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await measurementUnitService.updateMeasurementUnit(validatedData.data as UpdateMeasurementUnitPayload, measurementUnitId);

  if (res.success) {
    revalidatePath(`/measurement-units/${measurementUnitId}`);
    revalidatePath('/measurement-units');
    revalidatePath(`/measurement-units/${measurementUnitId}/edit`);
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

export async function deleteMeasurementUnitAction(measurementUnitId: number): Promise<APIResponse<void>> {
  const res = await measurementUnitService.deleteMeasurementUnit(measurementUnitId);
  
  if (res.success) {
    revalidatePath('/measurement-units');
  }
  
  return res;
}

export async function getMeasurementUnitAction(measurementUnitId: number): Promise<APIResponse<GetMeasurementUnitResponse>> {
  return await measurementUnitService.get_measurementUnit(measurementUnitId);
}

export async function getMeasurementUnitsAction(): Promise<APIResponse<GetMeasurementUnitsResponse>> {
  return await measurementUnitService.get_measurementUnits();
}