'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Package, Calendar } from "lucide-react";
import { BatchesTable } from "./batches-table";
import { BatchesFilters } from "./batches-filters";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { getBatchesAction } from "@/actions/batches";
import { BatchDTO } from "@/lib/http-service/batches/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { BatchesToastHandler } from './batches-toast-handler';

export default function BatchesClientContent({
  searchParams: initialSearchParams = {}
}: {
  searchParams: Record<string, string | string[]>;
}) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  // State to store batch data
  const [batches, setBatches] = useState<BatchDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0); // Used to force a refresh
  
  // Function to retry loading data
  const handleRetry = () => {
    setRetryKey(prev => prev + 1); // Increment retry key to force a reload
    setLoading(true); // Show loading state immediately
  };

  // Parse search parameters (removed branchId since managers don't filter by branch)
  const getParams = () => {
    const search = searchParams?.get('search') || "";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    const sortBy = searchParams?.get('sortBy') || "id";
    const sortDir = (searchParams?.get('sortDir') || "desc") as "asc" | "desc";
    
    return { search, page, pageSize, sortBy, sortDir };
  };

  const { search, page, pageSize, sortBy, sortDir } = getParams();

  // Load data
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Only load batches (no need to fetch branches for managers)
        const batchesResponse = await getBatchesAction({
          pageNo: page - 1, // API is 0-indexed
          pageSize,
          sortBy,
          sortDir
          // No branchId filter - managers only see their branch's batches by default
        });
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process batches response
        if (batchesResponse.success && batchesResponse.data) {
          setBatches(batchesResponse.data.content);
          setTotalItems(batchesResponse.data.totalElements);
          setTotalPages(batchesResponse.data.totalPages);
          
          // Calculate stats
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const thisMonthBatches = batchesResponse.data.content.filter(batch => {
            const batchDate = new Date(batch.createdDate);
            return batchDate.getMonth() === currentMonth && batchDate.getFullYear() === currentYear;
          }).length;
          
          // Set stats
          setStats({
            totalBatches: batchesResponse.data.totalElements,
            activeBatches: batchesResponse.data.content.length, // All batches shown are considered active
            thisMonth: thisMonthBatches
          });
        } else {
          setBatches([]);
          setTotalItems(0);
          setTotalPages(1);
        }
        
        // Check for any errors and show a toast
        if (!batchesResponse.success) {
          const errorMessage = batchesResponse.error || "Failed to load batches";
          
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
                className="bg-white text-primary border-0"
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
        setBatches([]);
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
              className="bg-white text-primary border-0"
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
      <BatchesToastHandler />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalBatches}
            </div>
            <p className="text-xs text-muted-foreground">
              All batches
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.activeBatches}
            </div>
            <p className="text-xs text-muted-foreground">Currently in production</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.thisMonth}
            </div>
            <p className="text-xs text-muted-foreground">New batches created</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <BatchesFilters 
          currentSearch={search} 
          isLoading={loading} 
        />

        <BatchesTable
          batches={batches}
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