'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, ArrowUpDown } from "lucide-react";
import { InventoryAdjustmentsTable } from "./inventory-adjustments-table";
import { InventoryAdjustmentsFilters } from "./inventory-adjustments-filters";
import { useSearchParams, useRouter } from 'next/navigation';
import { getInventoryAdjustmentsAction } from "@/actions/inventory";
import { InventoryAdjustmentDTO } from "@/lib/http-service/inventory/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function InventoryAdjustmentsClientContent({
  searchParams: initialSearchParams = {}
}: {
  searchParams: Record<string, string | string[]>;
}) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  // State to store adjustments data
  const [adjustments, setAdjustments] = useState<InventoryAdjustmentDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalAdjustments: 0,
    addCount: 0,
    removeCount: 0,
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
    const movementType = searchParams?.get('movementType') || "all";
    const startDate = searchParams?.get('startDate') || "";
    const endDate = searchParams?.get('endDate') || "";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    const sortBy = searchParams?.get('sortBy') || "id";
    const sortDir = (searchParams?.get('sortDir') || "desc") as "asc" | "desc";
    
    return { search, movementType, startDate, endDate, page, pageSize, sortBy, sortDir };
  };

  const { search, movementType, startDate, endDate, page, pageSize, sortBy, sortDir } = getParams();

  // Load data
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    async function loadData() {
      setLoading(true);
      
      try {
        // API uses pageNo instead of page (0-indexed vs 1-indexed)
        const adjustmentsResponse = await getInventoryAdjustmentsAction({
          pageNo: page - 1,
          pageSize,
          sortBy,
          sortDir
        });
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process adjustments response
        if (adjustmentsResponse.success && adjustmentsResponse.data) {
          const adjustmentsData = adjustmentsResponse.data;
          setAdjustments(adjustmentsData.content);
          setTotalItems(adjustmentsData.totalElements);
          setTotalPages(adjustmentsData.totalPages);
          
          // Calculate stats
          const addCount = adjustmentsData.content.filter(a => a.movementType === 'add').length;
          const removeCount = adjustmentsData.content.filter(a => a.movementType === 'remove').length;
          
          setStats({
            totalAdjustments: adjustmentsData.totalElements,
            addCount,
            removeCount
          });
        } else {
          setAdjustments([]);
          setTotalItems(0);
          setTotalPages(1);
          setStats({ totalAdjustments: 0, addCount: 0, removeCount: 0 });
        }
      } catch (error) {
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        console.error("Error loading data:", error);
        
        // Reset state on error
        setAdjustments([]);
        setTotalItems(0);
        setTotalPages(1);
        setStats({ totalAdjustments: 0, addCount: 0, removeCount: 0 });
        
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
  
  // Filter the adjustments based on search and movement type
  // This is a client-side filter for demo, in a real app this would be handled by the API
  const filteredAdjustments = adjustments.filter(adjustment => {
    // Filter by search term
    const matchesSearch = !search || 
      adjustment.productName.toLowerCase().includes(search.toLowerCase()) ||
      adjustment.reason.toLowerCase().includes(search.toLowerCase());
    
    // Filter by movement type
    const matchesType = movementType === 'all' || adjustment.movementType === movementType;
    
    // Filter by date if implemented
    // This would require date fields in the adjustment data
    
    return matchesSearch && matchesType;
  });
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adjustments</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalAdjustments}
            </div>
            <p className="text-xs text-muted-foreground">
              All inventory adjustments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Additions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.addCount}
            </div>
            <p className="text-xs text-muted-foreground">Inventory added</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Reductions</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.removeCount}
            </div>
            <p className="text-xs text-muted-foreground">Inventory removed</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <InventoryAdjustmentsFilters 
          currentSearch={search} 
          currentMovementType={movementType}
          startDate={startDate}
          endDate={endDate}
          isLoading={loading} 
        />

        <InventoryAdjustmentsTable
          adjustments={filteredAdjustments}
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