'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Package, Calendar, TrendingUp } from "lucide-react";
import { ProductionsTable } from "./productions-table";
import { ProductionsFilters } from "./productions-filters";
import { useSearchParams } from 'next/navigation';
import { getProductionsByBatchAction } from "@/actions/productions";
import { getBatchesAction } from "@/actions/batches";
import { ProductionDTO } from "@/lib/http-service/productions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ProductionsToastHandler } from './productions-toast-handler';

export default function ProductionsClientContent({
  searchParams: initialSearchParams = {}
}: {
  searchParams: Record<string, string | string[]>;
}) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // State to store production data
  const [productions, setProductions] = useState<ProductionDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [batches, setBatches] = useState([]);
  const [stats, setStats] = useState({
    totalProductions: 0,
    activeBatches: 0,
    thisMonth: 0,
    totalOutput: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Parse search parameters - use useMemo to prevent re-computation
  const params = React.useMemo(() => {
    const search = searchParams?.get('search') || "";
    const batchId = searchParams?.get('batchId') || "all";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    const sortBy = searchParams?.get('sortBy') || "id";
    const sortDir = (searchParams?.get('sortDir') || "desc") as "asc" | "desc";
    
    return { search, batchId, page, pageSize, sortBy, sortDir };
  }, [searchParams]);

  // Memoize the load data function to prevent recreation
  const loadData = useCallback(async () => {
    setLoading(true);
    
    try {
      // Load batches for filter options
      const batchesResponse = await getBatchesAction();
      
      let currentProductions: ProductionDTO[] = [];
      let totalProductionItems = 0;
      let totalProductionPages = 1;
      
      // If a specific batch is selected, load productions for that batch
      if (params.batchId !== 'all') {
        const productionsResponse = await getProductionsByBatchAction(parseInt(params.batchId), {
          pageNo: params.page - 1,
          pageSize: params.pageSize,
          sortBy: params.sortBy,
          sortDir: params.sortDir
        });
        
        if (productionsResponse.success && productionsResponse.data) {
          currentProductions = productionsResponse.data.content;
          totalProductionItems = productionsResponse.data.totalElements;
          totalProductionPages = productionsResponse.data.totalPages;
        }
      }
      
      // Update state in batches to prevent re-renders
      setProductions(currentProductions);
      setTotalItems(totalProductionItems);
      setTotalPages(totalProductionPages);
      
      if (batchesResponse.success && batchesResponse.data) {
        setBatches(batchesResponse.data.content as any);
        
        // Calculate stats using the current productions data
        const activeBatchesCount = batchesResponse.data.content.length;
        const totalOutput = currentProductions.reduce((sum, p) => sum + p.quantity, 0);
        
        setStats({
          totalProductions: totalProductionItems,
          activeBatches: activeBatchesCount,
          thisMonth: 0, // Would calculate from production dates
          totalOutput: totalOutput
        });
      } else {
        setBatches([]);
        setStats({
          totalProductions: 0,
          activeBatches: 0,
          thisMonth: 0,
          totalOutput: 0
        });
        
        // Show error for batches
        toast({
          title: "Error loading batches",
          description: batchesResponse.error || "Failed to load batches",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
      
      // Reset state on error
      setProductions([]);
      setTotalItems(0);
      setTotalPages(1);
      setBatches([]);
      setStats({
        totalProductions: 0,
        activeBatches: 0,
        thisMonth: 0,
        totalOutput: 0
      });
      
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Network Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params.batchId, params.page, params.pageSize, params.sortBy, params.sortDir, toast]);

  // Load data when params change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate pagination details
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = Math.min(startIndex + params.pageSize, totalItems);
  
  return (
    <>
      <ProductionsToastHandler />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalProductions}
            </div>
            <p className="text-xs text-muted-foreground">
              All production records
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
            <p className="text-xs text-muted-foreground">Production records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Output</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalOutput}
            </div>
            <p className="text-xs text-muted-foreground">Units produced</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <ProductionsFilters 
          currentSearch={params.search} 
          currentBatch={params.batchId} 
          batches={batches} 
          isLoading={loading} 
        />

        <ProductionsTable
          productions={productions}
          pagination={{
            totalItems,
            totalPages,
            currentPage: params.page,
            itemsPerPage: params.pageSize,
            startIndex,
            endIndex,
          }}
          searchParams={Object.fromEntries(
            Array.from(searchParams.entries()).map(([key, value]) => [key, value])
          )}
          isLoading={loading}
          onRefresh={loadData}
        />
      </div>
    </>
  )
}