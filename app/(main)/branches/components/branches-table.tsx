'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Eye, FileText, Printer, Trash2, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ServerPagination } from "@/components/server-pagination"
import { BranchDTO } from "@/lib/http-service/branches/types"

interface BranchesTableProps {
  branches: BranchDTO[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
  }
  currentSortField: string
  currentSortDirection: "asc" | "desc"
  searchParams?: any
}

export function BranchesTable({
  branches,
  pagination,
  currentSortField,
  currentSortDirection,
  searchParams
}: BranchesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        Inactive
      </Badge>
    );
  };

  // Create sort URL and navigation handler
  const handleSort = (field: string) => {
    startTransition(() => {
      // Create a new URLSearchParams object
      const params = new URLSearchParams();
      
      // Add all current search params that are strings
      if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (key !== 'sortField' && key !== 'sortDirection' && value !== undefined && value !== null) {
            params.set(key, String(value));
          }
        });
      }
      
      // Set the sort field and direction
      if (currentSortField === field) {
        params.set("sortField", field);
        params.set("sortDirection", currentSortDirection === "asc" ? "desc" : "asc");
      } else {
        params.set("sortField", field);
        params.set("sortDirection", "asc");
      }
      
      // Navigate with the new params
      router.push(`${pathname}?${params.toString()}`);
    });
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
              <TableHead>
                <button 
                  className="flex items-center hover:underline disabled:cursor-wait"
                  onClick={() => handleSort("name")}
                  disabled={isPending}
                >
                  Name
                  {currentSortField === "name" ? (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center hover:underline disabled:cursor-wait"
                  onClick={() => handleSort("location")}
                  disabled={isPending}
                >
                  Location
                  {currentSortField === "location" ? (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center hover:underline disabled:cursor-wait"
                  onClick={() => handleSort("isActive")}
                  disabled={isPending}
                >
                  Status
                  {currentSortField === "isActive" ? (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              // Loading skeleton rows
              Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`} className="animate-pulse">
                  <TableCell>
                    <div className="h-4 w-4 rounded bg-gray-200"></div>
                  </TableCell>
                  <TableCell><div className="h-5 w-32 rounded bg-gray-200"></div></TableCell>
                  <TableCell><div className="h-5 w-24 rounded bg-gray-200"></div></TableCell>
                  <TableCell><div className="h-5 w-16 rounded bg-gray-200"></div></TableCell>
                  <TableCell><div className="h-5 w-40 rounded bg-gray-200"></div></TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-8 rounded-full bg-gray-200 ml-auto"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : branches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No branches found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell>{branch.location}</TableCell>
                  <TableCell>{getStatusBadge(branch.isActive)}</TableCell>
                  <TableCell>{branch.address.city}, {branch.address.province}</TableCell>
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
                          <Link href={`/branches/${branch.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/branches/${branch.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/branches/${branch.id}/${branch.isActive ? "deactivate" : "activate"}`}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {branch.isActive ? "Deactivate" : "Activate"}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/branches/${branch.id}/print`} target="_blank">
                            <Printer className="mr-2 h-4 w-4" /> Print
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/branches/${branch.id}/delete`}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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

      {branches.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} branches
          </p>
          <ServerPagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            pathName='/branches' 
            searchParams={searchParams}
          />
        </div>
      )}
      
      {/* Global loading indicator */}
      {isPending && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary z-50 animate-pulse"></div>
      )}
    </>
  )
}