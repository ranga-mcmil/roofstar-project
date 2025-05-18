'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, TrendingUp, TrendingDown, MinusCircle, PlusCircle, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ServerPagination } from "@/components/server-pagination"
import { InventoryDTO } from "@/lib/http-service/inventory/types"
import { Skeleton } from "@/components/ui/skeleton"

interface InventoryHistoryTableProps {
  history: InventoryDTO[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
  }
  searchParams?: any
  isLoading?: boolean
  onRefresh?: () => void
  productId: number
}

export function InventoryHistoryTable({
  history,
  pagination,
  searchParams,
  isLoading = false,
  onRefresh,
  productId
}: InventoryHistoryTableProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // Combined loading state (either from parent or from local transitions)
  const loading = isLoading || isPending;

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      router.refresh();
    }
  };

  // Get appropriate icon for quantity direction
  const getQuantityIcon = (quantity: number) => {
    if (quantity > 0) {
      return <PlusCircle className="h-4 w-4 text-green-600 mr-1" />;
    } else if (quantity < 0) {
      return <MinusCircle className="h-4 w-4 text-red-600 mr-1" />;
    } else {
      return <Pencil className="h-4 w-4 text-blue-600 mr-1" />;
    }
  };

  // Format quantity with + or - prefix and appropriate color
  const formatQuantity = (quantity: number) => {
    if (quantity > 0) {
      return <span className="text-green-600 font-medium">+{quantity}</span>;
    } else if (quantity < 0) {
      return <span className="text-red-600 font-medium">{quantity}</span>;
    } else {
      return <span className="text-blue-600 font-medium">{quantity}</span>;
    }
  };

  // Generate skeleton rows for loading state
  const renderSkeletonRows = () => {
    return Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-8 rounded-full ml-auto" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              renderSkeletonRows()
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No inventory history found. Try adjusting your filters or check back later.
                </TableCell>
              </TableRow>
            ) : (
              history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>
                    {/* Mock date - in real app, API would return timestamp */}
                    {new Date().toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      {getQuantityIcon(entry.quantity)}
                      {formatQuantity(entry.quantity)}
                    </div>
                  </TableCell>
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
                          <Link href={`/inventory/products/${productId}/adjustments/add`}>
                            <TrendingUp className="mr-2 h-4 w-4" /> Add Stock
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/products/${productId}/adjustments/remove`}>
                            <TrendingDown className="mr-2 h-4 w-4" /> Remove Stock
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/products/${productId}/adjustments/correct`}>
                            <Pencil className="mr-2 h-4 w-4" /> Correct Stock
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

      {(history.length > 0 || loading) && (
        <div className="flex items-center justify-between mt-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-5 w-48" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} entries
            </div>
          )}
          <ServerPagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            pathName={`/inventory/products/${productId}/history`} 
            searchParams={searchParams}
            isLoading={loading}
          />
        </div>
      )}
    </>
  )
}