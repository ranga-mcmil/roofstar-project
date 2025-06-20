import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Printer, CheckCircle, XCircle, Package, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getStockMovementByIdAction } from "@/actions/stock-movements"
import { GetStockMovementResponse } from "@/lib/http-service/stock-movements/types"

interface StockMovementDetailsPageProps {
  params: {
    id: string
  }
  searchParams: {
    error?: string
  }
}

export default async function StockMovementDetailsPage({ params, searchParams }: StockMovementDetailsPageProps) {
  const id = parseInt(params.id, 10);

  // Fetch stock movement data
  const response = await getStockMovementByIdAction(id);
  
  // Check for success and extract stock movement data
  let stockMovement = undefined;
  if (response.success) {
    stockMovement = response.data as GetStockMovementResponse;
  }

  // If stock movement not found, return 404
  if (!stockMovement) {
    notFound();
  }

  // Get movement type badge
  const getMovementTypeBadge = (movementType: string) => {
    const isIncrease = ['ADD', 'RESTOCK', 'RETURN'].includes(movementType.toUpperCase());
    return isIncrease ? (
      <Badge className="bg-green-500 text-white">
        <TrendingUp className="w-3 h-3 mr-1" />
        {movementType}
      </Badge>
    ) : (
      <Badge className="bg-red-500 text-white">
        <TrendingDown className="w-3 h-3 mr-1" />
        {movementType}
      </Badge>
    );
  };

  // Get reversal badge
  const getReversalBadge = (isReversed: boolean) => {
    return isReversed ? (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Reversed
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Error message if present */}
        {searchParams.error && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
            <div className="flex items-center">
              <XCircle className="w-4 h-4 mr-2" />
              {decodeURIComponent(searchParams.error)}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/stock-movements">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Stock Movement #{stockMovement.id}</h1>
                {getMovementTypeBadge(stockMovement.movementType)}
                {getReversalBadge(stockMovement.reversed)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Product: {stockMovement.productName}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/stock-movements/${id}/print`}
                target="_blank"
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/api/stock-movements/${id}/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Movement Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Movement ID</div>
                  <div className="font-medium">{stockMovement.id}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Movement Type</div>
                  <div>{getMovementTypeBadge(stockMovement.movementType)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Quantity</div>
                  <div className="font-medium">{stockMovement.quantity}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Movement Date</div>
                  <div>{new Date(stockMovement.movementDate).toLocaleDateString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div>{getReversalBadge(stockMovement.reversed)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Stock Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Stock Before</div>
                  <div className="font-medium">{stockMovement.stockBefore}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Stock After</div>
                  <div className="font-medium">{stockMovement.stockAfter}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Net Change</div>
                  <div className={`font-medium ${stockMovement.stockAfter - stockMovement.stockBefore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stockMovement.stockAfter - stockMovement.stockBefore > 0 ? '+' : ''}{stockMovement.stockAfter - stockMovement.stockBefore}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Product Name</div>
                  <div className="font-medium">
                    <Link href={`/products/${stockMovement.productId}`} className="hover:underline">
                      {stockMovement.productName}
                    </Link>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Product ID</div>
                  <div className="text-sm font-mono">{stockMovement.productId}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Order Number</div>
                  <div className="font-medium">
                    <Link href={`/orders/${stockMovement.orderId}`} className="hover:underline">
                      {stockMovement.orderNumber}
                    </Link>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Order ID</div>
                  <div className="text-sm font-mono">{stockMovement.orderId}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Created By</div>
                <div>{stockMovement.createdByName}</div>
              </div>
              
              {stockMovement.notes && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Notes</div>
                  <div className="text-sm bg-gray-50 p-3 rounded-md">{stockMovement.notes}</div>
                </div>
              )}

              {stockMovement.reversed && stockMovement.reversedDate && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Reversed Date</div>
                  <div className="text-sm text-red-600">
                    {new Date(stockMovement.reversedDate).toLocaleDateString()}
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