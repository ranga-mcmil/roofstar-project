'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Loader2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface InventoryAdjustmentsFiltersProps {
  currentSearch: string;
  currentMovementType: string;
  startDate?: string;
  endDate?: string;
  isLoading?: boolean;
}

export function InventoryAdjustmentsFilters({ 
  currentSearch, 
  currentMovementType,
  startDate,
  endDate,
  isLoading = false 
}: InventoryAdjustmentsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  // Combined loading state
  const loading = isLoading || isPending;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string || '';
    const newStartDate = formData.get('startDate') as string || '';
    const newEndDate = formData.get('endDate') as string || '';
    
    // Create new URL with the form values
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (currentMovementType !== 'all') params.set('movementType', currentMovementType);
    if (newStartDate) params.set('startDate', newStartDate);
    if (newEndDate) params.set('endDate', newEndDate);
    
    // Reset to page 1 when search changes
    params.set('page', '1');
    
    // Use transition to show loading state
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Handle movement type change - auto-submit when it changes
  const handleMovementTypeChange = (value: string) => {
    // Create new params
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (value !== 'all') params.set('movementType', value);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
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
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (currentMovementType !== 'all') params.set('movementType', currentMovementType);
    
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
        <div className="relative flex-1">
          <Skeleton className="absolute left-2.5 top-2.5 h-4 w-4" />
          <Skeleton className="h-10 w-full sm:w-[300px]" />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <Skeleton className="h-10 w-[160px]" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-[160px]" />
            <Skeleton className="h-10 w-[160px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4 md:flex-row md:items-center mb-4" onSubmit={handleSubmit}>
      <div className="relative flex-1">
        {isPending ? (
          <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          type="search"
          name="search"
          placeholder="Search adjustments..."
          className="pl-8 w-full sm:w-[300px]"
          defaultValue={currentSearch}
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <Select 
          name="movementType" 
          defaultValue={currentMovementType}
          onValueChange={handleMovementTypeChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Movement Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="add">Addition</SelectItem>
            <SelectItem value="remove">Reduction</SelectItem>
            <SelectItem value="correct">Correction</SelectItem>
          </SelectContent>
        </Select>
        
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
          
          {(startDate || endDate) && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={clearDateFilters}
              disabled={isPending}
              className="mt-5"
            >
              <Calendar className="h-4 w-4" />
              <span className="sr-only">Clear date filters</span>
            </Button>
          )}
        </div>
        
        <Button type="submit" size="sm" className="md:ml-2" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Filtering...
            </>
          ) : (
            'Apply Filters'
          )}
        </Button>
      </div>
    </form>
  )
}