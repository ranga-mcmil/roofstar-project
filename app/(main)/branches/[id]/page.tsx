import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, Printer } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBranchAction } from "@/actions/branches"
import { GetBranchResponse } from "@/lib/http-service/branches/types"

interface BranchDetailsPageProps {
  params: {
    id: string
  }
  searchParams: {
    error?: string
  }
}

export default async function BranchDetailsPage({ params, searchParams }: BranchDetailsPageProps) {
  const id = params.id;

  // Fetch branch data
  const response = await getBranchAction(id);
  
  // Check for success and extract branch data
  let branch = undefined;
  if (response.success) {
    branch = response.data as GetBranchResponse;
  }

  // If branch not found, return 404
  if (!branch) {
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
              <Link href="/branches">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{branch.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{branch.location}</span>
                <span>•</span>
                {getStatusBadge(branch.isActive)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/branches/${id}/print`}
                target="_blank"
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/api/branches/${id}/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/branches/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/branches/${id}/${branch.isActive ? 'deactivate' : 'activate'}`}>
                {branch.isActive ? "Deactivate" : "Activate"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Branch Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Name</div>
                  <div>{branch.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Location</div>
                  <div>{branch.location}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <div>{getStatusBadge(branch.isActive)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Address</div>
                  <div>
                    {branch.address.street && <div>{branch.address.street}</div>}
                    <div>
                      {branch.address.city}, {branch.address.province}
                      {branch.address.postalCode && ` ${branch.address.postalCode}`}
                    </div>
                    {branch.address.country && <div>{branch.address.country}</div>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total Users:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  No users assigned to this branch
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild size="sm">
                  <Link href="/users/new?id=${id}">
                    Add User
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground mb-4">No inventory items found in this branch.</div>
            <Button variant="outline" asChild>
              <Link href={`/inventory/add?id=${id}`}>Add Inventory Items</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}