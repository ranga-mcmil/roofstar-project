"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InventoryMovement {
  id: string
  date: string
  product: string
  type: "in" | "out"
  quantity: number
  user: string
  reference: string
}

const movements: InventoryMovement[] = [
  {
    id: "mov-1",
    date: "2025-04-10",
    product: "IBR 0.47mm - Charcoal",
    type: "in",
    quantity: 50,
    user: "John Doe",
    reference: "PO-2025-042",
  },
  {
    id: "mov-2",
    date: "2025-04-09",
    product: "IBR 0.53mm - Galvanized",
    type: "out",
    quantity: 15,
    user: "Jane Smith",
    reference: "SO-2025-128",
  },
  {
    id: "mov-3",
    date: "2025-04-08",
    product: "Ridge Cap - Galvanized",
    type: "in",
    quantity: 20,
    user: "John Doe",
    reference: "PO-2025-041",
  },
  {
    id: "mov-4",
    date: "2025-04-07",
    product: "IBR 0.58mm - Forest Green",
    type: "out",
    quantity: 10,
    user: "Jane Smith",
    reference: "SO-2025-127",
  },
  {
    id: "mov-5",
    date: "2025-04-06",
    product: "Flashing - Charcoal",
    type: "out",
    quantity: 5,
    user: "Jane Smith",
    reference: "SO-2025-126",
  },
  {
    id: "mov-6",
    date: "2025-04-05",
    product: "IBR 0.47mm - White",
    type: "in",
    quantity: 30,
    user: "John Doe",
    reference: "PO-2025-040",
  },
  {
    id: "mov-7",
    date: "2025-04-04",
    product: "Roofing Screws (100 pack)",
    type: "out",
    quantity: 8,
    user: "Jane Smith",
    reference: "SO-2025-125",
  },
  {
    id: "mov-8",
    date: "2025-04-03",
    product: "IBR 0.53mm - Blue",
    type: "in",
    quantity: 25,
    user: "John Doe",
    reference: "PO-2025-039",
  },
  {
    id: "mov-9",
    date: "2025-04-02",
    product: "IBR 0.58mm - Brick Red",
    type: "out",
    quantity: 12,
    user: "Jane Smith",
    reference: "SO-2025-124",
  },
  {
    id: "mov-10",
    date: "2025-04-01",
    product: "Ridge Cap - Galvanized",
    type: "in",
    quantity: 15,
    user: "John Doe",
    reference: "PO-2025-038",
  },
]

interface InventoryMovementsProps {
  page?: number
  itemsPerPage?: number
}

export function InventoryMovements({ page = 1, itemsPerPage = 5 }: InventoryMovementsProps) {
  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedMovements = movements.slice(startIndex, endIndex)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Reference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedMovements.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No movements found.
            </TableCell>
          </TableRow>
        ) : (
          paginatedMovements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{new Date(movement.date).toLocaleDateString()}</TableCell>
              <TableCell className="font-medium">{movement.product}</TableCell>
              <TableCell>
                {movement.type === "in" ? (
                  <Badge className="bg-green-500">Stock In</Badge>
                ) : (
                  <Badge className="bg-blue-500">Stock Out</Badge>
                )}
              </TableCell>
              <TableCell>{movement.quantity}</TableCell>
              <TableCell>{movement.user}</TableCell>
              <TableCell>{movement.reference}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
