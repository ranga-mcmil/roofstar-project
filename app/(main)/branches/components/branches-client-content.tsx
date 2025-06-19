'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Building2, Users } from "lucide-react"
import { BranchesTable } from "./branches-table"
import { BranchesFilters } from "./branches-filters"
import { useSearchParams } from 'next/navigation';
import { getBranchesAction, getBranchStatsAction } from "@/actions/branches"
import { BranchDTO, BranchStatsResponse } from "@/lib/http-service/branches/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { BranchesToastHandler } from './branches-toast-handler';

interface BranchesClientContentProps {
  searchParams: Record<string, string | string[]>;
}

export default function BranchesClientContent({
  searchParams: initialSearchParams = {}
}: BranchesClientContentProps) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // State to store branch data
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<BranchStatsResponse>({
    numberOfBranches: 0,
    numberOfActiveBranches: 0,
    numberOfInactiveBranches: 0,
    numberOfAssignedUsers: 0
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
    const status = searchParams?.get('status') || "all";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    
    return { search, status, page, pageSize };
  };

  const { search, status, page, pageSize } = getParams();

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
          sortBy: 'id',
          sortDir: 'desc' as const
        };

        // Load all data in parallel
        const [branchesResponse, statsResponse] = await Promise.all([
          getBranchesAction(paginationParams),
          getBranchStatsAction()
        ]);
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process branches response
        if (branchesResponse.success && branchesResponse.data) {
          const branchData = branchesResponse.data;
          
          // Filter branches based on search and status on client side
          let filteredBranches = branchData.content;
          
          // Apply search filter
          if (search) {
            const searchTerm = search.toLowerCase();
            filteredBranches = filteredBranches.filter(branch =>
              branch.name.toLowerCase().includes(searchTerm) ||
              branch.location.toLowerCase().includes(searchTerm) ||
              branch.address.city.toLowerCase().includes(searchTerm) ||
              branch.address.province.toLowerCase().includes(searchTerm)
            );
          }
          
          // Apply status filter
          if (status !== 'all') {
            const isActiveFilter = status === 'active';
            filteredBranches = filteredBranches.filter(branch =>
              branch.isActive === isActiveFilter
            );
          }
          
          setBranches(filteredBranches);
          
          // For now, use filtered count for pagination
          // In a real implementation, filtering should be done server-side
          setTotalItems(filteredBranches.length);
          setTotalPages(Math.ceil(filteredBranches.length / pageSize));
        } else {
          setBranches([]);
          setTotalItems(0);
          setTotalPages(1);
        }
        
        // Process stats response
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }
        
        // Check for any errors and show a single toast
        if (!branchesResponse.success || !statsResponse.success) {
          const errorMessage = 
            !branchesResponse.success 
              ? branchesResponse.error || "Failed to load branches" 
              : statsResponse.error || "Failed to load statistics";
          
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
        
        setBranches([]);
        setTotalItems(0);
        setTotalPages(1);
        
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
      <BranchesToastHandler />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.numberOfBranches}
            </div>
            <p className="text-xs text-muted-foreground">
              All branches in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.numberOfActiveBranches}
            </div>
            <p className="text-xs text-muted-foreground">Ready for operations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Branches</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.numberOfInactiveBranches}
            </div>
            <p className="text-xs text-muted-foreground">Not currently in use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.numberOfAssignedUsers}
            </div>
            <p className="text-xs text-muted-foreground">Total users assigned</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <BranchesFilters currentSearch={search} currentStatus={status} isLoading={loading} />

        <BranchesTable
          branches={branches}
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