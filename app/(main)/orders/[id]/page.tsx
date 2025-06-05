// app/(main)/orders/[id]/page.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Download, 
  Loader2, 
  Printer, 
  Edit, 
  CreditCard,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getOrderAction, markReadyForCollectionAction, completeCollectionAction } from "@/actions/orders"
import { OrderResponseDTO, OrderStatus, OrderType } from "@/lib/http-service/orders/types"
import { formatCurrency } from "@/lib/utils"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = parseInt(params.id as string, 10)
  const [order, setOrder] = useState<OrderResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const orderRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      try {
        const response = await getOrderAction(orderId)
        if (response.success && response.data) {
          setOrder(response.data)
        } else {
          toast({
            title: "Error loading order",
            description: response.error || "Order not found",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Error loading order",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, toast])

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      try {
        window.print()
        toast({
          title: "Print initiated",
          description: "The order has been sent to your printer.",
        })
      } catch (error) {
        toast({
          title: "Print failed",
          description: "There was an error sending to your printer.",
          variant: "destructive",
        })
      } finally {
        setIsPrinting(false)
      }
    }, 100)
  }

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      try {
        const filename = `Order_${order?.orderNumber}_${order?.customerName.replace(/\s+/g, "_")}.pdf`
        const link = document.createElement("a")
        link.href = "#"
        link.setAttribute("download", filename)
        link.click()

        toast({
          title: "Order exported",
          description: `Order has been exported as ${filename}`,
        })
      } catch (error) {
        toast({
          title: "Export failed",
          description: "There was an error exporting the order.",
          variant: "destructive",
        })
      } finally {
        setIsExporting(false)
      }
    }, 1000)
  }

  const handleMarkReady = async () => {
    if (!order) return
    
    setIsProcessing(true)
    try {
      const response = await markReadyForCollectionAction(order.id)
      if (response.success && response.data) {
        setOrder(response.data)
        toast({
          title: "Order marked ready",
          description: "Order is now ready for collection.",
        })
      } else {
        toast({
          title: "Error updating order",
          description: response.error || "Failed to mark order as ready",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error updating order",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCompleteCollection = async () => {
    if (!order) return
    
    setIsProcessing(true)
    try {
      const response = await completeCollectionAction(order.id)
      if (response.success && response.data) {
        setOrder(response.data)
        toast({
          title: "Order completed",
          description: "Order has been marked as completed.",
        })
      } else {
        toast({
          title: "Error completing order",
          description: response.error || "Failed to complete order",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error completing order",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Get status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      'PENDING': { 
        icon: Clock, 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Pending'
      },
      'CONFIRMED': { 
        icon: CheckCircle, 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Confirmed'
      },
      'PARTIALLY_PAID': { 
        icon: CreditCard, 
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        label: 'Partially Paid'
      },
      'FULLY_PAID': { 
        icon: CheckCircle, 
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Fully Paid'
      },
      'READY_FOR_COLLECTION': { 
        icon: Package, 
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Ready for Collection'
      },
      'COMPLETED': { 
        icon: CheckCircle, 
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Completed'
      },
      'CANCELLED': { 
        icon: XCircle, 
        className: 'bg-red-100 text-red-800 border-red-200',
        label: 'Cancelled'
      },
      'REVERSED': { 
        icon: AlertCircle, 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Reversed'
      }
    }

    const config = statusConfig[status] || statusConfig['PENDING']
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
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

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="mt-4">Loading order...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Order Not Found</h1>
              <p className="text-muted-foreground">The requested order could not be found.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const orderDate = new Date(order.createdDate)
  const canMarkReady = order.status === 'FULLY_PAID' || (order.orderType === 'FUTURE_COLLECTION' && order.paidAmount > 0)
  const canComplete = order.status === 'READY_FOR_COLLECTION'

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-muted-foreground">
                {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {canMarkReady && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isProcessing}>
                    <Package className="mr-2 h-4 w-4" />
                    Mark Ready
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Mark Order Ready for Collection</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will mark the order as ready for collection. The customer will be notified.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleMarkReady}>
                      Mark Ready
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {canComplete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isProcessing}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Complete Order</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will mark the order as completed. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCompleteCollection}>
                      Complete Order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Download"}
            </Button>
            <Button onClick={handlePrint} disabled={isPrinting}>
              <Printer className="mr-2 h-4 w-4" />
              {isPrinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Print"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Summary Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Details</CardTitle>
                <div className="flex gap-2">
                  {getTypeBadge(order.orderType)}
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {order.customerName}</p>
                    <p><span className="font-medium">Branch:</span> {order.branchName}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Order Number:</span> {order.orderNumber}</p>
                    <p><span className="font-medium">Created:</span> {orderDate.toLocaleDateString()}</p>
                    {order.expectedCollectionDate && (
                      <p><span className="font-medium">Expected Collection:</span> {new Date(order.expectedCollectionDate).toLocaleDateString()}</p>
                    )}
                    {order.completionDate && (
                      <p><span className="font-medium">Completed:</span> {new Date(order.completionDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mt-4 p-3 border rounded-md bg-muted/20">
                  <h3 className="font-semibold mb-1">Notes:</h3>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span className="font-medium text-green-600">{formatCurrency(order.paidAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Balance:</span>
                  <span className={order.balanceAmount > 0 ? "text-red-600" : "text-green-600"}>
                    {formatCurrency(order.balanceAmount)}
                  </span>
                </div>
                
                {order.balanceAmount > 0 && order.orderType !== 'QUOTATION' && (
                  <Button className="w-full mt-4" asChild>
                    <Link href={`/orders/${order.id}/payment`}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Add Payment
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card ref={orderRef}>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">Code: {item.productCode}</div>
                          {item.notes && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Note: {item.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td colSpan={3} className="p-3 text-right font-medium">Total:</td>
                    <td className="p-3 text-right font-bold text-lg">{formatCurrency(order.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        {order.payments && order.payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">{formatCurrency(payment.amount)}</div>
                      <div className="text-sm text-muted-foreground">
                        {payment.paymentMethod.replace('_', ' ')} • {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                      {payment.paymentReference && (
                        <div className="text-sm text-muted-foreground">
                          Ref: {payment.paymentReference}
                        </div>
                      )}
                      {payment.notes && (
                        <div className="text-sm text-muted-foreground">
                          {payment.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        By: {payment.receivedBy}
                      </div>
                      {payment.reversed && (
                        <Badge variant="destructive" className="mt-1">
                          Reversed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Layaway Information */}
        {order.orderType === 'LAYAWAY' && (
          <Card>
            <CardHeader>
              <CardTitle>Layaway Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <Link href={`/orders/${order.id}/layaway-schedule`}>
                    View Payment Schedule
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/orders/${order.id}/layaway-summary`}>
                    Payment Summary
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}