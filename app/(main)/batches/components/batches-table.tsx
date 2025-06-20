'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  Package, 
  History, 
  Plus,
  FileText
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
import { BatchDTO } from "@/lib/http-service/batches/types"
import { Skeleton } from "@/components/ui/skeleton"

interface BatchesTableProps {
  batches: BatchDTO[]
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

export function BatchesTable({
  batches,
  pagination,
  searchParams,
  isLoading = false,
  onRefresh
}: BatchesTableProps) {
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
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
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
              <TableHead>Batch Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              renderSkeletonRows()
            ) : batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No batches found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                  <TableCell>{batch.description || 'No description'}</TableCell>
                  <TableCell>{batch.createdByName}</TableCell>
                  <TableCell>{formatDate(batch.createdDate)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/batches/${batch.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/batches/${batch.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Batch
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Inventory Actions</DropdownMenuLabel>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/batches/${batch.batchNumber}/history`}>
                            <History className="mr-2 h-4 w-4" /> View Inventory History
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/batches/${batch.batchNumber}/add`}>
                            <Plus className="mr-2 h-4 w-4 text-green-600" /> Add Inventory
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Production Actions</DropdownMenuLabel>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/productions/batches/${batch.id}`}>
                            <Package className="mr-2 h-4 w-4 text-blue-600" /> View Productions
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/batches/${batch.id}/report`}>
                            <FileText className="mr-2 h-4 w-4 text-purple-600" /> Generate Report
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/batches/${batch.id}/delete`}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Batch
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

      {(batches.length > 0 || loading) && (
        <div className="flex items-center justify-between mt-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-5 w-48" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} batches
            </div>
          )}
          <ServerPagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            pathName='/batches' 
            searchParams={searchParams}
            isLoading={loading}
          />
        </div>
      )}
    </>
  )
}

  