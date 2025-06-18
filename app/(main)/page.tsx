// app/(main)/page.tsx
import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/dashboard-server/stats-cards"
import { ChartSection } from "@/components/dashboard-server/chart-section"
import { RecentSalesSection } from "@/components/dashboard-server/recent-sales-section"
import { PopularProducts } from "@/components/dashboard-server/popular-products"
import { LowStockItems } from "@/components/dashboard-server/low-stock-items"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { CardSkeleton } from "@/components/skeletons/card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// Loading components for suspense boundaries
function ChartsSectionSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4">
        <ChartSkeleton />
      </div>
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-8">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <Skeleton className="ml-auto h-4 w-[80px]" />
              </div>
            ))}
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  )
}

function TabContentSkeleton() {
  return (
    <>
      <Skeleton className="h-6 w-1/4 mb-4" />
      <div className="grid gap-4 md:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </>
  )
}

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Stats Cards Section */}
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards />
        </Suspense>

        {/* Charts Section */}
        <Suspense fallback={<ChartsSectionSkeleton />}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <ChartSection />
            <RecentSalesSection />
          </div>
        </Suspense>

        {/* Tabs Section */}
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Popular Products</TabsTrigger>
            <TabsTrigger value="inventory">Low Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="border rounded-md p-4">
            <Suspense fallback={<TabContentSkeleton />}>
              <PopularProducts />
            </Suspense>
          </TabsContent>
          <TabsContent value="inventory" className="border rounded-md p-4">
            <Suspense fallback={<TabContentSkeleton />}>
              <LowStockItems />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}