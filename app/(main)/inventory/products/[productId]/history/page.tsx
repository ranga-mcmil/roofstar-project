import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Plus } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getInventoryHistoryAction } from "@/actions/inventory"
import { getProductAction } from "@/actions/products"
import { GetProductResponse } from "@/lib/http-service/products/types"
import InventoryHistoryClientContent from "../../../components/inventory-history-client-content"

interface InventoryHistoryPageProps {
  params: {
    productId: string
  }
  searchParams: {
    error?: string
    startDate?: string
    endDate?: string
    page?: string
    pageSize?: string
    sortField?: string
    sortDirection?: "asc" | "desc"
  }
}

export default async function InventoryHistoryPage({ params, searchParams }: InventoryHistoryPageProps) {
  const productId = parseInt(params.productId, 10);

  // Fetch product data to confirm it exists and show product info
  const productResponse = await getProductAction(productId);
  
  // If product not found, return 404
  if (!productResponse.success || !productResponse.data) {
    notFound();
  }

  const product = productResponse.data as GetProductResponse;
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Error message if present */}
        {searchParams.error && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md">
            {decodeURIComponent(searchParams.error)}
          </div>
        )}
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/products/${productId}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Product</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Inventory History: {product.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Product Code: {product.code}</span>
                <span>•</span>
                <span>Current Stock: {product.stockQuantity || 0} units</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/api/inventory/products/${productId}/history/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export History
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/inventory/products/${productId}/add`}>
                <Plus className="mr-2 h-4 w-4" /> Add Inventory
              </Link>
            </Button>
          </div>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p>{product.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Category</p>
                <p>{product.productCategoryName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Color / Thickness</p>
                <p>{product.colorName} / {product.thickness}mm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client component for dynamic inventory history with loading states */}
        <InventoryHistoryClientContent 
          productId={productId} 
          searchParams={searchParams as Record<string, string>} 
        />
      </main>
    </div>
  )
}