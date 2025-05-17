'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { CategoriesTable } from "./categories-table"
import { CategoriesFilters } from "./categories-filters"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { getCategoriesAction } from "@/actions/categories"
import { ProductCategoryDTO } from "@/lib/http-service/categories/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { CategoriesToastHandler } from './categories-toast-handler';

export default function CategoriesClientContent({
  searchParams: initialSearchParams = {}
}: {
  searchParams: Record<string, string | string[]>;
}) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  // State to store category data
  const [categories, setCategories] = useState<ProductCategoryDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({
    totalCategories: 0,
    assignedProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0); // Used to force a refresh
  
  // Function to retry loading data
  const handleRetry = () => {
    setRetryKey(prev => prev + 1); // Increment retry key to force a reload
    setLoading(true); // Show loading state immediately
  };

  // Parse search parameters
  const getParams = () => {
    const search = searchParams?.get('search') || "";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    
    return { search, page, pageSize };
  };

  const { search, page, pageSize } = getParams();

  // Load data
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Load categories
        const categoriesResponse = await getCategoriesAction();
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process categories response
        if (categoriesResponse.success && categoriesResponse.data) {
          const allCategories = categoriesResponse.data;
          setCategories(allCategories);
          setTotalItems(allCategories.length);
          
          // Set stats
          setStats({
            totalCategories: allCategories.length,
            assignedProducts: 0 // In a real application, you would get this from an API
          });
        } else {
          setCategories([]);
          setTotalItems(0);
          setStats({
            totalCategories: 0,
            assignedProducts: 0
          });
        }
        
        // Check for any errors and show a toast
        if (!categoriesResponse.success) {
          const errorMessage = categoriesResponse.error || "Failed to load categories";
          
          // Show error toast
          const { dismiss } = toast({
            title: "Error loading data",
            description: errorMessage,
            variant: "destructive",
            action: (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  handleRetry();
                  dismiss(); // Close the toast when retry is clicked
                }}
                className="bg-white text-primary border-0" // White background, blue text, no border
              >
                Try Again
              </Button>
            ),
            duration: 10000,
          });
        }
      } catch (error) {
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        console.error("Error loading data:", error);
        
        // Reset state on error
        setCategories([]);
        setTotalItems(0);
        
        // Show error toast for unexpected errors
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        const { dismiss } = toast({
          title: "Network Error",
          description: errorMessage,
          variant: "destructive",
          action: (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                handleRetry();
                dismiss(); // Close the toast when retry is clicked
              }}
              className="bg-white text-primary border-0" // White background, blue text, no border
            >
              Try Again
            </Button>
          ),
          duration: 10000,
        });
      } finally {
        // Only proceed if component is still mounted
        if (isActive) {
          setTimeout(() => setLoading(false), 300);
        }
      }
    }
    
    loadData();
    
    // Cleanup function
    return () => {
      isActive = false;
    };
  }, [searchParams, page, pageSize, toast, retryKey]);

  // Client-side pagination for demo since we're getting all categories at once
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedCategories = categories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return (
    <>
      <CategoriesToastHandler />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalCategories}
            </div>
            <p className="text-xs text-muted-foreground">
              All product categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Assigned</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.assignedProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              Total products assigned to categories
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <CategoriesFilters currentSearch={search} isLoading={loading} />

        <CategoriesTable
          categories={paginatedCategories}
          pagination={{
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: pageSize,
            startIndex,
            endIndex,
          }}
          searchParams={Object.fromEntries(
            Array.from(searchParams.entries()).map(([key, value]) => [key, value])
          )}
          isLoading={loading}
          onRefresh={handleRetry}
        />
      </div>
    </>
  )
}