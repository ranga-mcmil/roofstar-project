"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, DollarSign, Package, Users } from "lucide-react"
import Link from "next/link"
import { DashboardChart } from "@/components/dashboard-chart"
import { RecentSales } from "@/components/recent-sales"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/skeletons/card-skeleton"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {loading ? (
          <StatsCardSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+10.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,234</div>
                <p className="text-xs text-muted-foreground">+4% from last month</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {loading ? (
            <>
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
            </>
          ) : (
            <>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <DashboardChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
                <CardFooter>
                  <Link href="/sales">
                    <Button variant="outline" className="w-full">
                      View All
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </>
          )}
        </div>

        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Popular Products</TabsTrigger>
            <TabsTrigger value="inventory">Low Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="border rounded-md p-4">
            {loading ? (
              <>
                <Skeleton className="h-6 w-1/4 mb-4" />
                <div className="grid gap-4 md:grid-cols-3">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-4">Top Selling IBR Sheets</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">IBR 0.47mm - Charcoal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">432 sheets</div>
                      <p className="text-xs text-muted-foreground">$15,552 in sales</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">IBR 0.53mm - Galvanized</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">287 sheets</div>
                      <p className="text-xs text-muted-foreground">$12,915 in sales</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">IBR 0.58mm - Forest Green</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">198 sheets</div>
                      <p className="text-xs text-muted-foreground">$9,900 in sales</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="inventory" className="border rounded-md p-4">
            {loading ? (
              <>
                <Skeleton className="h-6 w-1/4 mb-4" />
                <div className="grid gap-4 md:grid-cols-3">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-4">Low Stock Alert</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-red-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">IBR 0.58mm - Brick Red</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-red-500">5 sheets left</div>
                      <p className="text-xs text-muted-foreground">Reorder point: 15</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/inventory/reorder">
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  <Card className="border-yellow-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">IBR 0.47mm - White</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-yellow-500">12 sheets left</div>
                      <p className="text-xs text-muted-foreground">Reorder point: 20</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/inventory/reorder">
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  <Card className="border-yellow-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">IBR 0.53mm - Blue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-yellow-500">18 sheets left</div>
                      <p className="text-xs text-muted-foreground">Reorder point: 25</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/inventory/reorder">
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
