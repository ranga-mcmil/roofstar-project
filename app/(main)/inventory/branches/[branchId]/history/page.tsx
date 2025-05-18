import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getInventoryByBranchAction } from "@/actions/inventory"
import { getBranchAction } from "@/actions/branches"
import BranchInventoryClientContent from "../../../components/branch-inventory-client-content"

interface BranchInventoryPageProps {
  params: {
    branchId: string
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

export default async function BranchInventoryPage({ params, searchParams }: BranchInventoryPageProps) {
  const { branchId } = params;

  // Fetch branch data to confirm it exists and show branch info
  const branchResponse = await getBranchAction(branchId);
  
  // If branch not found, return 404
  if (!branchResponse.success || !branchResponse.data) {
    notFound();
  }

  const branch = branchResponse.data as any;
  
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
              <Link href={`/branches/${branchId}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Branch</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Inventory History: {branch.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Location: {branch.location}</span>
                <span>•</span>
                <span>Status: {branch.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/api/inventory/branches/${branchId}/history/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export History
              </Link>
            </Button>
          </div>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Branch Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p>{branch.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p>{branch.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Address</p>
                <p>{branch.address?.city}, {branch.address?.province}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client component for dynamic inventory history with loading states */}
        <BranchInventoryClientContent 
          branchId={branchId} 
          searchParams={searchParams as Record<string, string>} 
        />
      </main>
    </div>
  )
}