"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, isSameDay } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Invoice, Customer } from "@/lib/types"
import { generateId, getNextInvoiceNumber } from "@/lib/dummy-data"

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Please select a customer.",
  }),
  invoiceDate: z.date(),
  dueDate: z.date(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        productId: z.string(),
        productName: z.string(),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0.01),
        totalPrice: z.number(),
      }),
    )
    .min(1, { message: "At least one item is required" }),
})

type InvoiceFormValues = z.infer<typeof formSchema>

interface InvoiceFormProps {
  invoice?: Invoice
  items?: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
  onSuccess?: () => void
}

export function InvoiceForm({ invoice, items = [], onSuccess }: InvoiceFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    // Load customers
    const loadCustomers = () => {
      try {
        const savedCustomers = JSON.parse(localStorage.getItem("customers") || "[]") as Customer[]
        setCustomers(savedCustomers)
      } catch (error) {
        console.error("Error loading customers:", error)
        toast({
          title: "Error",
          description: "Failed to load customers.",
          variant: "destructive",
        })
      }
    }

    loadCustomers()
  }, [toast])

  // Prepare default form values
  const defaultValues: Partial<InvoiceFormValues> = {
    customerName: invoice?.customerId || "",
    invoiceDate: invoice ? new Date(invoice.date) : new Date(),
    dueDate: invoice ? new Date(invoice.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due date 7 days from now
    notes: invoice?.notes || "Net 7 payment terms",
    items:
      invoice?.items ||
      items.map((item) => ({
        id: item.id,
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
  }

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsSubmitting(true)

    try {
      // Calculate totals
      const subtotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0)
      const taxRate = 0.15 // 15% tax
      const taxAmount = subtotal * taxRate
      const total = subtotal + taxAmount

      // Get selected customer
      const selectedCustomer = customers.find((c) => c.id === data.customerName)
      if (!selectedCustomer) {
        throw new Error("Selected customer not found")
      }

      // Construct the invoice object
      const newInvoice: Invoice = {
        id: invoice?.id || generateId("inv"),
        invoiceNumber: invoice?.invoiceNumber || getNextInvoiceNumber(),
        date: data.invoiceDate.toISOString(),
        dueDate: data.dueDate.toISOString(),
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        items: data.items,
        subtotal,
        taxRate,
        taxAmount,
        discount: 0, // Could be added to the form
        total,
        notes: data.notes || "",
        status: "unpaid",
      }

      // Save the invoice
      const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]") as Invoice[]

      if (invoice) {
        // Update existing invoice
        const updatedInvoices = savedInvoices.map((inv) => (inv.id === invoice.id ? newInvoice : inv))
        localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
      } else {
        // Add new invoice
        localStorage.setItem("invoices", JSON.stringify([...savedInvoices, newInvoice]))
      }

      // Show success message
      toast({
        title: invoice ? "Invoice updated" : "Invoice created",
        description: `Invoice #${newInvoice.invoiceNumber} has been ${invoice ? "updated" : "created"} successfully.`,
      })

      // Call success callback or redirect
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/invoices/${newInvoice.id}`)
      }
    } catch (error) {
      console.error("Error saving invoice:", error)
      toast({
        title: "Error",
        description: `Failed to ${invoice ? "update" : "create"} invoice. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the customer for this invoice.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Invoice Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        disabled={isSubmitting}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>The date this invoice was issued.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        disabled={isSubmitting}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() && !isSameDay(date, new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>The date this invoice is due for payment.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any notes about this invoice"
                    className="resize-none"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>Additional information such as payment terms.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Display invoice items */}
        <div>
          <h3 className="font-medium mb-2">Invoice Items</h3>
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Unit Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {form.watch("items")?.map((item, index) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">${item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-medium">
                  <td colSpan={3} className="px-4 py-2 text-right">
                    Subtotal:
                  </td>
                  <td className="px-4 py-2 text-right">
                    $
                    {form
                      .watch("items")
                      ?.reduce((sum, item) => sum + item.totalPrice, 0)
                      .toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right">
                    Tax (15%):
                  </td>
                  <td className="px-4 py-2 text-right">
                    $
                    {(form.watch("items")?.reduce((sum, item) => sum + item.totalPrice, 0) * 0.15).toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={3} className="px-4 py-2 text-right">
                    Total:
                  </td>
                  <td className="px-4 py-2 text-right">
                    $
                    {(form.watch("items")?.reduce((sum, item) => sum + item.totalPrice, 0) * 1.15).toFixed(2) || "0.00"}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {invoice ? "Updating..." : "Creating..."}
              </>
            ) : invoice ? (
              "Update Invoice"
            ) : (
              "Create Invoice"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
