'use client';

import { useState, useEffect } from 'react';
import { InventoryHistoryFilters } from "./inventory-history-filters";
import { useSearchParams, useRouter } from 'next/navigation';
import { getInventoryByBranchAction } from "@/actions/inventory";
import { InventoryDTO } from "@/lib/http-service/inventory/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServerPagination } from "@/components/server-pagination";

interface BranchInventoryClientContentProps {
  branchId: string;
  searchParams: Record<string, string | string[]>;
}

export default function BranchInventoryClientContent({
  branchId,
  searchParams
}: BranchInventoryClientContentProps) {
  // Get URL parameters
  const urlSearchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  // State to store history data
  const [inventory, setInventory] = useState<InventoryDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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
        // API uses page/size instead of pageNo/pageSize
        const inventoryResponse = await getInventoryByBranchAction(branchId, {
          page: page - 1, // API is 0-indexed
          size: pageSize,
          sortBy,
          sortDir
        });
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process inventory response
        if (inventoryResponse.success && inventoryResponse.data) {
          const inventoryData = inventoryResponse.data;
          setInventory(inventoryData.content);
          setTotalItems(inventoryData.totalElements);
          setTotalPages(inventoryData.totalPages);
        } else {
          setInventory([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (error) {
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        console.error("Error loading data:", error);
        
        // Reset state on error
        setInventory([]);
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
  }, [urlSearchParams, branchId, page, pageSize, sortBy, sortDir, toast, retryKey]);

  // Calculate pagination details
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return (
    <>
      <div className="border rounded-lg p-2">
        <InventoryHistoryFilters 
          startDate={startDate}
          endDate={endDate}
          isLoading={loading} 
        />

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : inventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No inventory records found for this branch. Try adjusting your filters or check back later.
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.productName}</TableCell>
                    <TableCell>{entry.quantity}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.remarks || "No remarks"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${entry.productName}`}>
                              <Eye className="mr-2 h-4 w-4" /> View Product
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {(inventory.length > 0 || loading) && (
          <div className="flex items-center justify-between mt-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">
                <Skeleton className="h-5 w-48" />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
              </div>
            )}
            <ServerPagination 
              currentPage={page} 
              totalPages={totalPages} 
              pathName={`/inventory/branches/${branchId}/history`} 
              searchParams={Object.fromEntries(
                Array.from(urlSearchParams.entries()).map(([key, value]) => [key, value])
              )}
              isLoading={loading}
            />
          </div>
        )}
      </div>
    </>
  )
}