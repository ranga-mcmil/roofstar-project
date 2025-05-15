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
import { UserObj } from "@/lib/http-service/users/types"

interface UsersTableProps {
  users: UserObj[]
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

export function UsersTable({
  users,
  pagination,
  currentSortField,
  currentSortDirection,
  searchParams
}: UsersTableProps) {

  // Get role badge color
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>
      case "store_manager":
        return <Badge className="bg-blue-500">Store Manager</Badge>
      case "sales_rep":
        return <Badge className="bg-green-500">Sales Rep</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

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

    return `/users?${params.toString()}`
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
                <Link href={createSortURL("email")} className="flex items-center hover:underline">
                  Email
                  {currentSortField === "email" && (
                    <span className="ml-1">{currentSortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("role")} className="flex items-center hover:underline">
                  Role
                  {currentSortField === "role" && (
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
              <TableHead>Warehouse</TableHead>
              
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge('admin')}</TableCell>

                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.branchId}</TableCell>

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
                          <Link href={`/users/${user.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/edit/${user.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/users/status/${user.id}?action=${user.status === "active" ? "deactivate" : "activate"}`}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/users/delete/${user.id}`}
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

      {users.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} users
          </p>
          <ServerPagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} pathName={'/users'} searchParams={searchParams as Record<string, string>}/>
        </div>
      )}
    </>
  )
}

