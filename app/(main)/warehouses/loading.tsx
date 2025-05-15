import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"

export default function WarehousesLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        <StatsCardSkeleton />

        <div className="border rounded-lg p-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="flex flex-col gap-2 md:flex-row">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </div>

          <TableSkeleton columnCount={6} rowCount={10} />
        </div>
      </main>
    </div>
  )
}
