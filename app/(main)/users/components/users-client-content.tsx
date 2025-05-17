'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getUsersAction } from "@/actions/users";
import { UserDTO } from "@/lib/http-service/users/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersToastHandler } from "./users-toast-handler";
import { getBranchesAction } from "@/actions/branches";
import { BranchDTO } from "@/lib/http-service/branches/types";
import { UsersFilters } from './users-filters';
import { UsersTable } from './users-table';

export default function UsersClientContent({
  searchParams: initialSearchParams = {}
}: {
  searchParams: Record<string, string>;
}) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  // State to store user data
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0); // Used to force a refresh
  
  // Function to retry loading data
  const handleRetry = useCallback(() => {
    console.log("Refresh/Retry clicked");
    setRetryKey(prev => prev + 1); // Increment retry key to force a reload
    setLoading(true); // Show loading state immediately
  }, []);

  // Parse search parameters
  const getParams = () => {
    const search = searchParams?.get('search') || "";
    const branchId = searchParams?.get('branchId') || "";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    
    return { search, branchId, page, pageSize };
  };

  const { search, branchId, page, pageSize } = getParams();

  // Load branches for filter
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranchesAction();
        if (response.success && response.data) {
          setBranches(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };

    fetchBranches();
  }, []);

  // Load users data
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Prepare params for API call
        const apiParams = {
          pageNo: page - 1,
          pageSize,
          branchId: branchId || undefined
        };
        
        // Load users data
        const usersResponse = await getUsersAction(apiParams);
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process users response
        if (usersResponse.success && usersResponse.data) {
          setUsers(usersResponse.data.content);
          setTotalItems(usersResponse.data.totalElements);
          setTotalPages(usersResponse.data.totalPages);
        } else {
          setUsers([]);
          setTotalItems(0);
          setTotalPages(1);
          
          // Show error toast
          const errorMessage = usersResponse.error || "Failed to load users";
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
        setUsers([]);
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
  }, [searchParams, page, pageSize, branchId, toast, handleRetry, retryKey]);
  
  // Calculate pagination details
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return (
    <>
      <UsersToastHandler />
      
      <div className="border rounded-lg p-4">
        <UsersFilters 
          branches={branches} 
          currentSearch={search} 
          currentBranchId={branchId}
          isLoading={loading} 
        />

        <UsersTable
          users={users}
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
  );
}