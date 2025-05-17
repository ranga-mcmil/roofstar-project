'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar } from "lucide-react"
import { BranchesTable } from "./branches-table"
import { BranchesFilters } from "./branches-filters"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { getBranchesAction, getBranchStatsAction } from "@/actions/branches"
import { BranchDTO } from "@/lib/http-service/branches/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { BranchesToastHandler } from './branches-toast-handler';

export default function BranchesClientContent({
  searchParams: initialSearchParams = {}
}: {
  searchParams: Record<string, string | string[]>;
}) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  // State to store branch data
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    numberOfBranches: 0,
    numberOfActiveBranches: 0,
    numberOfInactiveBranches: 0,
    numberOfAssignedUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0); // Used to force a refresh
  
  // Function to retry loading data
  const handleRetry = () => {
    console.log("Retry clicked"); // Debug log
    setRetryKey(prev => prev + 1); // Increment retry key to force a reload
    setLoading(true); // Show loading state immediately
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

  // Load data - completely simplified approach
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Load all data in parallel
        const [branchesResponse, statsResponse] = await Promise.all([
          getBranchesAction({
            pageNo: page - 1,
            pageSize: pageSize,
          }),
          getBranchStatsAction()
        ]);
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process branches response
        if (branchesResponse.success && branchesResponse.data) {
          setBranches(branchesResponse.data.content);
          setTotalItems(branchesResponse.data.totalElements);
          setTotalPages(branchesResponse.data.totalPages);
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
          
          // Show a single error toast
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
        setBranches([]);
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
  }, [searchParams, page, pageSize, toast, retryKey]); // Added retryKey as a dependency

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
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.numberOfBranches}
            </div>
            <p className="text-xs text-muted-foreground">
              All branches
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
          onRefresh={handleRetry} // Add refresh callback for handling updates
        />
      </div>
    </>
  )
}