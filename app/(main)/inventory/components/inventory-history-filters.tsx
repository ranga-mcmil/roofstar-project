'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from "@/components/ui/input";
import { Loader2, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface InventoryHistoryFiltersProps {
  startDate?: string;
  endDate?: string;
  isLoading?: boolean;
}

export function InventoryHistoryFilters({ 
  startDate,
  endDate,
  isLoading = false 
}: InventoryHistoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Combined loading state
  const loading = isLoading || isPending;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStartDate = formData.get('startDate') as string || '';
    const newEndDate = formData.get('endDate') as string || '';
    
    // Create new URL with the form values
    const params = new URLSearchParams(searchParams.toString());
    
    // Update date filters
    if (newStartDate) {
      params.set('startDate', newStartDate);
    } else {
      params.delete('startDate');
    }
    
    if (newEndDate) {
      params.set('endDate', newEndDate);
    } else {
      params.delete('endDate');
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Use transition to show loading state
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Clear date filters
  const clearDateFilters = () => {
    // Create new params without date filters
    const params = new URLSearchParams(searchParams.toString());
    params.delete('startDate');
    params.delete('endDate');
    
    // Reset to page 1
    params.set('page', '1');
    
    // Use transition to show loading state
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  if (loading) {
    // Loading skeleton for filters
    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4 md:flex-row md:items-center mb-4" onSubmit={handleSubmit}>
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-xs text-muted-foreground mb-1">Start Date</label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            className="w-[160px]"
            defaultValue={startDate}
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-xs text-muted-foreground mb-1">End Date</label>
          <Input
            type="date"
            id="endDate"
            name="endDate"
            className="w-[160px]"
            defaultValue={endDate}
            disabled={isPending}
          />
        </div>
        
        <div className="flex mt-5 space-x-2">
          <Button 
            type="submit" 
            size="sm" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Filtering...
              </>
            ) : (
              'Apply'
            )}
          </Button>
          
          {(startDate || endDate) && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={clearDateFilters}
              disabled={isPending}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}