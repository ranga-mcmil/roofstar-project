"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, FileText, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import type { Sale } from "@/lib/types"
import { DateRangePicker } from "@/components/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { initializeDummyData } from "@/lib/dummy-data"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/ui/pagination"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [isExporting, setIsExporting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData()

    // Simulate loading delay
    const timer = setTimeout(() => {
      // Load sales data
      const savedSales = JSON.parse(localStorage.getItem("sales") || "[]") as Sale[]
      setSales(savedSales)
      setFilteredSales(savedSales)
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (loading) return

    let result = [...sales]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (sale) =>
          sale.id.toLowerCase().includes(query) ||
          sale.customerName.toLowerCase().includes(query) ||
          `#${sale.id.split("-")[1]}`.includes(query),
      )
    }

    // Apply payment method filter
    if (paymentFilter !== "all") {
      result = result.filter((sale) => sale.paymentMethod === paymentFilter)
    }

    // Apply date range filter
    if (dateRange.from) {
      result = result.filter((sale) => {
        const saleDate = new Date(sale.date)
        return saleDate >= dateRange.from!
      })
    }

    if (dateRange.to) {
      result = result.filter((sale) => {
        const saleDate = new Date(sale.date)
        return saleDate <= dateRange.to!
      })
    }

    setFilteredSales(result)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [sales, searchQuery, paymentFilter, dateRange, loading])

  // Calculate totals
  const totalSales = filteredSales.length
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSales = filteredSales.slice(startIndex, endIndex)

  // Export sales data as CSV
  const exportSalesCSV = () => {
    setIsExporting(true)

    try {
      // Create CSV content
      const headers = ["Sale ID", "Date", "Customer", "Items", "Payment Method", "Status", "Total"]
      const rows = filteredSales.map((sale) => [
        `#${sale.id.split("-")[1]}`,
        new Date(sale.date).toLocaleString(),
        sale.customerName,
        sale.items.length,
        sale.paymentMethod,
        sale.status,
        `$${sale.total.toFixed(2)}`,
      ])

      // Combine headers and rows
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `sales_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting sales data:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sales History</h1>
            <p className="text-muted-foreground">View and manage your sales transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportSalesCSV} disabled={isExporting || loading}>
              <Download className="mr-2 h-4 w-4" /> {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button asChild>
              <Link href="/pos/new">
                <ShoppingCart className="mr-2 h-4 w-4" /> New Sale
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <StatsCardSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSales}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredSales.length === sales.length ? "All sales" : `Filtered from ${sales.length} total`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">For selected period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="border rounded-lg p-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sales..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-[300px]" />
                  <Skeleton className="h-10 w-[180px]" />
                </>
              ) : (
                <>
                  <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <TableSkeleton columnCount={8} rowCount={5} />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No sales found. {sales.length > 0 ? "Try adjusting your filters." : "Create your first sale."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">#{sale.id.split("-")[1]}</TableCell>
                        <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                        <TableCell>{sale.customerName}</TableCell>
                        <TableCell>{sale.items.length} items</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {sale.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Completed</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">${sale.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/sales/receipt/${sale.id}`}>
                              <FileText className="mr-2 h-4 w-4" /> View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {filteredSales.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredSales.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
