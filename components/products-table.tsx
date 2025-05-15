"use client"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Edit, Loader2, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
  color: string
  gauge: string
  length: number
  image?: string
}

// Add image URLs to products
const products: Product[] = [
  {
    id: "ibr-1",
    name: "IBR 0.47mm - Charcoal",
    sku: "IBR-047-CH",
    price: 36.0,
    stock: 120,
    category: "ibr",
    color: "Charcoal",
    gauge: "0.47mm",
    length: 3.6,
    image: "/placeholder.svg?key=yzih5",
  },
  {
    id: "ibr-2",
    name: "IBR 0.53mm - Galvanized",
    sku: "IBR-053-GV",
    price: 45.0,
    stock: 85,
    category: "ibr",
    color: "Galvanized",
    gauge: "0.53mm",
    length: 3.6,
    image: "/placeholder.svg?key=4dvj3",
  },
  {
    id: "ibr-3",
    name: "IBR 0.58mm - Forest Green",
    sku: "IBR-058-FG",
    price: 50.0,
    stock: 65,
    category: "ibr",
    color: "Forest Green",
    gauge: "0.58mm",
    length: 3.6,
    image: "/placeholder.svg?key=elzfw",
  },
  {
    id: "ibr-4",
    name: "IBR 0.47mm - White",
    sku: "IBR-047-WT",
    price: 38.0,
    stock: 12,
    category: "ibr",
    color: "White",
    gauge: "0.47mm",
    length: 3.6,
    image: "/placeholder.svg?key=7zuze",
  },
  {
    id: "ibr-5",
    name: "IBR 0.53mm - Blue",
    sku: "IBR-053-BL",
    price: 47.0,
    stock: 18,
    category: "ibr",
    color: "Blue",
    gauge: "0.53mm",
    length: 3.6,
    image: "/placeholder.svg?key=lo378",
  },
  {
    id: "ibr-6",
    name: "IBR 0.58mm - Brick Red",
    sku: "IBR-058-BR",
    price: 52.0,
    stock: 5,
    category: "ibr",
    color: "Brick Red",
    gauge: "0.58mm",
    length: 3.6,
    image: "/placeholder.svg?height=80&width=80&query=IBR+Brick+Red+Roofing+Sheet",
  },
  {
    id: "acc-1",
    name: "Ridge Cap - Galvanized",
    sku: "ACC-RC-GV",
    price: 15.0,
    stock: 45,
    category: "accessories",
    color: "Galvanized",
    gauge: "0.47mm",
    length: 1.8,
    image: "/placeholder.svg?height=80&width=80&query=Roof+Ridge+Cap+Galvanized",
  },
  {
    id: "acc-2",
    name: "Flashing - Charcoal",
    sku: "ACC-FL-CH",
    price: 12.0,
    stock: 30,
    category: "accessories",
    color: "Charcoal",
    gauge: "0.47mm",
    length: 1.8,
    image: "/placeholder.svg?height=80&width=80&query=Roof+Flashing+Charcoal",
  },
  {
    id: "fast-1",
    name: "Roofing Screws (100 pack)",
    sku: "FAST-RS-100",
    price: 25.0,
    stock: 50,
    category: "fasteners",
    color: "Galvanized",
    gauge: "N/A",
    length: 0,
    image: "/placeholder.svg?height=80&width=80&query=Roofing+Screws+Pack",
  },
]

interface ProductsTableProps {
  category?: string
  page?: number
  itemsPerPage?: number
}

export function ProductsTable({ category, page = 1, itemsPerPage = 5 }: ProductsTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const filteredProducts = category ? products.filter((product) => product.category === category) : products

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id))
    }
  }

  const toggleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const handleDeleteClick = (product: Product) => {
    setEditingProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!editingProduct) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Product deleted",
        description: `${editingProduct.name} has been deleted.`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
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
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Specifications</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleSelectProduct(product.id)}
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                    <Image
                      src={product.image || "/placeholder.svg?height=80&width=80&query=Product"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`${
                      product.stock <= 10 ? "text-red-500" : product.stock <= 20 ? "text-yellow-500" : "text-green-500"
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div>Color: {product.color}</div>
                    <div>Gauge: {product.gauge}</div>
                    <div>Length: {product.length > 0 ? `${product.length}m` : "N/A"}</div>
                  </div>
                </TableCell>
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
                        <Link href={`/products/edit/${product.id}`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(product)}>
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
              Are you sure you want to delete {editingProduct?.name}? This action cannot be undone.
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
