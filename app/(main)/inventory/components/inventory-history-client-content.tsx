'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryHistoryTable } from "./inventory-history-table";
import { InventoryHistoryFilters } from "./inventory-history-filters";
import { useSearchParams, useRouter } from 'next/navigation';
import { getInventoryHistoryAction } from "@/actions/inventory";
import { InventoryDTO } from "@/lib/http-service/inventory/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart } from "lucide-react";

interface InventoryHistoryClientContentProps {
  productId: number;
  searchParams: Record<string, string | string[]>;
}

export default function InventoryHistoryClientContent({
  productId,
  searchParams
}: InventoryHistoryClientContentProps) {
  // Get URL parameters
  const urlSearchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  // State to store history data
  const [history, setHistory] = useState<InventoryDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalAdded: 0, // Sum of positive quantities
    totalRemoved: 0, // Sum of negative quantities (absolute value)
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
    const startDate = urlSearchParams?.get('startDate') || "";
    const endDate = urlSearchParams?.get('endDate') || "";
    const page = Number.parseInt(urlSearchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(urlSearchParams?.get('pageSize') || "10", 10);
    const sortBy = urlSearchParams?.get('sortBy') || "id";
    const sortDir = (urlSearchParams?.get('sortDir') || "desc") as "asc" | "desc";
    
    return { startDate, endDate, page, pageSize, sortBy, sortDir };
  };

  const { startDate, endDate, page, pageSize, sortBy, sortDir } = getParams();

  // Load data
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    async function loadData() {
      setLoading(true);
      
      try {
        // API uses pageNo instead of page (0-indexed vs 1-indexed)
        const historyResponse = await getInventoryHistoryAction(productId, {
          pageNo: page - 1,
          pageSize,
          sortBy,
          sortDir
        });
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process history response
        if (historyResponse.success && historyResponse.data) {
          const historyData = historyResponse.data;
          setHistory(historyData.content);
          setTotalItems(historyData.totalElements);
          setTotalPages(historyData.totalPages);
          
          // Calculate stats
          let totalAdded = 0;
          let totalRemoved = 0;
          
          historyData.content.forEach(entry => {
            if (entry.quantity > 0) {
              totalAdded += entry.quantity;
            } else {
              totalRemoved += Math.abs(entry.quantity);
            }
          });
          
          setStats({
            totalEntries: historyData.totalElements,
            totalAdded,
            totalRemoved
          });
        } else {
          setHistory([]);
          setTotalItems(0);
          setTotalPages(1);
          setStats({ totalEntries: 0, totalAdded: 0, totalRemoved: 0 });
        }
      } catch (error) {
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        console.error("Error loading data:", error);
        
        // Reset state on error
        setHistory([]);
        setTotalItems(0);
        setTotalPages(1);
        setStats({ totalEntries: 0, totalAdded: 0, totalRemoved: 0 });
        
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
  }, [urlSearchParams, productId, page, pageSize, sortBy, sortDir, toast, retryKey]);

  // Calculate pagination details
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalEntries}
            </div>
            <p className="text-xs text-muted-foreground">
              Inventory movements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Added</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : `+${stats.totalAdded}`}
            </div>
            <p className="text-xs text-muted-foreground">Units added to inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Removed</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : `-${stats.totalRemoved}`}
            </div>
            <p className="text-xs text-muted-foreground">Units removed from inventory</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2 mt-6">
        <InventoryHistoryFilters 
          startDate={startDate}
          endDate={endDate}
          isLoading={loading} 
        />

        <InventoryHistoryTable
          history={history}
          pagination={{
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: pageSize,
            startIndex,
            endIndex,
          }}
          searchParams={Object.fromEntries(
            Array.from(urlSearchParams.entries()).map(([key, value]) => [key, value])
          )}
          isLoading={loading}
          onRefresh={handleRetry}
          productId={productId}
        />
      </div>
    </>
  )
}