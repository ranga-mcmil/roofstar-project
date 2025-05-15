"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, LineChart, PieChart } from "lucide-react"
import { SalesReportChart } from "@/components/sales-report-chart"
import { ProductPerformanceChart } from "@/components/product-performance-chart"
import { InventoryValueChart } from "@/components/inventory-value-chart"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"

export default function ReportsPage() {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Analyze your business performance</p>
          </div>
          <Button variant="outline" disabled={loading}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Inventory
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="space-y-4">
            {loading ? (
              <>
                <ChartSkeleton />
                <StatsCardSkeleton />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Monthly sales performance for the current year</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <SalesReportChart />
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$45,231.89</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last year</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$1,245.00</div>
                      <p className="text-xs text-muted-foreground">+5.2% from last year</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24.5%</div>
                      <p className="text-xs text-muted-foreground">+2.4% from last year</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">32.8%</div>
                      <p className="text-xs text-muted-foreground">+1.8% from last year</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="products" className="space-y-4">
            {loading ? (
              <>
                <ChartSkeleton />
                <StatsCardSkeleton />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Product Performance</CardTitle>
                    <CardDescription>Sales breakdown by product category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ProductPerformanceChart />
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Top Selling Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">IBR 0.47mm - Charcoal</div>
                      <p className="text-xs text-muted-foreground">432 sheets sold</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Most Profitable Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">IBR 0.58mm - Forest Green</div>
                      <p className="text-xs text-muted-foreground">42% profit margin</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Slowest Moving Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">IBR 0.58mm - Brick Red</div>
                      <p className="text-xs text-muted-foreground">5 units sold this month</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="inventory" className="space-y-4">
            {loading ? (
              <>
                <ChartSkeleton />
                <StatsCardSkeleton />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Value</CardTitle>
                    <CardDescription>Current inventory value by product category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <InventoryValueChart />
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$24,350</div>
                      <p className="text-xs text-muted-foreground">Across 9 products</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.2x</div>
                      <p className="text-xs text-muted-foreground">Per year</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">Below reorder point</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Days of Supply</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45</div>
                      <p className="text-xs text-muted-foreground">Average across all products</p>
                    </CardContent>
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
