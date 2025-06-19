'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";

interface MeasurementUnitsFiltersProps {
  currentSearch: string
  isLoading?: boolean
}

export function MeasurementUnitsFilters({ 
  currentSearch, 
  isLoading = false 
}: MeasurementUnitsFiltersProps) {
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
          placeholder="Search measurement units..."
          className="pl-8 w-full sm:w-[300px]"
          defaultValue={currentSearch}
          disabled={isPending}
        />
      </div>
      <button type="submit" className="sr-only" disabled={isPending}>
        Apply Filters
      </button>
    </form>
  )
}