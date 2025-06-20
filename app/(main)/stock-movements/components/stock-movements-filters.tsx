'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";

interface StockMovementsFiltersProps {
  currentSearch: string
  currentMovementType: string
  currentIsReversed: string
  isLoading?: boolean
}

export function StockMovementsFilters({ 
  currentSearch, 
  currentMovementType,
  currentIsReversed,
  isLoading = false 
}: StockMovementsFiltersProps) {
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
    
    // Create new URL with the form values
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (currentMovementType) params.set('movementType', currentMovementType);
    if (currentIsReversed) params.set('isReversed', currentIsReversed);
    // Reset to page 1 when search changes
    params.set('page', '1');
    
    // Use transition to show loading state
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Handle movement type change
  const handleMovementTypeChange = (value: string) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (value && value !== 'all') params.set('movementType', value);
    if (currentIsReversed) params.set('isReversed', currentIsReversed);
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Handle reversed status change
  const handleReversedChange = (value: string) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (currentMovementType) params.set('movementType', currentMovementType);
    if (value && value !== 'all') params.set('isReversed', value);
    // Reset to page 1 when filters change
    params.set('page', '1');
    
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
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[150px]" />
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
          placeholder="Search movements..."
          className="pl-8 w-full sm:w-[300px]"
          defaultValue={currentSearch}
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <Select 
          name="movementType" 
          defaultValue={currentMovementType || 'all'}
          onValueChange={handleMovementTypeChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Movement Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ADD">Add</SelectItem>
            <SelectItem value="SALE">Sale</SelectItem>
            <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
            <SelectItem value="RESTOCK">Restock</SelectItem>
            <SelectItem value="RETURN">Return</SelectItem>
            <SelectItem value="DAMAGE">Damage</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          name="isReversed" 
          defaultValue={currentIsReversed || 'all'}
          onValueChange={handleReversedChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Reversed</SelectItem>
          </SelectContent>
        </Select>
        
        <button type="submit" className="sr-only" disabled={isPending}>
          Apply Filters
        </button>
      </div>
    </form>
  )
}