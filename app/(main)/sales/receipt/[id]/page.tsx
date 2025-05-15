"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Loader2, Printer } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import type { Sale } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { initializeDummyData } from "@/lib/dummy-data"

export default function ReceiptPage() {
  const params = useParams()
  const saleId = params.id as string
  const [sale, setSale] = useState<Sale | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData()

    // Fetch sale data
    const fetchSale = () => {
      setLoading(true)
      try {
        const savedSales = JSON.parse(localStorage.getItem("sales") || "[]") as Sale[]
        const foundSale = savedSales.find((s) => s.id === saleId)
        setSale(foundSale || null)
      } catch (error) {
        console.error("Error fetching sale:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSale()
  }, [saleId])

  const handlePrint = () => {
    setIsPrinting(true)

    setTimeout(() => {
      try {
        window.print()
        toast({
          title: "Print initiated",
          description: "The receipt has been sent to your printer.",
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
        // In a real app, this would generate a PDF
        // For this demo, we'll just simulate a download
        const receiptNumber = sale?.id.split("-")[1]
        const customerName = sale?.customerName.replace(/\s+/g, "_")
        const filename = `Receipt_${receiptNumber}_${customerName}.pdf`

        // Create a fake download
        const link = document.createElement("a")
        link.href = "#"
        link.setAttribute("download", filename)
        link.click()

        toast({
          title: "Receipt exported",
          description: `Receipt has been exported as ${filename}`,
        })
      } catch (error) {
        toast({
          title: "Export failed",
          description: "There was an error exporting the receipt.",
          variant: "destructive",
        })
      } finally {
        setIsExporting(false)
      }
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="mt-4">Loading receipt...</div>
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Link href="/sales">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Receipt Not Found</h1>
              <p className="text-muted-foreground">The requested receipt could not be found.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const saleDate = new Date(sale.date)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <Link href="/sales">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Receipt #{sale.id.split("-")[1]}</h1>
              <p className="text-muted-foreground">
                {saleDate.toLocaleDateString()} at {saleDate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
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

        <Card className="mx-auto max-w-3xl" ref={receiptRef}>
          <CardHeader className="text-center border-b pb-8">
            <CardTitle className="text-2xl">RoofStar POS</CardTitle>
            <p className="text-muted-foreground">123 Main Street, City, Country</p>
            <p className="text-muted-foreground">Tel: (123) 456-7890</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="font-semibold">Receipt To:</h3>
                <p>{sale.customerName}</p>
                <p>Customer ID: {sale.customerId || "Walk-in"}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold">Receipt Details:</h3>
                <p>Receipt #: {sale.id.split("-")[1]}</p>
                <p>Date: {saleDate.toLocaleDateString()}</p>
                <p>Time: {saleDate.toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3">{item.productName}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 text-right">${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${sale.subtotal.toFixed(2)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount:</span>
                  <span>-${sale.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax ({(sale.taxRate * 100).toFixed(0)}%):</span>
                <span>${sale.taxAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${sale.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Payment Method:</span>
                <span className="capitalize">{sale.paymentMethod}</span>
              </div>
            </div>

            {sale.notes && (
              <div className="mt-6 p-3 border rounded-md bg-muted/20">
                <h3 className="font-semibold mb-1">Notes:</h3>
                <p className="text-sm">{sale.notes}</p>
              </div>
            )}

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Thank you for your business!</p>
              <p>All sales are final. Returns accepted within 30 days with receipt.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-xs text-muted-foreground">Receipt generated by RoofStar POS System</p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
