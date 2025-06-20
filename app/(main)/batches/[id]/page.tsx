import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Edit, Printer, Package, History } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBatchAction } from "@/actions/batches"
import { GetBatchResponse } from "@/lib/http-service/batches/types"

interface BatchDetailsPageProps {
  params: {
    id: string
  }
  searchParams: {
    error?: string
  }
}

export default async function BatchDetailsPage({ params, searchParams }: BatchDetailsPageProps) {
  const id = parseInt(params.id, 10);

  // Fetch batch data
  const response = await getBatchAction(id);
  
  // Check for success and extract batch data
  let batch = undefined;
  if (response.success) {
    batch = response.data as GetBatchResponse;
  }

  // If batch not found, return 404
  if (!batch) {
    notFound();
  }

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
              <Link href="/batches">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Batch {batch.batchNumber}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>ID: {batch.id}</span>
                <span>•</span>
                <span>Created: {formatDate(batch.createdDate)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/batches/${id}/print`}
                target="_blank"
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/api/batches/${id}/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/batches/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button variant="destructive" asChild>
              <Link href={`/batches/${id}/delete`}>
                Delete
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
                <div className="space-y-1">
                  <div className="text-sm font-medium">Created Date</div>
                  <div>{formatDate(batch.createdDate)}</div>
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
                  <Link href={`/inventory/batches/${batch.batchNumber}/history`}>
                    <History className="mr-2 h-4 w-4" />
                    View Inventory History
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/productions/batches/${batch.id}`}>
                    <Package className="mr-2 h-4 w-4" />
                    View Productions
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/inventory/batches/${batch.batchNumber}/add`}>
                    <Package className="mr-2 h-4 w-4 text-green-600" />
                    Add Inventory
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/batches/${batch.id}/report`}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Batch Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-blue-800">Total Inventory Items</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-green-800">Production Records</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-800">Active Orders</div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground text-center">
                <p>Detailed statistics will be loaded when you access inventory and production data.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}