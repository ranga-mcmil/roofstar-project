"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CreditCard, FileText, Loader2, Package, Plus, Search, Trash2, Tag, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { POSProductGrid } from "@/components/pos-product-grid"
import { Textarea } from "@/components/ui/textarea"
import type { Sale, SaleItem, Product, Invoice } from "@/lib/types"
import { ProductGridSkeleton } from "@/components/skeletons/product-grid-skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { generateId, getNextInvoiceNumber } from "@/lib/dummy-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample discount codes
const discountCodes = [
  { code: "WELCOME10", percentage: 10, description: "Welcome discount" },
  { code: "SUMMER25", percentage: 25, description: "Summer sale" },
  { code: "BULK15", percentage: 15, description: "Bulk purchase discount" },
  { code: "VIP20", percentage: 20, description: "VIP customer discount" },
  { code: "LOYALTY5", percentage: 5, description: "Loyalty program discount" },
]

// Create some sample invoices for testing if none exist
const createSampleInvoices = (): Invoice[] => {
  return [
    {
      id: "inv-1",
      invoiceNumber: "INV-001",
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      customerId: "cust-1",
      customerName: "John Doe Construction",
      items: [
        {
          id: "item-1",
          productId: "ibr-1",
          productName: "IBR 0.47mm - Charcoal",
          quantity: 5,
          unitPrice: 36.0,
          totalPrice: 180.0,
        },
      ],
      subtotal: 180.0,
      taxRate: 0.15,
      taxAmount: 27.0,
      discount: 0,
      total: 207.0,
      notes: "Net 7 payment terms",
      status: "unpaid",
    },
    {
      id: "inv-2",
      invoiceNumber: "INV-002",
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      customerId: "cust-2",
      customerName: "Smith Developments",
      items: [
        {
          id: "item-2",
          productId: "ibr-2",
          productName: "IBR 0.53mm - Galvanized",
          quantity: 10,
          unitPrice: 45.0,
          totalPrice: 450.0,
        },
        {
          id: "item-4",
          productId: "ibr-4",
          productName: "IBR 0.53mm - Galvanized 4",
          quantity: 10,
          unitPrice: 45.0,
          totalPrice: 450.0,
        },
      ],
      subtotal: 900.0,
      taxRate: 0.15,
      taxAmount: 127.5,
      discount: 90.0,
      total: 937.5,
      notes: "Net 7 payment terms",
      status: "unpaid",
    },
    {
      id: "inv-3",
      invoiceNumber: "INV-003",
      date: new Date(Date.now() - 86400000 * 10).toISOString(),
      dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      customerId: "cust-3",
      customerName: "Johnson & Miller",
      items: [
        {
          id: "item-3",
          productId: "ibr-1",
          productName: "IBR 0.47mm - Charcoal",
          quantity: 8,
          unitPrice: 36.0,
          totalPrice: 288.0,
        },
      ],
      subtotal: 288.0,
      taxRate: 0.15,
      taxAmount: 43.2,
      discount: 0,
      total: 331.2,
      notes: "Net 7 payment terms",
      status: "overdue",
    },
  ]
}

export default function POSPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [productsLoading, setProductsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("")
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [transactionType, setTransactionType] = useState<"sale" | "invoice">("sale")

  // Cart items state
  const [cartItems, setCartItems] = useState([
    {
      id: "ibr-1",
      name: "IBR 0.47mm - Charcoal",
      price: 36.0,
      quantity: 10,
    },
    {
      id: "ibr-2",
      name: "IBR 0.53mm - Galvanized",
      price: 45.0,
      quantity: 5,
    },
  ])

  const [referrer, setReferrer] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "">("")
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string
    percentage: number
    description: string
  } | null>(null)
  const [notes, setNotes] = useState("")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [hasSampleInvoices, setHasSampleInvoices] = useState(false)
  const [taxRate, setTaxRate] = useState(0.15) // 15% tax

  useEffect(() => {
    // Simulate loading delay for products
    const timer = setTimeout(() => {
      setProductsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Load invoices
    let savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]") as Invoice[]

    // If no invoices exist, create sample ones for testing
    if (savedInvoices.length === 0) {
      savedInvoices = createSampleInvoices()
      localStorage.setItem("invoices", JSON.stringify(savedInvoices))
      setHasSampleInvoices(true)
    } else {
      setHasSampleInvoices(false)
    }

    setInvoices(savedInvoices)
    setFilteredInvoices(savedInvoices.filter((inv) => inv.status === "unpaid" || inv.status === "overdue"))
  }, [hasSampleInvoices])

  // Filter invoices based on search query
  useEffect(() => {
    if (!invoices.length) return

    const unpaidInvoices = invoices.filter((inv) => inv.status === "unpaid" || inv.status === "overdue")

    if (!invoiceSearchQuery) {
      setFilteredInvoices(unpaidInvoices)
      return
    }

    const query = invoiceSearchQuery.toLowerCase()
    const filtered = unpaidInvoices.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(query) || invoice.customerName.toLowerCase().includes(query),
    )

    setFilteredInvoices(filtered)
  }, [invoiceSearchQuery, invoices])

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = appliedDiscount ? (appliedDiscount.percentage / 100) * subtotal : 0
  const taxAmount = (subtotal - discountAmount) * taxRate
  const total = subtotal - discountAmount + taxAmount

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
    setSelectedInvoice(null)
    setDiscountCode("")
    setAppliedDiscount(null)
    setNotes("")
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const handleAddToCart = (product: Product) => {
    // If we have a selected invoice, clear it since we're modifying the cart
    if (selectedInvoice) {
      setSelectedInvoice(null)
      toast({
        title: "Invoice reference removed",
        description: "The invoice reference has been removed because you modified the cart.",
      })
    }

    // Check if the product is already in the cart
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      // If it exists, increase the quantity
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      // Otherwise, add it as a new item
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ])
    }

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleInvoiceSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceSearchQuery(e.target.value)
  }

  const handleSelectInvoice = (invoice: Invoice) => {
    console.log("Invoice selected:", invoice)

    // Populate cart with invoice items
    const invoiceCartItems = invoice.items.map((item) => ({
      id: item.productId,
      name: item.productName,
      price: item.unitPrice,
      quantity: item.quantity,
    }))

    // Update state with all invoice details
    setSelectedInvoice(invoice)
    setCartItems(invoiceCartItems)
    setReferrer(invoice.customerId)
    setCustomerName(invoice.customerName)

    // Calculate and set discount code if applicable
    if (invoice.discount > 0) {
      const discountPercentage = (invoice.discount / invoice.subtotal) * 100
      // Find a matching discount code or use a generic one
      const matchingDiscount = discountCodes.find((d) => Math.abs(d.percentage - discountPercentage) < 0.1)
      if (matchingDiscount) {
        setDiscountCode(matchingDiscount.code)
        setAppliedDiscount(matchingDiscount)
      } else {
        // Create a custom discount for this invoice
        const customDiscount = {
          code: `INVOICE${invoice.invoiceNumber.replace(/\D/g, "")}`,
          percentage: discountPercentage,
          description: "Invoice specific discount",
        }
        setDiscountCode(customDiscount.code)
        setAppliedDiscount(customDiscount)
      }
    } else {
      setDiscountCode("")
      setAppliedDiscount(null)
    }

    setNotes(`Payment for Invoice #${invoice.invoiceNumber}`)
    setTransactionType("sale") // Set to sale mode when referencing an invoice
    setTaxRate(invoice.taxRate) // Use the invoice's tax rate

    // Close the dialog
    setInvoiceDialogOpen(false)

    // Show toast notification
    toast({
      title: "Invoice loaded",
      description: `Invoice #${invoice.invoiceNumber} for $${invoice.total.toFixed(2)} has been loaded.`,
    })
  }

  const handleClearInvoiceReference = () => {
    setSelectedInvoice(null)
    setNotes("")
    toast({
      title: "Invoice reference removed",
      description: "The invoice reference has been removed.",
    })
  }

  const handleApplyDiscountCode = () => {
    if (!discountCode.trim()) {
      setAppliedDiscount(null)
      return
    }

    const foundDiscount = discountCodes.find((discount) => discount.code.toLowerCase() === discountCode.toLowerCase())

    if (foundDiscount) {
      setAppliedDiscount(foundDiscount)
      toast({
        title: "Discount applied",
        description: `${foundDiscount.description} (${foundDiscount.percentage}% off) has been applied.`,
      })
    } else {
      setAppliedDiscount(null)
      toast({
        title: "Invalid discount code",
        description: "The discount code you entered is not valid.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateInvoice = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add items to the cart before generating an invoice.",
        variant: "destructive",
      })
      return
    }

    if (!referrer) {
      toast({
        title: "No referrer selected",
        description: "Please select a referrer before generating an invoice.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingInvoice(true)

    try {
      // Create invoice items
      const invoiceItems: SaleItem[] = cartItems.map((item) => ({
        id: generateId("item"),
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      }))

      const selectedReferrer = referrers.find((r) => r.id === referrer)

      // Create invoice object
      const invoice: Invoice = {
        id: generateId("inv"),
        invoiceNumber: getNextInvoiceNumber(),
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), // Due in 7 days
        customerId: referrer,
        customerName: customerName || selectedReferrer?.name || "Unknown Referrer",
        items: invoiceItems,
        subtotal,
        taxRate,
        taxAmount,
        discount: discountAmount,
        total,
        notes: notes || "Net 7 payment terms",
        status: "unpaid",
      }

      // In a real app, this would be an API call to save the invoice
      console.log("Saving invoice:", invoice)

      // For demo purposes, let's save to localStorage
      const existingInvoices = JSON.parse(localStorage.getItem("invoices") || "[]") as Invoice[]
      localStorage.setItem("invoices", JSON.stringify([...existingInvoices, invoice]))

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Invoice generated",
        description: `Invoice #${invoice.invoiceNumber} for $${total.toFixed(2)} has been generated.`,
      })

      // Navigate to invoice page
      router.push(`/invoices/${invoice.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add items to the cart before completing the sale.",
        variant: "destructive",
      })
      return
    }

    if (transactionType === "sale" && !paymentMethod) {
      toast({
        title: "No payment method selected",
        description: "Please select a payment method before completing the sale.",
        variant: "destructive",
      })
      return
    }

    if (!referrer) {
      toast({
        title: "No referrer selected",
        description: "Please select a referrer before completing the transaction.",
        variant: "destructive",
      })
      return
    }

    if (transactionType === "invoice") {
      // If we're in invoice mode, just call the invoice generation function
      handleGenerateInvoice()
      return
    }

    setIsLoading(true)

    try {
      // Create sale object
      const saleItems: SaleItem[] = cartItems.map((item) => ({
        id: generateId("item"),
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      }))

      const selectedReferrer = referrers.find((r) => r.id === referrer)

      const sale: Sale = {
        id: generateId("sale"),
        date: new Date().toISOString(),
        customerId: referrer,
        customerName: customerName || selectedReferrer?.name || "Walk-in Customer",
        items: saleItems,
        subtotal,
        taxRate,
        taxAmount,
        discount: discountAmount,
        total,
        paymentMethod,
        notes: appliedDiscount
          ? `${notes} (Discount: ${appliedDiscount.code} - ${appliedDiscount.description})`
          : notes,
        status: "completed",
        invoiceId: selectedInvoice?.id,
      }

      // If this sale is paying an invoice, update the invoice status
      if (selectedInvoice) {
        const updatedInvoices = invoices.map((inv) =>
          inv.id === selectedInvoice.id
            ? { ...inv, status: "paid", paymentDate: new Date().toISOString(), saleId: sale.id }
            : inv,
        )
        localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
      }

      // In a real app, this would be an API call to save the sale
      console.log("Saving sale:", sale)

      // For demo purposes, let's save to localStorage
      const existingSales = JSON.parse(localStorage.getItem("sales") || "[]")
      localStorage.setItem("sales", JSON.stringify([...existingSales, sale]))

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Sale completed",
        description: `Sale #${sale.id.split("-")[1]} for $${total.toFixed(2)} has been processed.`,
      })

      // Navigate to receipt page
      router.push(`/sales/receipt/${sale.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process sale. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mock referrer data
  const referrers = [
    { id: "cust-1", name: "John Doe Construction" },
    { id: "cust-2", name: "Smith Developments" },
    { id: "cust-3", name: "Johnson & Miller" },
    { id: "cust-4", name: "Williams Roofing" },
    { id: "cust-5", name: "Brown Brothers Construction" },
  ]

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <main className="flex flex-1 h-full">
        {/* Products Section - Left Side */}
        <div className="flex-1 border-r flex flex-col h-full">
          {/* Fixed Header */}
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Point of Sale</h1>
                <p className="text-muted-foreground">Process sales and manage transactions</p>
              </div>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={productsLoading}
              />
            </div>
          </div>

          {/* Tabs and Scrollable Products */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="all" className="flex flex-col h-full">
              <div className="px-4 md:px-6 pt-2">
                <TabsList className="mb-2">
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="ibr">IBR Sheets</TabsTrigger>
                  <TabsTrigger value="accessories">Accessories</TabsTrigger>
                  <TabsTrigger value="fasteners">Fasteners</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4">
                <TabsContent value="all" className="mt-0 h-full">
                  {productsLoading ? (
                    <ProductGridSkeleton count={8} />
                  ) : (
                    <POSProductGrid
                      onAddToCart={handleAddToCart}
                      searchQuery={searchQuery}
                      disableAddToCart={!!selectedInvoice}
                    />
                  )}
                </TabsContent>
                <TabsContent value="ibr" className="mt-0 h-full">
                  {productsLoading ? (
                    <ProductGridSkeleton count={6} />
                  ) : (
                    <POSProductGrid
                      category="ibr"
                      onAddToCart={handleAddToCart}
                      searchQuery={searchQuery}
                      disableAddToCart={!!selectedInvoice}
                    />
                  )}
                </TabsContent>
                <TabsContent value="accessories" className="mt-0 h-full">
                  {productsLoading ? (
                    <ProductGridSkeleton count={4} />
                  ) : (
                    <POSProductGrid
                      category="accessories"
                      onAddToCart={handleAddToCart}
                      searchQuery={searchQuery}
                      disableAddToCart={!!selectedInvoice}
                    />
                  )}
                </TabsContent>
                <TabsContent value="fasteners" className="mt-0 h-full">
                  {productsLoading ? (
                    <ProductGridSkeleton count={2} />
                  ) : (
                    <POSProductGrid
                      category="fasteners"
                      onAddToCart={handleAddToCart}
                      searchQuery={searchQuery}
                      disableAddToCart={!!selectedInvoice}
                    />
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Cart Section - Right Side */}
        <div className="w-full md:w-[400px] lg:w-[450px] border-t md:border-t-0 flex flex-col h-full">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Fixed Cart Header */}
            <div className="p-4 md:p-6 border-b">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Current Sale</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={clearCart}
                  disabled={cartItems.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              </div>

              {/* Invoice Reference Section */}
              {selectedInvoice ? (
                <div className="mt-2">
                  <Alert className="bg-muted">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="flex items-center gap-2">
                      Referenced Invoice
                      <Badge variant="outline" className="ml-1">
                        {selectedInvoice.invoiceNumber}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="mt-2 text-xs">
                      <div className="flex justify-between mb-1">
                        <span>Customer:</span>
                        <span className="font-medium">{selectedInvoice.customerName}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Due Date:</span>
                        <span className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium">${selectedInvoice.total.toFixed(2)}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 h-8 text-xs"
                        onClick={handleClearInvoiceReference}
                      >
                        Remove Reference
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  disabled={isLoading || isGeneratingInvoice}
                  onClick={() => setInvoiceDialogOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Reference Invoice
                </Button>
              )}

              <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Select Invoice</DialogTitle>
                    <DialogDescription>Select an unpaid invoice to reference for this sale.</DialogDescription>
                  </DialogHeader>

                  <div className="relative mb-4 mt-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by invoice number or customer name..."
                      className="pl-8 w-full"
                      value={invoiceSearchQuery}
                      onChange={handleInvoiceSearchChange}
                      autoFocus
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto border rounded-md">
                    {filteredInvoices.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                        <FileText className="h-8 w-8 mb-2 opacity-50" />
                        {invoiceSearchQuery ? "No matching invoices found" : "No unpaid invoices found"}
                        {invoiceSearchQuery && (
                          <Button variant="link" onClick={() => setInvoiceSearchQuery("")} className="mt-2">
                            Clear search
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="divide-y">
                        <div className="grid grid-cols-12 gap-2 p-3 bg-muted font-medium text-sm">
                          <div className="col-span-3">Invoice #</div>
                          <div className="col-span-4">Customer</div>
                          <div className="col-span-2 text-right">Amount</div>
                          <div className="col-span-3 text-right">Due Date</div>
                        </div>
                        {filteredInvoices.map((invoice) => (
                          <div key={invoice.id} className="w-full">
                            <Button
                              type="button"
                              variant="ghost"
                              className="grid grid-cols-12 gap-2 p-3 hover:bg-muted cursor-pointer items-center w-full text-left h-auto font-normal rounded-none"
                              onClick={() => {
                                console.log("Invoice clicked:", invoice.id)
                                // Force close the dialog first
                                setInvoiceDialogOpen(false)

                                // Use setTimeout to ensure the dialog is closed before processing
                                setTimeout(() => {
                                  handleSelectInvoice(invoice)
                                }, 100)
                              }}
                            >
                              <div className="col-span-3 font-medium">{invoice.invoiceNumber}</div>
                              <div className="col-span-4 truncate">{invoice.customerName}</div>
                              <div className="col-span-2 text-right font-medium">${invoice.total.toFixed(2)}</div>
                              <div className="col-span-3 text-right text-muted-foreground">
                                {new Date(invoice.dueDate).toLocaleDateString()}
                              </div>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <DialogFooter className="mt-4">
                    <div className="text-sm text-muted-foreground mr-auto">
                      {filteredInvoices.length} {filteredInvoices.length === 1 ? "invoice" : "invoices"} found
                    </div>
                    <Button type="button" variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Scrollable Cart Items */}
            <div className="p-4 md:px-6 overflow-y-auto flex-1 flex flex-col">
              <Card className="mb-4">
                <CardContent className="p-4 max-h-[40vh] overflow-y-auto">
                  <div className="space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">No items in cart</div>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between pb-4 border-b last:border-b-0 last:pb-0"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              type="button"
                              disabled={!!selectedInvoice}
                            >
                              -<span className="sr-only">Decrease</span>
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="h-8 w-16 text-center"
                              disabled={!!selectedInvoice}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              type="button"
                              disabled={!!selectedInvoice}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground"
                              onClick={() => removeItem(item.id)}
                              type="button"
                              disabled={!!selectedInvoice}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Discount ({appliedDiscount.percentage}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountCode">Discount Code</Label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <Input
                          id="discountCode"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Enter discount code"
                          disabled={!!selectedInvoice}
                          className={appliedDiscount ? "pr-10 border-green-500 focus-visible:ring-green-500" : ""}
                        />
                        {appliedDiscount && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Check className="h-4 w-4" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {appliedDiscount.description} ({appliedDiscount.percentage}% off)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyDiscountCode}
                        disabled={!!selectedInvoice || !discountCode.trim()}
                        className="shrink-0"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    </div>
                    {appliedDiscount && (
                      <p className="text-xs text-green-600 mt-1">
                        {appliedDiscount.description} ({appliedDiscount.percentage}% off)
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      disabled={!!selectedInvoice}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referrer">Referrer</Label>
                    <Select value={referrer} onValueChange={setReferrer} disabled={!!selectedInvoice}>
                      <SelectTrigger id="referrer">
                        <SelectValue placeholder="Select referrer" />
                      </SelectTrigger>
                      <SelectContent>
                        {referrers.map((referrerItem) => (
                          <SelectItem key={referrerItem.id} value={referrerItem.id}>
                            {referrerItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this sale"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      className={`w-full gap-2 ${transactionType === "sale" ? "" : "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"}`}
                      variant={transactionType === "sale" ? "default" : "outline"}
                      onClick={() => setTransactionType("sale")}
                      disabled={!!selectedInvoice}
                    >
                      <Package className="h-4 w-4" />
                      Sale
                    </Button>
                    <Button
                      type="button"
                      className={`w-full gap-2 ${transactionType === "invoice" ? "" : "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"}`}
                      variant={transactionType === "invoice" ? "default" : "outline"}
                      onClick={() => setTransactionType("invoice")}
                      disabled={!!selectedInvoice}
                    >
                      <FileText className="h-4 w-4" />
                      Invoice
                    </Button>
                  </div>
                </div>

                {transactionType === "sale" && (
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        className={`w-full gap-2 ${paymentMethod === "card" ? "" : "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"}`}
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <CreditCard className="h-4 w-4" />
                        Card
                      </Button>
                      <Button
                        type="button"
                        className={`w-full gap-2 ${paymentMethod === "cash" ? "" : "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"}`}
                        variant={paymentMethod === "cash" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <Package className="h-4 w-4" />
                        Cash
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-4 md:p-6 border-t mt-auto">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading ||
                  isGeneratingInvoice ||
                  cartItems.length === 0 ||
                  !referrer ||
                  (transactionType === "sale" && !paymentMethod)
                }
              >
                {isLoading || isGeneratingInvoice ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {transactionType === "invoice" ? "Generating..." : "Processing..."}
                  </>
                ) : selectedInvoice ? (
                  "Process Invoice Payment"
                ) : transactionType === "invoice" ? (
                  "Generate Invoice"
                ) : (
                  "Complete Sale"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
