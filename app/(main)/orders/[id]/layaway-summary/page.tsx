// app/(main)/orders/[id]/layaway-summary/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, CreditCard, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getLayawayPaymentSummaryAction } from "@/actions/orders"
import { LayawayPaymentSummaryDTO } from "@/lib/http-service/orders/types"
import { formatCurrency } from "@/lib/utils"

export default function LayawaySummaryPage() {
  const params = useParams()
  const orderId = parseInt(params.id as string, 10)
  const [summary, setSummary] = useState<LayawayPaymentSummaryDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true)
      try {
        const response = await getLayawayPaymentSummaryAction(orderId)
        if (response.success && response.data) {
          setSummary(response.data)
        } else {
          toast({
            title: "Error loading summary",
            description: response.error || "Summary not found",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching summary:", error)
        toast({
          title: "Error loading summary",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [orderId, toast])

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="mt-4">Loading payment summary...</div>
      </div>
    )
  }

  if (!summary) {
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
              <h1 className="text-2xl font-bold">Summary Not Found</h1>
              <p className="text-muted-foreground">The payment summary could not be found.</p>
            </div>
          </div>
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
            <h1 className="text-2xl font-bold">Layaway Payment Summary</h1>
            <p className="text-muted-foreground">
              Order {summary.orderNumber} - Payment Overview
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Payment Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Expected:</span>
                  <span className="font-bold text-lg">{formatCurrency(summary.totalExpected)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Paid:</span>
                  <span className="font-bold text-lg text-green-600">{formatCurrency(summary.totalPaid)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span>Remaining Balance:</span>
                  <span className={`font-bold text-lg ${summary.remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(summary.remainingBalance)}
                  </span>
                </div>

                {/* Payment Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Payment Progress</span>
                    <span>{(summary.paymentProgress * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={summary.paymentProgress * 100} className="h-3" />
                </div>

                {/* Status Badge */}
                <div className="flex justify-center mt-6">
                  {summary.fullyPaid ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                      Fully Paid
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="px-4 py-2">
                      Payment in Progress
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Installment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Installment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{summary.paidInstallments}</div>
                    <div className="text-sm text-muted-foreground">Paid</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{summary.overdueInstallments}</div>
                    <div className="text-sm text-muted-foreground">Overdue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{summary.totalInstallments}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>

                {/* Next Payment Due */}
                {!summary.fullyPaid && summary.nextDueDate && (
                  <div className="border rounded-lg p-4 mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Next Payment Due</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {new Date(summary.nextDueDate).toLocaleDateString()}
                    </div>
                    <div className="font-bold text-lg">
                      {formatCurrency(summary.nextDueAmount)}
                    </div>
                  </div>
                )}

                {/* Overdue Warning */}
                {summary.overdueInstallments > 0 && (
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Overdue Payments</span>
                    </div>
                    <div className="text-sm text-red-700">
                      You have {summary.overdueInstallments} overdue installment{summary.overdueInstallments > 1 ? 's' : ''}. 
                      Please make a payment as soon as possible.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 justify-center">
              {!summary.fullyPaid && (
                <Button asChild size="lg">
                  <Link href={`/orders/${orderId}/payment`}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make Payment
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild size="lg">
                <Link href={`/orders/${orderId}/layaway-schedule`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  View Schedule
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href={`/orders/${orderId}`}>
                  View Order Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.totalInstallments}
                </div>
                <div className="text-sm text-muted-foreground">Total Installments</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {summary.paidInstallments}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {summary.totalInstallments - summary.paidInstallments - summary.overdueInstallments}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {summary.overdueInstallments}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}