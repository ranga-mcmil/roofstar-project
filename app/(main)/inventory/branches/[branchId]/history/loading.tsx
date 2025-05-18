import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BranchInventoryLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Header with back button and branch info */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <Skeleton className="h-7 w-[300px] mb-1" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" /> Export History
            </Button>
          </div>
        </div>

        {/* Branch info card */}
        <Card className="mb-4">
          <CardHeader>
            <Skeleton className="h-5 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Skeleton className="h-4 w-[80px] mb-2" />
                <Skeleton className="h-5 w-[120px]" />
              </div>
              <div>
                <Skeleton className="h-4 w-[80px] mb-2" />
                <Skeleton className="h-5 w-[120px]" />
              </div>
              <div>
                <Skeleton className="h-4 w-[80px] mb-2" />
                <Skeleton className="h-5 w-[120px]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and table */}
        <div className="border rounded-lg p-2">
          {/* Filter skeletons */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
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
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-28" /></TableHead>
                  <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-5 w-24 ml-auto" />
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