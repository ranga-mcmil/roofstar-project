// app/(main)/orders/[id]/layaway-schedule/page.tsx - COMPLETE VERSION
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, CheckCircle, Clock, Loader2, CreditCard } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getLayawayScheduleAction } from "@/actions/orders"
import { LayawayScheduleDTO } from "@/lib/http-service/orders/types"
import { formatCurrency } from "@/lib/utils"

export default function LayawaySchedulePage() {
  const params = useParams()
  const orderId = parseInt(params.id as string, 10)
  const [schedule, setSchedule] = useState<LayawayScheduleDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true)
      try {
        const response = await getLayawayScheduleAction(orderId)
        if (response.success && response.data) {
          setSchedule(response.data)
        } else {
          toast({
            title: "Error loading schedule",
            description: response.error || "Schedule not found",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching schedule:", error)
        toast({
          title: "Error loading schedule",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [orderId, toast])

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="mt-4">Loading payment schedule...</div>
      </div>
    )
  }

  if (!schedule) {
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
              <h1 className="text-2xl font-bold">Schedule Not Found</h1>
              <p className="text-muted-foreground">The payment schedule could not be found.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const getInstallmentStatus = (installment: any) => {
    if (installment.paid) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      )
    } else if (installment.overdue) {
      return (
        <Badge variant="destructive">
          <Clock className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    }
  }

  const totalPaid = schedule.installments.filter(i => i.paid).length + 1 // +1 for deposit
  const totalPayments = schedule.numberOfInstallments + 1 // +1 for deposit
  const progressPercentage = (totalPaid / totalPayments) * 100

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
            <h1 className="text-2xl font-bold">Layaway Payment Schedule</h1>
            <p className="text-muted-foreground">View installment plan and payment history</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Schedule Overview */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Deposit */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                  <div>
                    <div className="font-medium">Initial Deposit</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(schedule.firstInstallmentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(schedule.depositAmount)}</div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Paid
                    </Badge>
                  </div>
                </div>

                {/* Installments */}
                {schedule.installments.map((installment) => (
                  <div
                    key={installment.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      installment.overdue ? 'border-red-200 bg-red-50' : 
                      installment.paid ? 'border-green-200 bg-green-50' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        Installment {installment.installmentNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(installment.dueDate).toLocaleDateString()}
                      </div>
                      {installment.paid && installment.paidDate && (
                        <div className="text-sm text-green-600">
                          Paid: {new Date(installment.paidDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {installment.paid 
                          ? formatCurrency(installment.paidAmount)
                          : formatCurrency(installment.expectedAmount)
                        }
                      </div>
                      {getInstallmentStatus(installment)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Deposit Amount:</span>
                  <span className="font-medium">{formatCurrency(schedule.depositAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Installment Amount:</span>
                  <span className="font-medium">{formatCurrency(schedule.installmentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Installments:</span>
                  <span className="font-medium">{schedule.numberOfInstallments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Frequency:</span>
                  <span className="font-medium">Every {schedule.installmentFrequencyDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span>First Payment:</span>
                  <span className="font-medium">
                    {new Date(schedule.firstInstallmentDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span>Final Payment:</span>
                  <span className="font-medium">
                    {new Date(schedule.finalPaymentDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full" asChild>
                  <Link href={`/orders/${orderId}/payment`}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make Payment
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {totalPaid}
                </div>
                <div className="text-sm text-muted-foreground">Payments Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {schedule.installments.filter(i => !i.paid && !i.overdue).length}
                </div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {schedule.installments.filter(i => i.overdue).length}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {totalPayments}
                </div>
                <div className="text-sm text-muted-foreground">Total Payments</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Next Payment Info */}
            {schedule.installments.some(i => !i.paid) && (
              <div className="mt-6 p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium mb-2">Next Payment Due</h4>
                {(() => {
                  const nextPayment = schedule.installments.find(i => !i.paid)
                  if (nextPayment) {
                    return (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Installment {nextPayment.installmentNumber} - {new Date(nextPayment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="font-bold text-lg">
                          {formatCurrency(nextPayment.expectedAmount)}
                        </div>
                        {nextPayment.overdue && (
                          <div className="text-sm text-red-600 mt-1">
                            This payment is overdue
                          </div>
                        )}
                      </div>
                    )
                  }
                  return <div className="text-sm text-green-600">All payments completed!</div>
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}