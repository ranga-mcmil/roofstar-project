'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Package, Tag, Layers } from "lucide-react";
import { ProductsTable } from "./products-table";
import { ProductsFilters } from "./products-filters";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { getProductsAction } from "@/actions/products";
import { getCategoriesAction } from "@/actions/categories";
import { ProductDTO } from "@/lib/http-service/products/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ProductsToastHandler } from './products-toast-handler';

export default function ProductsClientContent({
  searchParams: initialSearchParams = {}
}: {
  searchParams: Record<string, string | string[]>;
}) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  // State to store product data
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    categoryCount: 0,
    totalStock: 0
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
    const status = searchParams?.get('status') || "all";
    const category = searchParams?.get('category') || "all";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    const sortBy = searchParams?.get('sortBy') || "id";
    const sortDir = (searchParams?.get('sortDir') || "asc") as "asc" | "desc";
    
    return { search, status, category, page, pageSize, sortBy, sortDir };
  };

  const { search, status, category, page, pageSize, sortBy, sortDir } = getParams();

  // Load data
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Load products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProductsAction({
            pageNo: page - 1, // API is 0-indexed
            pageSize,
            sortBy,
            sortDir
          }),
          getCategoriesAction()
        ]);
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process products response
        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data.content);
          setTotalItems(productsResponse.data.totalElements);
          setTotalPages(productsResponse.data.totalPages);
          
          // Calculate stats
          const activeCount = productsResponse.data.content.filter(p => p.isActive).length;
          const totalStock = productsResponse.data.content.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
          
          // Set stats
          setStats({
            totalProducts: productsResponse.data.totalElements,
            activeProducts: activeCount,
            categoryCount: 0, // Will update after categories fetched
            totalStock: totalStock
          });
        } else {
          setProducts([]);
          setTotalItems(0);
          setTotalPages(1);
        }
        
        // Process categories response
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data as any);
          
          // Update category count in stats
          setStats(prev => ({
            ...prev,
            categoryCount: categoriesResponse.data!.length
          }));
        }
        
        // Check for any errors and show a toast
        if (!productsResponse.success || !categoriesResponse.success) {
          const errorMessage = 
            !productsResponse.success 
              ? productsResponse.error || "Failed to load products" 
              : categoriesResponse.error || "Failed to load categories";
          
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
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
        
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
  }, [searchParams, page, pageSize, sortBy, sortDir, toast, retryKey]);

  // Calculate pagination details
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return (
    <>
      <ProductsToastHandler />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              All products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.activeProducts}
            </div>
            <p className="text-xs text-muted-foreground">Ready for sale</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.categoryCount}
            </div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalStock}
            </div>
            <p className="text-xs text-muted-foreground">Items in inventory</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <ProductsFilters 
          currentSearch={search} 
          currentStatus={status} 
          currentCategory={category} 
          categories={categories} 
          isLoading={loading} 
        />

        <ProductsTable
          products={products}
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
          onRefresh={handleRetry} // Add refresh callback for handling updates
        />
      </div>
    </>
  )
}