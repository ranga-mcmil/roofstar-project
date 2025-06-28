'use server';

import { APIResponse } from "@/lib/http-service/apiClient";
import { referralPaymentService } from "@/lib/http-service/referral-payments";
import { 
  UpdateReferralPaymentStatusSchema,
  BranchIdSchema
} from "@/lib/http-service/referral-payments/schema";
import { 
  UpdateReferralPaymentStatusPayload,
  GetAllReferralPaymentsResponse,
  UpdateReferralPaymentStatusResponse,
  ReferralPaymentPaginationParams,
  ReferralPaymentStatus,
  BranchIdPayload
} from "@/lib/http-service/referral-payments/types";
import { revalidatePath } from "next/cache";

// =====================================
// MAIN ACTIONS
// =====================================

export async function getAllReferralPaymentsAction(
  branchId: string, 
  params?: ReferralPaymentPaginationParams
): Promise<APIResponse<GetAllReferralPaymentsResponse>> {
  // Validate branch ID
  const branchValidation = BranchIdSchema.safeParse({ branchId });
  
  if (!branchValidation.success) {
    return {
      success: false,
      error: 'Invalid branch ID provided',
      fieldErrors: branchValidation.error.flatten().fieldErrors,
    };
  }

  return await referralPaymentService.getAllReferralPayments(branchId, params);
}

export async function updateReferralPaymentStatusAction(
  referralPaymentId: number,
  status: ReferralPaymentStatus
): Promise<APIResponse<UpdateReferralPaymentStatusResponse>> {
  // Validate status
  const statusValidation = UpdateReferralPaymentStatusSchema.safeParse({ status });
  
  if (!statusValidation.success) {
    return {
      success: false,
      error: 'Invalid payment status provided',
      fieldErrors: statusValidation.error.flatten().fieldErrors,
    };
  }

  const res = await referralPaymentService.updateReferralPaymentStatus(referralPaymentId, status);

  if (res.success) {
    // Revalidate relevant pages
    revalidatePath('/referral-payments');
    revalidatePath(`/referral-payments/${referralPaymentId}`);
    revalidatePath('/admin/referral-payments');
    revalidatePath('/admin/payments');
    return {
      success: true,
      data: res.data,
    };
  } else {
    return {
      success: false,
      error: res.error,
    }
  }
}

export async function updateReferralPaymentStatusFromFormAction(
  formData: FormData,
  referralPaymentId: number
): Promise<APIResponse<UpdateReferralPaymentStatusResponse, UpdateReferralPaymentStatusPayload>> {
  const rawData: UpdateReferralPaymentStatusPayload = {
    status: formData.get('status') as ReferralPaymentStatus,
  }

  // Validate the form data
  const validatedData = UpdateReferralPaymentStatusSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please select a valid payment status',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await referralPaymentService.updateReferralPaymentStatus(
    referralPaymentId, 
    validatedData.data.status
  );

  if (res.success) {
    // Revalidate relevant pages
    revalidatePath('/referral-payments');
    revalidatePath(`/referral-payments/${referralPaymentId}`);
    revalidatePath('/admin/referral-payments');
    revalidatePath('/admin/payments');
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
 * Get referral payments with revalidation - useful for pages that need fresh data
 */
export async function getAllReferralPaymentsWithRevalidationAction(
  branchId: string, 
  params?: ReferralPaymentPaginationParams
): Promise<APIResponse<GetAllReferralPaymentsResponse>> {
  const res = await getAllReferralPaymentsAction(branchId, params);
  
  if (res.success) {
    revalidatePath('/referral-payments');
    revalidatePath(`/branches/${branchId}/referral-payments`);
  }
  
  return res;
}

/**
 * Get pending referral payments for a branch
 */
export async function getPendingReferralPaymentsAction(
  branchId: string,
  params?: Omit<ReferralPaymentPaginationParams, 'sortBy' | 'sortDir'>
): Promise<APIResponse<GetAllReferralPaymentsResponse>> {
  // For pending payments, we want to sort by creation date (oldest first for processing)
  const queryParams: ReferralPaymentPaginationParams = {
    ...params,
    sortBy: 'createdAt',
    sortDir: 'asc'
  };
  
  return await referralPaymentService.getAllReferralPayments(branchId, queryParams);
}

/**
 * Get paid referral payments for a branch
 */
export async function getPaidReferralPaymentsAction(
  branchId: string,
  params?: Omit<ReferralPaymentPaginationParams, 'sortBy' | 'sortDir'>
): Promise<APIResponse<GetAllReferralPaymentsResponse>> {
  // For paid payments, we want to sort by creation date (newest first)
  const queryParams: ReferralPaymentPaginationParams = {
    ...params,
    sortBy: 'createdAt',
    sortDir: 'desc'
  };
  
  return await referralPaymentService.getAllReferralPayments(branchId, queryParams);
}

/**
 * Approve referral payment
 */
export async function approveReferralPaymentAction(
  referralPaymentId: number
): Promise<APIResponse<UpdateReferralPaymentStatusResponse>> {
  return await updateReferralPaymentStatusAction(referralPaymentId, 'APPROVED');
}

/**
 * Reject referral payment
 */
export async function rejectReferralPaymentAction(
  referralPaymentId: number
): Promise<APIResponse<UpdateReferralPaymentStatusResponse>> {
  return await updateReferralPaymentStatusAction(referralPaymentId, 'REJECTED');
}

/**
 * Mark referral payment as paid
 */
export async function markReferralPaymentAsPaidAction(
  referralPaymentId: number
): Promise<APIResponse<UpdateReferralPaymentStatusResponse>> {
  return await updateReferralPaymentStatusAction(referralPaymentId, 'PAID');
}

/**
 * Cancel referral payment
 */
export async function cancelReferralPaymentAction(
  referralPaymentId: number
): Promise<APIResponse<UpdateReferralPaymentStatusResponse>> {
  return await updateReferralPaymentStatusAction(referralPaymentId, 'CANCELLED');
}

/**
 * Batch update referral payment status
 */
export async function batchUpdateReferralPaymentStatusAction(
  referralPaymentIds: number[],
  status: ReferralPaymentStatus
): Promise<APIResponse<UpdateReferralPaymentStatusResponse>[]> {
  const promises = referralPaymentIds.map(id => 
    referralPaymentService.updateReferralPaymentStatus(id, status)
  );
  
  const results = await Promise.all(promises);
  
  // Revalidate if any were successful
  if (results.some(result => result.success)) {
    revalidatePath('/referral-payments');
    revalidatePath('/admin/referral-payments');
    revalidatePath('/admin/payments');
    
    // Revalidate individual payment pages
    referralPaymentIds.forEach(id => {
      revalidatePath(`/referral-payments/${id}`);
    });
  }
  
  return results;
}

/**
 * Get referral payments summary for a branch (counts by status)
 */
export async function getReferralPaymentsSummaryAction(
  branchId: string
): Promise<APIResponse<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  paid: number;
}>> {
  try {
    // Get a large page to count all payments
    const response = await referralPaymentService.getAllReferralPayments(branchId, {
      pageNo: 0,
      pageSize: 1000, // Adjust based on your needs
      sortBy: 'createdAt',
      sortDir: 'desc'
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to get referral payments'
      };
    }

    const payments = response.data.content;
    const summary = {
      total: payments.length,
      pending: payments.filter(p => p.paymentStatus === 'PENDING').length,
      approved: payments.filter(p => p.paymentStatus === 'APPROVED').length,
      rejected: payments.filter(p => p.paymentStatus === 'REJECTED').length,
      cancelled: payments.filter(p => p.paymentStatus === 'CANCELLED').length,
      paid: payments.filter(p => p.paymentStatus === 'PAID').length,
    };

    return {
      success: true,
      data: summary
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'Failed to calculate referral payments summary'
    };
  }
}