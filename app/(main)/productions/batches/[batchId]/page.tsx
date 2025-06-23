import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Plus, Package, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductionsByBatchAction } from "@/actions/productions"
import { getBatchAction } from "@/actions/batches"
import { GetProductionsByBatchResponse } from "@/lib/http-service/productions/types"
import { GetBatchResponse } from "@/lib/http-service/batches/types"
import { ProductionsTable } from "../../components/productions-table"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"

interface ProductionsByBatchPageProps {
  params: {
    batchId: string
  }
  searchParams: {
    page?: string
    pageSize?: string
    error?: string
  }
}

export default async function ProductionsByBatchPage({ params, searchParams }: ProductionsByBatchPageProps) {
  const batchId = parseInt(params.batchId, 10);
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = parseInt(searchParams.pageSize || "10", 10);

  const session = await getServerSession(authOptions)
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log(session?.user.branchId)
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")
  console.log("*****")


  // Fetch batch and productions data
  const [batchResponse, productionsResponse] = await Promise.all([
    getBatchAction(batchId),
    getProductionsByBatchAction(batchId, {
      pageNo: page - 1,
      pageSize,
      sortBy: 'id',
      sortDir: 'desc'
    })
  ]);
  
  // Check for success and extract data
  let batch = undefined;
  let productions = [];
  let totalItems = 0;
  let totalPages = 1;

  if (batchResponse.success) {
    batch = batchResponse.data as GetBatchResponse;
  }

  if (productionsResponse.success && productionsResponse.data) {
    productions = productionsResponse.data.content;
    totalItems = productionsResponse.data.totalElements;
    totalPages = productionsResponse.data.totalPages;
  }

  // If batch not found, return 404
  if (!batch) {
    notFound();
  }

  // Calculate pagination details
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <Link href="/productions">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Productions for Batch {batch.batchNumber}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Batch ID: {batch.id}</span>
                <span>•</span>
                <span>Created: {formatDate(batch.createdDate)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/api/productions/batches/${batchId}/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/productions/new?batchId=${batchId}`}>
                <Plus className="mr-2 h-4 w-4" /> New Production
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Batch Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Batch Number</div>
                  <div className="text-xl font-bold">{batch.batchNumber}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Description</div>
                  <div>{batch.description || 'No description provided'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Created By</div>
                  <div>{batch.createdByName}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Production Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
                  <div className="text-sm text-blue-800">Total Productions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {productions.reduce((sum, p) => sum + p.quantity, 0)}
                  </div>
                  <div className="text-sm text-green-800">Total Quantity</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/batches/${batchId}`}>
                    <Package className="mr-2 h-4 w-4" />
                    View Batch Details
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/inventory/batches/${batch.batchNumber}/history`}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Inventory History
                  </Link>
                </Button>
                
                <Button className="w-full justify-start" asChild>
                  <Link href={`/productions/new?batchId=${batchId}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Production
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Production Records</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductionsTable
              productions={productions}
              pagination={{
                totalItems,
                totalPages,
                currentPage: page,
                itemsPerPage: pageSize,
                startIndex,
                endIndex,
              }}
              searchParams={searchParams}
              isLoading={false}
              showBatchColumn={false} // Don't show batch column since we're filtering by batch
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}