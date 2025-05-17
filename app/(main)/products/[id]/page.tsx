import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, Printer, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductAction } from "@/actions/products"
import { GetProductResponse } from "@/lib/http-service/products/types"
import { formatCurrency } from "@/lib/utils"

interface ProductDetailsPageProps {
  params: {
    id: string
  }
  searchParams: {
    error?: string
  }
}

export default async function ProductDetailsPage({ params, searchParams }: ProductDetailsPageProps) {
  const id = parseInt(params.id, 10);

  // Fetch product data
  const response = await getProductAction(id);
  
  // Check for success and extract product data
  let product = undefined;
  if (response.success) {
    product = response.data as GetProductResponse;
  }

  // If product not found, return 404
  if (!product) {
    notFound();
  }

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-500 text-white">Active</Badge>
      : <Badge variant="outline" className="bg-gray-100">Inactive</Badge>;
  }

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
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Code: {product.code}</span>
                <span>•</span>
                {getStatusBadge(product.isActive)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/products/${id}/print`}
                target="_blank"
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/api/products/${id}/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/products/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button variant="destructive" asChild>
              <Link href={`/products/${id}/delete`}>
                Delete
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Name</div>
                  <div>{product.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Code</div>
                  <div>{product.code}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Price</div>
                  <div className="text-xl font-bold text-green-700">{formatCurrency(product.price)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <div>{getStatusBadge(product.isActive)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Category</div>
                  <div>{product.productCategoryName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Color</div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: product.colorName }}></div>
                    {product.colorName}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Thickness</div>
                  <div>{product.thickness} mm</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Branch</div>
                  <div>{product.branchId || "Not assigned"}</div>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/categories/${product.productCategoryName}`} className="inline-flex items-center text-sm text-blue-600 hover:underline">
                  <Tag className="h-4 w-4 mr-1" />
                  View Category
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inventory Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">Current Stock</div>
                <div className="text-2xl font-bold">{product.stockQuantity || 0} units</div>
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <Link href={`/inventory/products/${id}`}>
                    View Inventory History
                  </Link>
                </Button>
              </div>
              {product.stockQuantity < 10 && (
                <div className="p-3 mt-4 bg-amber-50 rounded-md border border-amber-200">
                  <p className="text-amber-800 font-medium">Low Stock Warning</p>
                  <p className="text-amber-700 text-sm mt-1">
                    This product is running low on stock. Consider adding more inventory.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}