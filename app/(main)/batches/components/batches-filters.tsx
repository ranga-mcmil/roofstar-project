'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";
import { BranchDTO } from '@/lib/http-service/branches/types';

interface BatchesFiltersProps {
  currentSearch: string
  currentBranch: string
  branches: BranchDTO[]
  isLoading?: boolean
}

export function BatchesFilters({ 
  currentSearch, 
  currentBranch,
  branches = [],
  isLoading = false 
}: BatchesFiltersProps) {
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
    if (currentBranch !== 'all') params.set('branchId', currentBranch);
    // Reset to page 1 when search changes
    params.set('page', '1');
    
    // Use transition to show loading state
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Handle branch change - auto-submit when branch changes
  const handleBranchChange = (value: string) => {
    // Create new params
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (value !== 'all') params.set('branchId', value);
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
          <Skeleton className="h-10 w-[160px]" />
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
          placeholder="Search batches..."
          className="pl-8 w-full sm:w-[300px]"
          defaultValue={currentSearch}
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <Select 
          name="branchId" 
          defaultValue={currentBranch}
          onValueChange={handleBranchChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <button type="submit" className="sr-only" disabled={isPending}>
          Apply Filters
        </button>
      </div>
    </form>
  )
}