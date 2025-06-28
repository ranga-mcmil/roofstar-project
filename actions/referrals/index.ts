'use server';

import { APIResponse } from "@/lib/http-service/apiClient";
import { referralService } from "@/lib/http-service/referrals";
import { 
  CreateReferralSchema, 
  UpdateReferralSchema,
  ReferralSearchSchema,
  PhoneNumberSchema
} from "@/lib/http-service/referrals/schema";
import { 
  CreateReferralPayload,
  CreateReferralResponse,
  GetReferralResponse,
  UpdateReferralPayload,
  UpdateReferralResponse,
  GetAllReferralsResponse,
  SearchReferralsResponse,
  GetReferralsByPhoneResponse,
  CheckReferralExistsResponse,
  ReferralPaginationParams,
  ReferralSearchPayload,
  PhoneNumberPayload
} from "@/lib/http-service/referrals/types";
import { revalidatePath } from "next/cache";

// =====================================
// CRUD ACTIONS
// =====================================

export async function createReferralAction(formData: FormData): Promise<APIResponse<CreateReferralResponse, CreateReferralPayload>> {
  const rawData: CreateReferralPayload = {
    fullName: formData.get('fullName') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    address: formData.get('address') as string || undefined,
  }

  // Validate the form data
  const validatedData = CreateReferralSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await referralService.createReferral(validatedData.data);

  if (res.success) {
    revalidatePath('/referrals');
    revalidatePath('/referrals/search');
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

export async function updateReferralAction(formData: FormData, referralId: number): Promise<APIResponse<UpdateReferralResponse, UpdateReferralPayload>> {
  const rawData: UpdateReferralPayload = {
    fullName: formData.get('fullName') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    address: formData.get('address') as string || undefined,
  }

  // Validate the form data
  const validatedData = UpdateReferralSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await referralService.updateReferral(validatedData.data, referralId);

  if (res.success) {
    revalidatePath(`/referrals/${referralId}`);
    revalidatePath('/referrals');
    revalidatePath(`/referrals/${referralId}/edit`);
    revalidatePath('/referrals/search');
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

export async function deleteReferralAction(referralId: number): Promise<APIResponse<void>> {
  const res = await referralService.deleteReferral(referralId);
  
  if (res.success) {
    revalidatePath('/referrals');
    revalidatePath('/referrals/search');
  }
  
  return res;
}

export async function getReferralAction(referralId: number): Promise<APIResponse<GetReferralResponse>> {
  return await referralService.getReferral(referralId);
}

export async function getAllReferralsAction(params?: ReferralPaginationParams): Promise<APIResponse<GetAllReferralsResponse>> {
  return await referralService.getAllReferrals(params);
}

// =====================================
// SEARCH ACTIONS
// =====================================

export async function searchReferralsAction(formData: FormData): Promise<APIResponse<SearchReferralsResponse, ReferralSearchPayload>> {
  const rawData: ReferralSearchPayload = {
    searchTerm: formData.get('searchTerm') as string || undefined,
    pageNo: formData.get('pageNo') ? parseInt(formData.get('pageNo') as string) : 0,
    pageSize: formData.get('pageSize') ? parseInt(formData.get('pageSize') as string) : 10,
    sortBy: formData.get('sortBy') as string || 'id',
    sortDir: (formData.get('sortDir') as 'asc' | 'desc') || 'asc',
  }

  // Validate the form data
  const validatedData = ReferralSearchSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the search form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await referralService.searchReferrals(validatedData.data);

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

export async function searchReferralsDirectAction(params: ReferralSearchPayload): Promise<APIResponse<SearchReferralsResponse>> {
  return await referralService.searchReferrals(params);
}

// =====================================
// PHONE NUMBER ACTIONS
// =====================================

export async function getReferralsByPhoneAction(phoneNumber: string): Promise<APIResponse<GetReferralsByPhoneResponse>> {
  // Validate phone number
  const validatedData = PhoneNumberSchema.safeParse({ phoneNumber });

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Invalid phone number provided',
      fieldErrors: validatedData.error.flatten().fieldErrors,
    };
  }

  return await referralService.getReferralsByPhone(phoneNumber);
}

export async function checkReferralExistsAction(phoneNumber: string): Promise<APIResponse<CheckReferralExistsResponse>> {
  // Validate phone number
  const validatedData = PhoneNumberSchema.safeParse({ phoneNumber });

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Invalid phone number provided',
      fieldErrors: validatedData.error.flatten().fieldErrors,
    };
  }

  return await referralService.checkReferralExists(phoneNumber);
}

export async function getReferralsByPhoneWithValidationAction(formData: FormData): Promise<APIResponse<GetReferralsByPhoneResponse, PhoneNumberPayload>> {
  const rawData: PhoneNumberPayload = {
    phoneNumber: formData.get('phoneNumber') as string,
  }

  // Validate the form data
  const validatedData = PhoneNumberSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please provide a valid phone number',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await referralService.getReferralsByPhone(validatedData.data.phoneNumber);

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

// =====================================
// UTILITY ACTIONS
// =====================================

/**
 * Get referrals with revalidation - useful for pages that need fresh data
 */
export async function getAllReferralsWithRevalidationAction(params?: ReferralPaginationParams): Promise<APIResponse<GetAllReferralsResponse>> {
  const res = await referralService.getAllReferrals(params);
  
  if (res.success) {
    revalidatePath('/referrals');
  }
  
  return res;
}

/**
 * Get referral details with revalidation
 */
export async function getReferralWithRevalidationAction(referralId: number): Promise<APIResponse<GetReferralResponse>> {
  const res = await referralService.getReferral(referralId);
  
  if (res.success) {
    revalidatePath(`/referrals/${referralId}`);
  }
  
  return res;
}

/**
 * Quick referral lookup by phone with caching
 */
export async function quickReferralLookupAction(phoneNumber: string): Promise<APIResponse<{ exists: boolean; referrals: GetReferralsByPhoneResponse }>> {
  try {
    const [existsResult, referralsResult] = await Promise.all([
      referralService.checkReferralExists(phoneNumber),
      referralService.getReferralsByPhone(phoneNumber)
    ]);

    if (existsResult.success && referralsResult.success) {
      return {
        success: true,
        data: {
          exists: existsResult.data || false,
          referrals: referralsResult.data || []
        }
      };
    } else {
      return {
        success: false,
        error: existsResult.error || referralsResult.error || 'Failed to lookup referral'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'An unknown error occurred during referral lookup'
    };
  }
}

/**
 * Bulk delete referrals
 */
export async function bulkDeleteReferralsAction(referralIds: number[]): Promise<APIResponse<void>[]> {
  const promises = referralIds.map(id => referralService.deleteReferral(id));
  const results = await Promise.all(promises);
  
  // Revalidate if any were successful
  if (results.some(result => result.success)) {
    revalidatePath('/referrals');
    revalidatePath('/referrals/search');
  }
  
  return results;
}