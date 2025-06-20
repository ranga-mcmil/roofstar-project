// app/(main)/orders/[id]/payment/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getOrderAction, processLayawayPaymentAction } from "@/actions/orders"
import { OrderResponseDTO, PaymentMethod } from "@/lib/http-service/orders/types"
import { formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OrderPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = parseInt(params.id as string, 10)
  const [order, setOrder] = useState<OrderResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Form state
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")
  const [paymentReference, setPaymentReference] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      try {
        const response = await getOrderAction(orderId)
        if (response.success && response.data) {
          setOrder(response.data)
          // Pre-fill with remaining balance
          setAmount(response.data.balanceAmount.toString())
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!order) return

    const paymentAmount = parseFloat(amount)
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      })
      return
    }

    if (paymentAmount > order.balanceAmount) {
      toast({
        title: "Amount too high",
        description: "Payment amount cannot exceed the remaining balance",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('amount', paymentAmount.toString())
      formData.append('paymentMethod', paymentMethod)
      if (paymentReference) formData.append('paymentReference', paymentReference)
      if (notes) formData.append('notes', notes)

      const response = await processLayawayPaymentAction(formData, orderId)

      if (response.success) {
        toast({
          title: "Payment processed",
          description: `Payment of ${formatCurrency(paymentAmount)} has been recorded.`,
        })
        router.push(`/orders/${orderId}`)
      } else {
        toast({
          title: "Payment failed",
          description: response.error || "Failed to process payment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        title: "Payment failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validate amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only positive numbers with up to 2 decimal places
    if (!value || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
    }
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

  if (order.balanceAmount <= 0) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Link href={`/orders/${orderId}`}>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Payment Not Required</h1>
              <p className="text-muted-foreground">This order is already fully paid.</p>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-green-600 font-semibold text-lg mb-2">
                  Order Fully Paid
                </div>
                <p className="text-muted-foreground mb-4">
                  This order has been fully paid. No additional payment is required.
                </p>
                <Button asChild>
                  <Link href={`/orders/${orderId}`}>
                    View Order Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Link href={`/orders/${orderId}`}>
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add Payment</h1>
            <p className="text-muted-foreground">
              Order {order.orderNumber} - {order.customerName}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Payment Amount *</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="amount"
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      required
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAmount(order.balanceAmount.toString())}
                      disabled={isSubmitting}
                    >
                      Full
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum: {formatCurrency(order.balanceAmount)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select 
                    value={paymentMethod} 
                    onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                      <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                      <SelectItem value="MIXED">Mixed Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="paymentReference">Payment Reference</Label>
                  <Input
                    id="paymentReference"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Transaction ID, check number, etc."
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional reference for this payment
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes about this payment"
                    disabled={isSubmitting}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/orders/${orderId}`)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Process Payment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Order Total:</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-medium text-green-600">{formatCurrency(order.paidAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-medium">Outstanding Balance:</span>
                  <span className="font-bold text-red-600">{formatCurrency(order.balanceAmount)}</span>
                </div>
                
                {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
                  <>
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>This Payment:</span>
                        <span className="font-medium">{formatCurrency(parseFloat(amount))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">New Balance:</span>
                        <span className="font-bold">
                          {formatCurrency(Math.max(0, order.balanceAmount - parseFloat(amount)))}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Order Information */}
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order Type:</span>
                    <span>{order.orderType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span>{order.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Branch:</span>
                    <span>{order.branchName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{new Date(order.createdDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Recent Payments */}
              {order.payments && order.payments.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Recent Payments</h4>
                  <div className="space-y-2">
                    {order.payments.slice(-3).map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
                        <div>
                          <div className="font-medium">{formatCurrency(payment.amount)}</div>
                          <div className="text-xs text-muted-foreground">
                            {payment.paymentMethod.replace('_', ' ')}
                            {payment.paymentReference && ` • ${payment.paymentReference}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </div>
                          {payment.reversed && (
                            <div className="text-xs text-red-600">Reversed</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}