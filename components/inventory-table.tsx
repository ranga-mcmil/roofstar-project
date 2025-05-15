"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, Package } from "lucide-react"
import { useState } from "react"

interface InventoryItem {
  id: string
  name: string
  sku: string
  stock: number
  reorderPoint: number
  location: string
  lastRestocked: string
  value: number
}

const inventoryItems: InventoryItem[] = [
  {
    id: "ibr-1",
    name: "IBR 0.47mm - Charcoal",
    sku: "IBR-047-CH",
    stock: 120,
    reorderPoint: 30,
    location: "Warehouse A",
    lastRestocked: "2025-03-15",
    value: 4320,
  },
  {
    id: "ibr-2",
    name: "IBR 0.53mm - Galvanized",
    sku: "IBR-053-GV",
    stock: 85,
    reorderPoint: 25,
    location: "Warehouse A",
    lastRestocked: "2025-03-10",
    value: 3825,
  },
  {
    id: "ibr-3",
    name: "IBR 0.58mm - Forest Green",
    sku: "IBR-058-FG",
    stock: 65,
    reorderPoint: 20,
    location: "Warehouse B",
    lastRestocked: "2025-03-05",
    value: 3250,
  },
  {
    id: "ibr-4",
    name: "IBR 0.47mm - White",
    sku: "IBR-047-WT",
    stock: 12,
    reorderPoint: 20,
    location: "Warehouse A",
    lastRestocked: "2025-02-28",
    value: 456,
  },
  {
    id: "ibr-5",
    name: "IBR 0.53mm - Blue",
    sku: "IBR-053-BL",
    stock: 18,
    reorderPoint: 25,
    location: "Warehouse B",
    lastRestocked: "2025-02-25",
    value: 846,
  },
  {
    id: "ibr-6",
    name: "IBR 0.58mm - Brick Red",
    sku: "IBR-058-BR",
    stock: 5,
    reorderPoint: 15,
    location: "Warehouse B",
    lastRestocked: "2025-02-20",
    value: 260,
  },
  {
    id: "acc-1",
    name: "Ridge Cap - Galvanized",
    sku: "ACC-RC-GV",
    stock: 45,
    reorderPoint: 15,
    location: "Warehouse C",
    lastRestocked: "2025-03-12",
    value: 675,
  },
  {
    id: "acc-2",
    name: "Flashing - Charcoal",
    sku: "ACC-FL-CH",
    stock: 30,
    reorderPoint: 10,
    location: "Warehouse C",
    lastRestocked: "2025-03-08",
    value: 360,
  },
  {
    id: "fast-1",
    name: "Roofing Screws (100 pack)",
    sku: "FAST-RS-100",
    stock: 50,
    reorderPoint: 20,
    location: "Warehouse C",
    lastRestocked: "2025-03-01",
    value: 1250,
  },
]

interface InventoryTableProps {
  page?: number
  itemsPerPage?: number
}

export function InventoryTable({ page = 1, itemsPerPage = 5 }: InventoryTableProps) {
  const [sortField, setSortField] = useState<keyof InventoryItem>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof InventoryItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedItems = [...inventoryItems].sort((a, b) => {
    if (sortField === "name" || sortField === "sku" || sortField === "location" || sortField === "lastRestocked") {
      return sortDirection === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField])
    } else {
      return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
    }
  })

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = sortedItems.slice(startIndex, endIndex)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
            Product
            {sortField === "name" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ArrowDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("sku")}>
            SKU
            {sortField === "sku" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ArrowDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("stock")}>
            Stock
            {sortField === "stock" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ArrowDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("reorderPoint")}>
            Reorder Point
            {sortField === "reorderPoint" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ArrowDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("location")}>
            Location
            {sortField === "location" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ArrowDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("lastRestocked")}>
            Last Restocked
            {sortField === "lastRestocked" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ArrowDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="cursor-pointer text-right" onClick={() => handleSort("value")}>
            Value
            {sortField === "value" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ArrowDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedItems.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
              No inventory items found.
            </TableCell>
          </TableRow>
        ) : (
          paginatedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell>
                <span
                  className={`${
                    item.stock <= item.reorderPoint / 3
                      ? "text-red-500"
                      : item.stock <= item.reorderPoint
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {item.stock}
                </span>
              </TableCell>
              <TableCell>{item.reorderPoint}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">${item.value.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <Package className="mr-2 h-4 w-4" /> Restock
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
