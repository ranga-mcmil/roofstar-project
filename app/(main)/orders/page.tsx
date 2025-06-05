// app/(main)/orders/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, FileText, Search, ShoppingCart, Plus } from "lucide-react"
import Link from "next/link"
import { DateRangePicker } from "@/components/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"
import { getAllOrdersAction } from "@/actions/orders"
import { OrderResponseDTO, OrderType, OrderStatus } from "@/lib/http-service/orders/types"
import { formatCurrency } from "@/lib/utils"

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderResponseDTO[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [isExporting, setIsExporting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(20)
  const { toast } = useToast()

  // Load orders data
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      try {
        const response = await getAllOrdersAction({
          pageNo: currentPage - 1,
          pageSize: itemsPerPage,
          sortBy: 'createdDate',
          sortDir: 'desc'
        })

        if (response.success && response.data) {
          setOrders(response.data.content)
          setFilteredOrders(response.data.content)
          setTotalPages(response.data.totalPages)
          setTotalItems(response.data.totalElements)
        } else {
          toast({
            title: "Error loading orders",
            description: response.error || "Failed to load orders",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading orders:", error)
        toast({
          title: "Error loading orders",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [currentPage, itemsPerPage, toast])

  // Apply filters
  useEffect(() => {
    if (loading) return

    let result = [...orders]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.id.toString().includes(query)
      )
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((order) => order.orderType === typeFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Apply date range filter
    if (dateRange.from) {
      result = result.filter((order) => {
        const orderDate = new Date(order.createdDate)
        return orderDate >= dateRange.from!
      })
    }

    if (dateRange.to) {
      result = result.filter((order) => {
        const orderDate = new Date(order.createdDate)
        return orderDate <= dateRange.to!
      })
    }

    setFilteredOrders(result)
  }, [orders, searchQuery, typeFilter, statusFilter, dateRange, loading])

  // Calculate stats
  const totalOrders = filteredOrders.length
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const pendingOrders = filteredOrders.filter(order => 
    order.status === 'PENDING' || order.status === 'CONFIRMED'
  ).length

  // Get status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    const statusStyles = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'CONFIRMED': 'bg-blue-100 text-blue-800 border-blue-200',
      'PARTIALLY_PAID': 'bg-orange-100 text-orange-800 border-orange-200',
      'FULLY_PAID': 'bg-green-100 text-green-800 border-green-200',
      'READY_FOR_COLLECTION': 'bg-purple-100 text-purple-800 border-purple-200',
      'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
      'CANCELLED': 'bg-red-100 text-red-800 border-red-200',
      'REVERSED': 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return (
      <Badge 
        variant="outline" 
        className={statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}
      >
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  // Get order type badge styling
  const getTypeBadge = (type: OrderType) => {
    const typeStyles = {
      'IMMEDIATE_SALE': 'bg-green-100 text-green-800 border-green-200',
      'FUTURE_COLLECTION': 'bg-blue-100 text-blue-800 border-blue-200',
      'LAYAWAY': 'bg-purple-100 text-purple-800 border-purple-200',
      'QUOTATION': 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return (
      <Badge 
        variant="outline" 
        className={typeStyles[type] || 'bg-gray-100 text-gray-800 border-gray-200'}
      >
        {type.replace('_', ' ')}
      </Badge>
    )
  }

  // Export orders data as CSV
  const exportOrdersCSV = () => {
    setIsExporting(true)

    try {
      // Create CSV content
      const headers = [
        "Order ID", "Order Number", "Date", "Customer", "Type", 
        "Status", "Items", "Total Amount", "Paid Amount", "Balance"
      ]
      const rows = filteredOrders.map((order) => [
        order.id.toString(),
        order.orderNumber,
        new Date(order.createdDate).toLocaleString(),
        order.customerName,
        order.orderType.replace('_', ' '),
        order.status.replace('_', ' '),
        order.orderItems.length,
        `$${order.totalAmount.toFixed(2)}`,
        `$${order.paidAmount.toFixed(2)}`,
        `$${order.balanceAmount.toFixed(2)}`
      ])

      // Combine headers and rows
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `orders_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting orders data:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the orders data.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground">View and manage your orders</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportOrdersCSV} disabled={isExporting || loading}>
              <Download className="mr-2 h-4 w-4" /> {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button asChild>
              <Link href="/pos">
                <Plus className="mr-2 h-4 w-4" /> New Order
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <StatsCardSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredOrders.length === orders.length ? "All orders" : `Filtered from ${orders.length} total`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">For selected period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
                <p className="text-xs text-muted-foreground">Per order</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
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
                placeholder="Search orders..."
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
                  <Skeleton className="h-10 w-[160px]" />
                  <Skeleton className="h-10 w-[160px]" />
                </>
              ) : (
                <>
                  <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Order Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="IMMEDIATE_SALE">Immediate Sale</SelectItem>
                      <SelectItem value="FUTURE_COLLECTION">Future Collection</SelectItem>
                      <SelectItem value="LAYAWAY">Layaway</SelectItem>
                      <SelectItem value="QUOTATION">Quotation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                      <SelectItem value="FULLY_PAID">Fully Paid</SelectItem>
                      <SelectItem value="READY_FOR_COLLECTION">Ready for Collection</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="REVERSED">Reversed</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <TableSkeleton columnCount={9} rowCount={itemsPerPage} />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No orders found. {orders.length > 0 ? "Try adjusting your filters." : "Create your first order."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{new Date(order.createdDate).toLocaleDateString()}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{getTypeBadge(order.orderType)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.orderItems.length} items</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {order.balanceAmount > 0 ? (
                            <span className="text-red-600 font-medium">
                              {formatCurrency(order.balanceAmount)}
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">Paid</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>
                              <FileText className="mr-2 h-4 w-4" /> View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalItems > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} orders
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}