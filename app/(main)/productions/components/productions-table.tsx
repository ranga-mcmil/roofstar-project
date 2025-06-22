'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Eye, 
  Package, 
  FileText, 
  Calendar,
  User
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ServerPagination } from "@/components/server-pagination"
import { ProductionDTO } from "@/lib/http-service/productions/types"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductionsTableProps {
  productions: ProductionDTO[]
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
  showBatchColumn?: boolean
}

export function ProductionsTable({
  productions,
  pagination,
  searchParams,
  isLoading = false,
  onRefresh,
  showBatchColumn = true
}: ProductionsTableProps) {
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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate skeleton rows for loading state
  const renderSkeletonRows = () => {
    return Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton className="h-4 w-4" />
        </TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        {showBatchColumn && <TableCell><Skeleton className="h-5 w-32" /></TableCell>}
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
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
              <TableHead className="w-[40px]">
                <span className="sr-only">Select</span>
              </TableHead>
              <TableHead>Order Number</TableHead>
              {showBatchColumn && <TableHead>Batch Number</TableHead>}
              <TableHead>Quantity</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              renderSkeletonRows()
            ) : productions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showBatchColumn ? 7 : 6} className="text-center py-8 text-muted-foreground">
                  No production records found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              productions.map((production) => (
                <TableRow key={production.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="font-medium">{production.orderNumber}</TableCell>
                  {showBatchColumn && <TableCell>{production.inventoryBatchNumber}</TableCell>}
                  <TableCell className="font-medium">{production.quantity}</TableCell>
                  <TableCell>{production.remarks || 'No remarks'}</TableCell>
                  <TableCell>{formatDate(production.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Production Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/productions/${production.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Related Actions</DropdownMenuLabel>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/orders/${production.orderNumber.split('-')[0]}`}>
                            <FileText className="mr-2 h-4 w-4" /> View Order
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/batches/${production.inventoryBatchNumber}/history`}>
                            <Package className="mr-2 h-4 w-4" /> View Batch Inventory
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/productions/batches/${production.inventoryBatchNumber}`}>
                            <Calendar className="mr-2 h-4 w-4" /> View Batch Productions
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

      {(productions.length > 0 || loading) && (
        <div className="flex items-center justify-between mt-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-5 w-48" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} production records
            </div>
          )}
          <ServerPagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            pathName='/productions' 
            searchParams={searchParams}
            isLoading={loading}
          />
        </div>
      )}
    </>
  )
}