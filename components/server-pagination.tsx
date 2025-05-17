'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export function ServerPagination({ 
  currentPage, 
  totalPages, 
  pathName, 
  searchParams = {},
  isLoading = false
}: { 
  currentPage: number; 
  totalPages: number;  
  pathName: string; 
  searchParams?: Record<string, string> | any;
  isLoading?: boolean;
}) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  // Track which button is loading
  const [loadingButton, setLoadingButton] = useState<'prev' | 'next' | number | null>(null);
  
  // Combined loading state
  const loading = isLoading || isPending;

  const createPageURL = (pageNumber: number | string) => {
    // Start with a fresh URLSearchParams instance
    const params = new URLSearchParams();
    
    // Use the current URL search params as the base
    if (currentSearchParams) {
      // Only copy the explicitly allowed parameters
      const allowedParams = ['search', 'status', 'sortField', 'sortDirection', 'pageSize'];
      
      allowedParams.forEach(param => {
        const value = currentSearchParams.get(param);
        if (value) {
          params.set(param, value);
        }
      });
    }
    
    // Override with the new page number
    params.set("page", pageNumber.toString());
    
    // Use the pathName parameter passed to the component
    return `${pathName}?${params.toString()}`;
  };

  // Function to navigate with loading state
  const navigateWithLoading = (pageNumber: number, buttonType: 'prev' | 'next' | number) => {
    const url = createPageURL(pageNumber);
    setLoadingButton(buttonType);
    startTransition(() => {
      router.push(url);
      // We'll reset the loading button when the transition completes
    });
  };

  // Reset loading state when transition completes
  if (!isPending && loadingButton !== null) {
    setLoadingButton(null);
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page, last page, current page, and pages adjacent to current
      const firstPage = 1;
      const lastPage = totalPages;

      // Add first page
      pageNumbers.push(firstPage);

      // Add ellipsis if needed
      if (currentPage > 3) {
        pageNumbers.push("...");
      }

      // Add pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i !== firstPage && i !== lastPage) {
          pageNumbers.push(i);
        }
      }

      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }

      // Add last page if not already added
      if (lastPage !== firstPage) {
        pageNumbers.push(lastPage);
      }
    }

    return pageNumbers;
  }

  const pageNumbers = getPageNumbers();

  // If we're in the initial loading state, show skeleton pagination
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-9 w-20 rounded-md" />
        <div className="flex items-center space-x-1">
          {[1, 2, 3].map((_, i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => currentPage > 1 && navigateWithLoading(currentPage - 1, 'prev')}
        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
          currentPage === 1 || loading ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50"
        }`}
        disabled={currentPage === 1 || loading}
      >
        {loadingButton === 'prev' && isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Previous
      </button>

      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => navigateWithLoading(page, page)}
              disabled={loading || currentPage === page}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                currentPage === page
                  ? "z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  : "text-gray-700 hover:bg-gray-50"
              } rounded-md`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {loadingButton === page && isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-2 text-sm text-gray-700">
              {page}
            </span>
          ),
        )}
      </div>

      <button
        onClick={() => currentPage < totalPages && navigateWithLoading(currentPage + 1, 'next')}
        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
          currentPage === totalPages || loading ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50"
        }`}
        disabled={currentPage === totalPages || loading}
      >
        {loadingButton === 'next' && isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Next
      </button>
      
      {/* Global loading indicator */}
      {isPending && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary z-50 animate-pulse"></div>
      )}
    </div>
  );
}