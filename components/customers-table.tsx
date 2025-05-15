"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Edit, Loader2, MoreHorizontal, Trash2, User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "inactive"
  lastOrder: string
  totalSpent: number
}

const customers: Customer[] = [
  {
    id: "cust-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    company: "John Doe Construction",
    status: "active",
    lastOrder: "2025-04-10",
    totalSpent: 12500,
  },
  {
    id: "cust-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    company: "Smith Developments",
    status: "active",
    lastOrder: "2025-04-05",
    totalSpent: 8750,
  },
  {
    id: "cust-3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "555-456-7890",
    company: "Johnson & Miller",
    status: "active",
    lastOrder: "2025-03-28",
    totalSpent: 15200,
  },
  {
    id: "cust-4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "555-789-0123",
    company: "Williams Roofing",
    status: "inactive",
    lastOrder: "2025-02-15",
    totalSpent: 4300,
  },
  {
    id: "cust-5",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "555-234-5678",
    company: "Brown Brothers Construction",
    status: "active",
    lastOrder: "2025-04-02",
    totalSpent: 9800,
  },
  {
    id: "cust-6",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "555-345-6789",
    company: "Davis Contractors",
    status: "active",
    lastOrder: "2025-03-25",
    totalSpent: 7600,
  },
  {
    id: "cust-7",
    name: "David Wilson",
    email: "david@example.com",
    phone: "555-456-7890",
    company: "Wilson Builders",
    status: "inactive",
    lastOrder: "2025-01-20",
    totalSpent: 3200,
  },
  {
    id: "cust-8",
    name: "Lisa Taylor",
    email: "lisa@example.com",
    phone: "555-567-8901",
    company: "Taylor Roofing Solutions",
    status: "active",
    lastOrder: "2025-03-15",
    totalSpent: 11400,
  },
]

interface CustomersTableProps {
  status?: "active" | "inactive"
  page?: number
  itemsPerPage?: number
}

export function CustomersTable({ status, page = 1, itemsPerPage = 5 }: CustomersTableProps) {
  const filteredCustomers = status ? customers.filter((customer) => customer.status === status) : customers
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)

  const handleDeleteClick = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!editingCustomer) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Customer deleted",
        description: `${editingCustomer.name} has been removed from your customers.`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt={customer.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{customer.email}</div>
                    <div>{customer.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {customer.status === "active" ? (
                    <Badge className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(customer.lastOrder).toLocaleDateString()}</TableCell>
                <TableCell className="text-right font-medium">${customer.totalSpent.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/customers/edit/${customer.id}`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(customer)}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingCustomer?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
