import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, Printer, Tag, Package, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductAction } from "@/actions/products"
import { ProductDTO } from "@/lib/http-service/products/types"
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
  let product: ProductDTO | undefined = undefined;
  if (response.success) {
    product = response.data;
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

  // Get stock level badge
  const getStockLevelBadge = (stockQuantity: number) => {
    if (stockQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stockQuantity < 10) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Low Stock</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>;
    }
  };

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
              <h1 className="text-2xl font-bold">{product.name || `Product ${product.code}`}</h1>
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
                  <div>{product.name || "Not specified"}</div>
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
                <div className="space-y-1">
                  <div className="text-sm font-medium">Type</div>
                  <div className="capitalize">{product.typeOfProduct?.toLowerCase().replace('_', ' ') || 'Unknown'}</div>
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
                    <div className="w-4 h-4 rounded-full border bg-gray-200"></div>
                    {product.colorName}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Thickness</div>
                  <div>{product.thickness} mm</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Unit of Measure</div>
                  <div>{product.unitOfMeasure}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Branch</div>
                  <div>{product.branchName || "Not assigned"}</div>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/categories`} className="inline-flex items-center text-sm text-blue-600 hover:underline">
                  <Tag className="h-4 w-4 mr-1" />
                  View All Categories
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Current Stock</div>
                  <div className="text-2xl font-bold">{product.stockQuantity || 0} {product.unitOfMeasure}</div>
                </div>
                <div>
                  {getStockLevelBadge(product.stockQuantity || 0)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/inventory/products/${id}/history`}>
                    View Inventory History
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/inventory/products/${id}/add`}>
                    <Package className="mr-2 h-4 w-4" />
                    Add Stock
                  </Link>
                </Button>
              </div>
              
              {(product.stockQuantity || 0) < 10 && (
                <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-amber-800 font-medium">Low Stock Warning</p>
                      <p className="text-amber-700 text-sm mt-1">
                        This product is running low on stock. Consider adding more inventory to avoid stockouts.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {(product.stockQuantity || 0) === 0 && (
                <div className="p-3 bg-red-50 rounded-md border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium">Out of Stock</p>
                      <p className="text-red-700 text-sm mt-1">
                        This product is currently out of stock and unavailable for sale.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}