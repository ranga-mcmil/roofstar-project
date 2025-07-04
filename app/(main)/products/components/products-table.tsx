'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  Package, 
  TrendingDown, 
  History, 
  AlertTriangle,
  Plus,
  Gift
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
import { ProductDTO } from "@/lib/http-service/products/types"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"

interface ProductsTableProps {
  products: ProductDTO[]
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

export function ProductsTable({
  products,
  pagination,
  searchParams,
  isLoading = false,
  onRefresh
}: ProductsTableProps) {
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

  // Get stock level indicator
  const getStockBadge = (stockQuantity: number) => {
    if (stockQuantity === 0) {
      return <Badge variant="destructive" className="text-xs">Out of Stock</Badge>;
    } else if (stockQuantity < 10) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Low Stock</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">In Stock</Badge>;
    }
  };

  // Get product type badge
  const getTypeBadge = (typeOfProduct: string) => {
    const type = typeOfProduct?.toLowerCase();
    switch (type) {
      case 'length_width':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">L×W</Badge>;
      case 'weight':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">Weight</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">Unknown</Badge>;
    }
  };

  // Generate skeleton rows for loading state
  const renderSkeletonRows = () => {
    return Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton className="h-4 w-4" />
        </TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
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
              <TableHead>Name/Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Thickness</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              renderSkeletonRows()
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  No products found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name || `Product ${product.code}`}</span>
                      <span className="text-sm text-muted-foreground">Code: {product.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.productCategoryName}</TableCell>
                  <TableCell>{product.colorName}</TableCell>
                  <TableCell>{product.thickness} mm</TableCell>
                  <TableCell>{product.unitOfMeasure || 'N/A'}</TableCell>
                  <TableCell>
                    {getTypeBadge(product.typeOfProduct || 'unknown')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-medium">{product.stockQuantity || 0} {product.unitOfMeasure || 'units'}</span>
                      <div className="w-fit">
                        {getStockBadge(product.stockQuantity || 0)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                  <TableCell>{getStatusBadge(product.isActive)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Product Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Product
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Inventory Actions</DropdownMenuLabel>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/products/${product.id}/history`}>
                            <History className="mr-2 h-4 w-4" /> View History
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/products/${product.id}/add`}>
                            <Plus className="mr-2 h-4 w-4 text-green-600" /> Add Stock
                          </Link>
                        </DropdownMenuItem>
                        
                        {(product.stockQuantity || 0) > 0 && (
                          <DropdownMenuItem asChild>
                            <Link href={`/inventory/products/${product.id}/adjustments/remove`}>
                              <TrendingDown className="mr-2 h-4 w-4 text-red-600" /> Remove Stock
                            </Link>
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/products/${product.id}/adjustments/correct`}>
                            <Package className="mr-2 h-4 w-4 text-blue-600" /> Correct Stock
                          </Link>
                        </DropdownMenuItem>
                        
                        {(product.stockQuantity || 0) < 10 && (
                          <DropdownMenuItem asChild>
                            <Link href={`/inventory/products/${product.id}/add`} className="text-amber-600 focus:text-amber-600">
                              <AlertTriangle className="mr-2 h-4 w-4" /> Low Stock Alert
                            </Link>
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/products/${product.id}/delete`}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Product
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

      {(products.length > 0 || loading) && (
        <div className="flex items-center justify-between mt-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-5 w-48" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} products
            </div>
          )}
          <ServerPagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            pathName='/products' 
            searchParams={searchParams}
            isLoading={loading}
          />
        </div>
      )}
    </>
  )
}
                