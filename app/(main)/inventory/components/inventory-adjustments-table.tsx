'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, ArrowUpRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ServerPagination } from "@/components/server-pagination"
import { InventoryAdjustmentDTO } from "@/lib/http-service/inventory/types"
import { Skeleton } from "@/components/ui/skeleton"

interface InventoryAdjustmentsTableProps {
  adjustments: InventoryAdjustmentDTO[]
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
}

export function InventoryAdjustmentsTable({
  adjustments,
  pagination,
  searchParams,
  isLoading = false,
  onRefresh
}: InventoryAdjustmentsTableProps) {
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

  const getMovementTypeBadge = (movementType: string) => {
    switch(movementType) {
      case 'add':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Addition
          </Badge>
        );
      case 'remove':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Reduction
          </Badge>
        );
      case 'correct':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Correction
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {movementType}
          </Badge>
        );
    }
  };

  // Format quantity with + or - prefix
  const formatQuantity = (quantity: number, movementType: string) => {
    const prefix = movementType === 'add' ? '+' : movementType === 'remove' ? '-' : '';
    return `${prefix}${quantity}`;
  };

  // Generate skeleton rows for loading state
  const renderSkeletonRows = () => {
    return Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
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
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              renderSkeletonRows()
            ) : adjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No adjustments found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              adjustments.map((adjustment) => (
                <TableRow key={adjustment.id}>
                  <TableCell>{adjustment.id}</TableCell>
                  <TableCell className="font-medium">{adjustment.productName}</TableCell>
                  <TableCell>{getMovementTypeBadge(adjustment.movementType)}</TableCell>
                  <TableCell className={`font-medium ${
                    adjustment.movementType === 'add' 
                      ? 'text-green-600' 
                      : adjustment.movementType === 'remove' 
                        ? 'text-red-600' 
                        : ''
                  }`}>
                    {formatQuantity(adjustment.quantity, adjustment.movementType)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {adjustment.reason}
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
                          <Link href={`/products/${adjustment.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/products/${adjustment.id}/history`}>
                            <ArrowUpRight className="mr-2 h-4 w-4" /> View History
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

      {(adjustments.length > 0 || loading) && (
        <div className="flex items-center justify-between mt-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-5 w-48" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} adjustments
            </div>
          )}
          <ServerPagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            pathName='/inventory/adjustments' 
            searchParams={searchParams}
            isLoading={loading}
          />
        </div>
      )}
    </>
  )
}