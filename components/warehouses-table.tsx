"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, MoreHorizontal, Search, Trash2, CheckCircle, XCircle, Eye } from "lucide-react"
import { warehouses, users } from "@/lib/dummy-data"
import { toast } from "@/components/ui/use-toast"

interface WarehousesTableProps {
  statusFilter?: "active" | "inactive"
}

export function WarehousesTable({ statusFilter }: WarehousesTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteWarehouseId, setDeleteWarehouseId] = useState<string | null>(null)
  const [statusChangeWarehouseId, setStatusChangeWarehouseId] = useState<string | null>(null)
  const [statusAction, setStatusAction] = useState<"activate" | "deactivate" | null>(null)

  // Filter warehouses based on search term and status
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      (warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter ? warehouse.status === statusFilter : true),
  )

  const handleStatusChange = (warehouseId: string, action: "activate" | "deactivate") => {
    setStatusChangeWarehouseId(warehouseId)
    setStatusAction(action)
  }

  const confirmStatusChange = () => {
    if (statusChangeWarehouseId && statusAction) {
      // In a real app, this would be an API call
      toast({
        title: `Warehouse ${statusAction === "activate" ? "activated" : "deactivated"}`,
        description: `The warehouse has been ${statusAction === "activate" ? "activated" : "deactivated"} successfully.`,
      })
      setStatusChangeWarehouseId(null)
      setStatusAction(null)
    }
  }

  const handleDeleteWarehouse = (warehouseId: string) => {
    // Check if any users are assigned to this warehouse
    const assignedUsers = users.filter((user) => user.warehouseId === warehouseId)
    if (assignedUsers.length > 0) {
      toast({
        title: "Cannot delete warehouse",
        description: `This warehouse has ${assignedUsers.length} users assigned to it. Please reassign or remove these users first.`,
        variant: "destructive",
      })
      return
    }

    setDeleteWarehouseId(warehouseId)
  }

  const confirmDeleteWarehouse = () => {
    if (deleteWarehouseId) {
      // In a real app, this would be an API call
      toast({
        title: "Warehouse deleted",
        description: "The warehouse has been deleted successfully.",
      })
      setDeleteWarehouseId(null)
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

  const getUserCount = (warehouseId: string) => {
    return users.filter((user) => user.warehouseId === warehouseId).length
  }

  return (
    <>
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWarehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No warehouses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredWarehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell>{warehouse.location}</TableCell>
                  <TableCell>{getStatusBadge(warehouse.status)}</TableCell>
                  <TableCell>{getUserCount(warehouse.id)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/warehouses/${warehouse.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/warehouses/edit/${warehouse.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {warehouse.status === "active" ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(warehouse.id, "deactivate")}>
                            <XCircle className="mr-2 h-4 w-4" /> Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(warehouse.id, "activate")}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteWarehouse(warehouse.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={!!statusChangeWarehouseId} onOpenChange={() => setStatusChangeWarehouseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusAction === "activate" ? "Activate Warehouse" : "Deactivate Warehouse"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusAction === "activate"
                ? "This will make the warehouse available for operations. Are you sure you want to activate this warehouse?"
                : "This will prevent new operations from being assigned to this warehouse. Are you sure you want to deactivate this warehouse?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              {statusAction === "activate" ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteWarehouseId} onOpenChange={() => setDeleteWarehouseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Warehouse</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the warehouse from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteWarehouse} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
