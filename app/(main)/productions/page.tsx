import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download, Package, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QuickCreateButton } from "./components/quick-create-button"
import ProductionsClientContent from "./components/productions-client-content"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp } from "lucide-react"

interface ProductionsPageProps {
  search?: string
  batch?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: string
  pageSize?: string
}

// Loading component for the client content
function ProductionsLoadingFallback() {
  return (
    <>
      {/* Stats cards with skeletons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 rounded" />
            <p className="text-xs text-muted-foreground mt-1">
              All production records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 rounded" />
            <p className="text-xs text-muted-foreground mt-1">Currently in production</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 rounded" />
            <p className="text-xs text-muted-foreground mt-1">Production records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Output</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 rounded" />
            <p className="text-xs text-muted-foreground mt-1">Units produced</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and table skeleton */}
      <div className="border rounded-lg p-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
          <Skeleton className="h-10 w-full sm:w-[300px]" />
          <Skeleton className="h-10 w-[160px]" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </>
  )
}

export default async function ProductionsPage(props: {
  searchParams?: Promise<ProductionsPageProps>;
}) {
  // Await searchParams if provided
  const searchParams = props.searchParams ? await props.searchParams : {};
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Productions</h1>
            <p className="text-muted-foreground">Track and manage production records</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/productions/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Related Management Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Related
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Related Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <FileText className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Orders</span>
                      <span className="text-xs text-muted-foreground">Manage production orders</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/inventory">
                    <Package className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                      <span>Inventory</span>
                      <span className="text-xs text-muted-foreground">Manage inventory items</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/batches">
                    <Package className="mr-2 h-4 w-4 text-purple-600" />
                    <div className="flex flex-col">
                      <span>Batches</span>
                      <span className="text-xs text-muted-foreground">Manage production batches</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/orders/new" className="text-blue-600 focus:text-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Quick Add Order
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Quick Create Button - client component */}
            <Suspense fallback={<Button disabled><Plus className="mr-2 h-4 w-4" /> New Production</Button>}>
              <QuickCreateButton />
            </Suspense>
          </div>
        </div>

        {/* Client component for dynamic content with loading states wrapped in Suspense */}
        <Suspense fallback={<ProductionsLoadingFallback />}>
          <ProductionsClientContent searchParams={searchParams as Record<string, string>} />
        </Suspense>
      </main>
    </div>
  )
}