// app/(main)/referral-payments/components/referral-payments-filters.tsx
'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from "@/components/ui/input"
import { Filter, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

interface ReferralPaymentsFiltersProps {
  currentStatus: string
  currentReferralId: string
  isLoading?: boolean
}

export function ReferralPaymentsFilters({ 
  currentStatus, 
  currentReferralId,
  isLoading = false 
}: ReferralPaymentsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  // Combined loading state
  const loading = isLoading || isPending;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const referralId = formData.get('referralId') as string || '';
    
    // Create new URL with the form values
    const params = new URLSearchParams();
    if (referralId) params.set('referralId', referralId);
    if (currentStatus !== 'all') params.set('status', currentStatus);
    // Reset to page 1 when search changes
    params.set('page', '1');
    
    // Use transition to show loading state
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Handle status change - auto-submit when status changes
  const handleStatusChange = (value: string) => {
    // Create new params
    const params = new URLSearchParams();
    if (currentReferralId) params.set('referralId', currentReferralId);
    if (value !== 'all') params.set('status', value);
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Use transition to show loading state
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  if (loading) {
    // Loading skeleton for filters
    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-end mb-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full sm:w-[200px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4 md:flex-row md:items-end mb-4" onSubmit={handleSubmit}>
      <div className="flex-1 space-y-2">
        <Label htmlFor="referralId">Referral ID</Label>
        <div className="relative">
          {isPending ? (
            <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            id="referralId"
            name="referralId"
            type="number"
            placeholder="Filter by referral ID..."
            className="pl-8 w-full sm:w-[200px]"
            defaultValue={currentReferralId}
            disabled={isPending}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Payment Status</Label>
        <Select 
          name="status" 
          defaultValue={currentStatus}
          onValueChange={handleStatusChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <button type="submit" className="sr-only" disabled={isPending}>
        Apply Filters
      </button>
    </form>
  )
}