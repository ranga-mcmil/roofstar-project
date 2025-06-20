'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Package, AlertTriangle } from "lucide-react"
import { StockMovementsTable } from "./stock-movements-table"
import { StockMovementsFilters } from "./stock-movements-filters"
import { useSearchParams } from 'next/navigation';
import { getAllStockMovementsAction } from "@/actions/stock-movements"
import { StockMovementDTO } from "@/lib/http-service/stock-movements/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { StockMovementsToastHandler } from './stock-movements-toast-handler';

interface StockMovementsClientContentProps {
  searchParams: Record<string, string | string[]>;
}

export default function StockMovementsClientContent({
  searchParams: initialSearchParams = {}
}: StockMovementsClientContentProps) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // State to store stock movement data
  const [stockMovements, setStockMovements] = useState<StockMovementDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalMovements: 0,
    increases: 0,
    decreases: 0,
    reversed: 0
  });
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  
  // Function to retry loading data
  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
    setLoading(true);
  };

  // Parse search parameters
  const getParams = () => {
    const search = searchParams?.get('search') || "";
    const productId = searchParams?.get('productId') || "";
    const orderId = searchParams?.get('orderId') || "";
    const movementType = searchParams?.get('movementType') || "";
    const branchId = searchParams?.get('branchId') || "";
    const isReversed = searchParams?.get('isReversed') || "";
    const fromDate = searchParams?.get('fromDate') || "";
    const toDate = searchParams?.get('toDate') || "";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    
    return { 
      search, 
      productId, 
      orderId, 
      movementType, 
      branchId, 
      isReversed, 
      fromDate, 
      toDate, 
      page, 
      pageSize 
    };
  };

  const { search, productId, orderId, movementType, branchId, isReversed, fromDate, toDate, page, pageSize } = getParams();

  // Load data
  useEffect(() => {
    let isActive = true;
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Create pagination params according to API spec
        const paginationParams = {
          pageNo: page - 1, // API uses 0-based pagination
          pageSize: pageSize,
          sortBy: 'movementDate',
          sortDir: 'desc' as const
        };

        // Load stock movements
        const movementsResponse = await getAllStockMovementsAction(paginationParams);
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process movements response
        if (movementsResponse.success && movementsResponse.data) {
          const movementData = movementsResponse.data;
          
          // Apply client-side filtering for demo
          let filteredMovements = movementData.content;
          
          // Apply search filter
          if (search) {
            const searchTerm = search.toLowerCase();
            filteredMovements = filteredMovements.filter(movement =>
              movement.productName.toLowerCase().includes(searchTerm) ||
              movement.orderNumber.toLowerCase().includes(searchTerm) ||
              movement.movementType.toLowerCase().includes(searchTerm) ||
              movement.createdByName.toLowerCase().includes(searchTerm)
            );
          }
          
          // Apply filters
          if (productId) {
            filteredMovements = filteredMovements.filter(movement =>
              movement.productId.toString() === productId
            );
          }
          
          if (orderId) {
            filteredMovements = filteredMovements.filter(movement =>
              movement.orderId.toString() === orderId
            );
          }
          
          if (movementType) {
            filteredMovements = filteredMovements.filter(movement =>
              movement.movementType === movementType
            );
          }
          
          if (isReversed) {
            const reversedFilter = isReversed === 'true';
            filteredMovements = filteredMovements.filter(movement =>
              movement.reversed === reversedFilter
            );
          }
          
          setStockMovements(filteredMovements);
          setTotalItems(filteredMovements.length);
          setTotalPages(Math.ceil(filteredMovements.length / pageSize));
          
          // Calculate stats
          const totalMovements = filteredMovements.length;
          const increases = filteredMovements.filter(m => 
            ['ADD', 'RESTOCK', 'RETURN'].includes(m.movementType.toUpperCase())
          ).length;
          const decreases = filteredMovements.filter(m => 
            ['SALE', 'ADJUSTMENT', 'DAMAGE'].includes(m.movementType.toUpperCase())
          ).length;
          const reversed = filteredMovements.filter(m => m.reversed).length;
          
          setStats({
            totalMovements,
            increases,
            decreases,
            reversed
          });
        } else {
          setStockMovements([]);
          setTotalItems(0);
          setTotalPages(1);
          setStats({
            totalMovements: 0,
            increases: 0,
            decreases: 0,
            reversed: 0
          });
        }
        
        // Check for any errors and show a single toast
        if (!movementsResponse.success) {
          const errorMessage = movementsResponse.error || "Failed to load stock movements";
          
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
                  dismiss();
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
        if (!isActive) return;
        
        console.error("Error loading data:", error);
        
        setStockMovements([]);
        setTotalItems(0);
        setTotalPages(1);
        setStats({
          totalMovements: 0,
          increases: 0,
          decreases: 0,
          reversed: 0
        });
        
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
                dismiss();
              }}
              className="bg-white text-primary border-0"
            >
              Try Again
            </Button>
          ),
          duration: 10000,
        });
      } finally {
        if (isActive) {
          setTimeout(() => setLoading(false), 300);
        }
      }
    }
    
    loadData();
    
    return () => {
      isActive = false;
    };
  }, [searchParams, page, pageSize, toast, retryKey]);

  // Calculate pagination details
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return (
    <>
      <StockMovementsToastHandler />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalMovements}
            </div>
            <p className="text-xs text-muted-foreground">
              All stock movements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Increases</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.increases}
            </div>
            <p className="text-xs text-muted-foreground">Stock additions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decreases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.decreases}
            </div>
            <p className="text-xs text-muted-foreground">Stock reductions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reversed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.reversed}
            </div>
            <p className="text-xs text-muted-foreground">Reversed movements</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <StockMovementsFilters 
          currentSearch={search} 
          currentMovementType={movementType}
          currentIsReversed={isReversed}
          isLoading={loading} 
        />

        <StockMovementsTable
          stockMovements={stockMovements}
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