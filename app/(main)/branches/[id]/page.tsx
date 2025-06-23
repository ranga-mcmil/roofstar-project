import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, Printer, CheckCircle, XCircle, Users, MapPin, Building2, Package, History, BarChart3 } from "lucide-react"
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
      ? <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
      : <Badge variant="outline" className="bg-gray-100"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
  }

  // Format address
  const formatAddress = (address: any) => {
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city && address.province) {
      parts.push(`${address.city}, ${address.province}`);
    }
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country) parts.push(address.country);
    return parts;
  };

  const addressParts = formatAddress(branch.address);

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
              <Link href="/branches">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-bold">{branch.name}</h1>
                {getStatusBadge(branch.isActive)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{branch.location}</span>
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
            <Button asChild variant={branch.isActive ? "destructive" : "default"}>
              <Link href={`/branches/${id}/${branch.isActive ? 'deactivate' : 'activate'}`}>
                {branch.isActive ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Branch Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div className="font-medium">{branch.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Location</div>
                  <div>{branch.location}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div>{getStatusBadge(branch.isActive)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Branch ID</div>
                  <div className="text-sm font-mono text-muted-foreground">{branch.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {addressParts.length > 0 ? (
                  addressParts.map((part, index) => (
                    <div key={index} className="text-sm">
                      {part}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No address information available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Assigned Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Users:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  No users assigned to this branch
                </div>
                <div className="pt-2">
                  <Button variant="outline" asChild size="sm">
                    <Link href={`/users/new?branchId=${id}`}>
                      <Users className="mr-2 h-4 w-4" />
                      Add User
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Inventory Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Products:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Inventory Items:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Batches:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button variant="outline" asChild size="sm">
                    <Link href={`/inventory/branches/${id}/history`}>
                      <History className="mr-2 h-4 w-4" />
                      View History
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="sm">
                    <Link href={`/products?branchId=${id}`}>
                      <Package className="mr-2 h-4 w-4" />
                      Products
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2">
                <Link href={`/inventory/branches/${id}/history`}>
                  <History className="h-5 w-5" />
                  <span className="text-sm">Inventory History</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2">
                <Link href={`/products?branchId=${id}`}>
                  <Package className="h-5 w-5" />
                  <span className="text-sm">Branch Products</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2">
                <Link href={`/orders/new?branchId=${id}`}>
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm">Create Order</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2">
                <Link href={`/users?branchId=${id}`}>
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Manage Users</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}