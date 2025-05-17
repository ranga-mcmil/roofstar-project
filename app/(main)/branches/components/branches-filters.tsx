'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";

interface BranchesFiltersProps {
  currentSearch: string
  currentStatus: string
  isLoading?: boolean // Added prop to detect loading state from parent
}

export function BranchesFilters({ 
  currentSearch, 
  currentStatus, 
  isLoading = false 
}: BranchesFiltersProps) {
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
    if (currentSearch) params.set('search', currentSearch);
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
        <div className="relative flex-1">
          <Skeleton className="absolute left-2.5 top-2.5 h-4 w-4" />
          <Skeleton className="h-10 w-full sm:w-[300px]" />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <Skeleton className="h-10 w-[180px]" />
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
          placeholder="Search branches..."
          className="pl-8 w-full sm:w-[300px]"
          defaultValue={currentSearch}
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <button type="submit" className="sr-only" disabled={isPending}>
          Apply Filters
        </button>
      </div>
    </form>
  )
}