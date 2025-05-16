import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Eye, FileText, Printer, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ServerPagination } from "@/components/server-pagination"
import { GetBranchesResponse } from "@/lib/http-service/branches/types"

interface WarehousesTableProps {
  warehouses: GetBranchesResponse
  userCounts: Record<string, number>
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
  searchParams?: Record<string, string>
}

export function WarehousesTable({
  warehouses,
  userCounts,
  pagination,
  currentSortField,
  currentSortDirection,
  searchParams
}: WarehousesTableProps) {
  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        Inactive
      </Badge>
    )
  }

  // Fixed function to not use window object
  const createSortURL = (field: string) => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams()

    // Set the sort field and direction
    if (currentSortField === field) {
      params.set("sortField", field)
      params.set("sortDirection", currentSortDirection === "asc" ? "desc" : "asc")
    } else {
      params.set("sortField", field)
      params.set("sortDirection", "asc")
    }

    return `/warehouses?${params.toString()}`
  }

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
                <Link href={createSortURL("name")} className="flex items-center hover:underline">
                  Name
                  {currentSortField === "name" && (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("location")} className="flex items-center hover:underline">
                  Location
                  {currentSortField === "location" && (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("status")} className="flex items-center hover:underline">
                  Status
                  {currentSortField === "status" && (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </Link>
              </TableHead>
              <TableHead>Assigned Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No warehouses found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell>{warehouse.location}</TableCell>
                  <TableCell>{getStatusBadge(warehouse.status)}</TableCell>
                  <TableCell>{userCounts[warehouse.id] || 0}</TableCell>
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
                          <Link href={`/warehouses/${warehouse.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/warehouses/edit/${warehouse.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/warehouses/status/${warehouse.id}?action=${warehouse.status === "active" ? "deactivate" : "activate"}`}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {warehouse.status === "active" ? "Deactivate" : "Activate"}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/warehouses/print/${warehouse.id}`} target="_blank">
                            <Printer className="mr-2 h-4 w-4" /> Print
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/warehouses/delete/${warehouse.id}`}
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

      {warehouses.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} warehouses
          </p>
          <ServerPagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} pathName={'/warehouses'} searchParams={searchParams as Record<string, string>}/>
        </div>
      )}
    </>
  )
}

