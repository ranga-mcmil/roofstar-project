// loading.tsx
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, ArrowUpDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory Adjustments</h1>
            <p className="text-muted-foreground">Track and manage inventory adjustments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Stats cards with skeletons */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Adjustments</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 rounded" />
              <p className="text-xs text-muted-foreground mt-1">
                All inventory adjustments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Additions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 rounded" />
              <p className="text-xs text-muted-foreground mt-1">Inventory added</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Reductions</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 rounded" />
              <p className="text-xs text-muted-foreground mt-1">Inventory removed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and table */}
        <div className="border rounded-lg p-2">
          {/* Filter skeletons */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
            <Skeleton className="h-10 w-full sm:w-[300px]" />
            <Skeleton className="h-10 w-[160px]" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-[160px]" />
              <Skeleton className="h-10 w-[160px]" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-36" /></TableHead>
                  <TableHead className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-20" />
              <div className="flex items-center space-x-1">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}