"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CreditCard, FileText, Loader2, Package, Plus, Search, Trash2, Tag, Check, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import your actions
import { getProductsAction } from "@/actions/products"
import { getCustomersAction, createCustomerAction } from "@/actions/customers"
import { getBranchesAction } from "@/actions/branches"
import { getCategoriesAction } from "@/actions/categories"
import { 
  createQuotationAction, 
  createLayawayAction, 
  createImmediateSaleAction, 
  createFutureCollectionAction 
} from "@/actions/orders"

// Import types
import { ProductDTO } from "@/lib/http-service/products/types"
import { CustomerDTO } from "@/lib/http-service/customers/types"
import { BranchDTO } from "@/lib/http-service/branches/types"
import { ProductCategoryDTO } from "@/lib/http-service/categories/types"
import { OrderType, PaymentMethod } from "@/lib/http-service/orders/types"
import { USER_ROLES } from "@/lib/types"

// Enhanced cart item type
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  length: number
  width: number
  discount: number
  notes?: string
}

// Customer creation form component
interface QuickCustomerFormProps {
  onCustomerCreated: (customer: CustomerDTO) => void
  onCancel: () => void
}

function QuickCustomerForm({ onCustomerCreated, onCancel }: QuickCustomerFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    tin: '',
    vatNumber: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value)
      })

      const response = await createCustomerAction(submitData)

      if (response.success) {
        toast({
          title: "Customer created",
          description: `${formData.firstName} ${formData.lastName} has been added.`,
        })
        onCustomerCreated(response.data!)
      } else {
        toast({
          title: "Error creating customer",
          description: response.error || "Failed to create customer",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Customer'
          )}
        </Button>
      </div>
    </form>
  )
}

// Enhanced product grid component
interface ProductGridProps {
  products: ProductDTO[]
  category?: string
  searchQuery: string
  onAddToCart: (product: ProductDTO) => void
  isLoading: boolean
  currentUserBranch?: string
}

function ProductGrid({ products, category, searchQuery, onAddToCart, isLoading, currentUserBranch }: ProductGridProps) {
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({})

  // Filter products - only show products from user's branch for non-admin users
  const filteredProducts = products.filter((product) => {
    // Filter by branch if user has a specific branch (Manager/Sales Rep)
    if (currentUserBranch && product.branchId !== currentUserBranch) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        product.name.toLowerCase().includes(query) ||
        product.code.toString().includes(query) ||
        product.colorName.toLowerCase().includes(query) ||
        product.productCategoryName.toLowerCase().includes(query)
      )
    }
    return true
  })

  const handleAddToCart = (product: ProductDTO) => {
    setAddedToCart(prev => ({ ...prev, [product.id]: true }))
    onAddToCart(product)

    // Reset button state after delay
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }))
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[2/1] relative bg-muted">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-5 w-16" />
            </CardContent>
            <div className="p-4 pt-0">
              <Skeleton className="h-9 w-full" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          {currentUserBranch ? 
            "No products available for your branch. Try adjusting your search." :
            "No products found. Try adjusting your search."
          }
        </div>
      ) : (
        filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-[2/1] relative bg-muted flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-sm">{product.name}</h3>
              <div className="mt-1 text-xs text-muted-foreground">
                {product.thickness}mm • {product.colorName}
              </div>
              <div className="mt-2 font-bold">${product.price.toFixed(2)}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Stock: {product.stockQuantity || 0}
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button
                onClick={() => handleAddToCart(product)}
                variant="default"
                className="w-full"
                disabled={addedToCart[product.id] || !product.isActive || (product.stockQuantity || 0) === 0}
              >
                {addedToCart[product.id] ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Added
                  </>
                ) : !product.isActive ? (
                  "Inactive"
                ) : (product.stockQuantity || 0) === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

export default function POSPage() {
  // Session management
  const { data: session, status } = useSession()
  const sessionLoading = status === "loading"

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(true)
  const [customersLoading, setCustomersLoading] = useState(true)
  const [branchesLoading, setBranchesLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Data states
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [customers, setCustomers] = useState<CustomerDTO[]>([])
  const [branches, setBranches] = useState<BranchDTO[]>([])
  const [categories, setCategories] = useState<ProductCategoryDTO[]>([])

  // UI states
  const [searchQuery, setSearchQuery] = useState("")
  const [showCustomerForm, setShowCustomerForm] = useState(false)

  // Cart and form states
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [orderType, setOrderType] = useState<OrderType>("IMMEDIATE_SALE")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")
  const [notes, setNotes] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [expectedCollectionDate, setExpectedCollectionDate] = useState("")

  const { toast } = useToast()
  const router = useRouter()

  // Get user's role and branch
  const userRole = session?.user?.role
  const userBranch = session?.user?.branchId
  const isAdmin = userRole === USER_ROLES.ADMIN

  // Load initial data
  useEffect(() => {
    // Don't load data until session is ready
    if (sessionLoading) return

    const loadData = async () => {
      try {
        // Load products - filter by branch for non-admin users
        const productParams = isAdmin ? 
          { pageNo: 0, pageSize: 100 } : 
          { pageNo: 0, pageSize: 100 }

        const [productsRes, customersRes, branchesRes, categoriesRes] = await Promise.all([
          userBranch ? 
            getProductsAction(productParams) : // For branch-specific users, we'll filter on client side
            getProductsAction(productParams),
          getCustomersAction({ pageNo: 0, pageSize: 100 }),
          getBranchesAction({ pageNo: 0, pageSize: 50 }),
          getCategoriesAction()
        ])

        if (productsRes.success) {
          setProducts(productsRes.data.content)
        }
        if (customersRes.success) {
          setCustomers(customersRes.data.content)
        }
        if (branchesRes.success) {
          const activeBranches = branchesRes.data.content.filter(b => b.isActive)
          
          // For admin, show all branches. For others, filter to their branch
          if (isAdmin) {
            setBranches(activeBranches)
            // Auto-select first branch for admin
            if (activeBranches.length > 0) {
              setSelectedBranch(activeBranches[0].id)
            }
          } else if (userBranch) {
            // For Manager/Sales Rep, only show their branch
            const userBranchData = activeBranches.find(b => b.id === userBranch)
            if (userBranchData) {
              setBranches([userBranchData])
              setSelectedBranch(userBranch)
            }
          } else {
            setBranches(activeBranches)
          }
        }
        if (categoriesRes.success) {
          setCategories(categoriesRes.data)
        }

        setDataLoaded(true)
      } catch (error) {
        toast({
          title: "Error loading data",
          description: "Failed to load POS data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setProductsLoading(false)
        setCustomersLoading(false)
        setBranchesLoading(false)
      }
    }

    loadData()
  }, [toast, sessionLoading, isAdmin, userBranch])

  // Show loading if session is still loading
  if (sessionLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading POS...</p>
        </div>
      </div>
    )
  }

  // Show error if no session
  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to access the Point of Sale system.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (userRole !== USER_ROLES.SALES_REP) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            The Point of Sale system is only available to Sales Representatives.
            {userRole === USER_ROLES.ADMIN && " As an Admin, please use the main dashboard to manage the system."}
            {userRole === USER_ROLES.MANAGER && " As a Manager, please use the reports and management sections."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Cart operations
  const addToCart = (product: ProductDTO) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      setCartItems(items => 
        items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        length: 1,
        width: 1,
        discount: 0,
        notes: ""
      }
      setCartItems(items => [...items, newItem])
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const updateDimensions = (id: number, length: number, width: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, length, width } : item
      )
    )
  }

  const updateDiscount = (id: number, discount: number) => {
    if (discount < 0 || discount > 100) return
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, discount } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
    setSelectedCustomer("")
    setNotes("")
    setPaymentAmount("")
    setExpectedCollectionDate("")
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const area = item.length * item.width
    const lineTotal = item.price * item.quantity * area
    const discountAmount = (item.discount / 100) * lineTotal
    return sum + (lineTotal - discountAmount)
  }, 0)
  
  const taxRate = 0.15
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  // Handle customer creation
  const handleCustomerCreated = (customer: CustomerDTO) => {
    setCustomers(prev => [...prev, customer])
    setSelectedCustomer(customer.id.toString())
    setShowCustomerForm(false)
  }

  // Handle order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add items to the cart before creating an order.",
        variant: "destructive",
      })
      return
    }

    if (!selectedCustomer) {
      toast({
        title: "No customer selected",
        description: "Please select a customer before creating an order.",
        variant: "destructive",
      })
      return
    }

    if (!selectedBranch) {
      toast({
        title: "No branch selected",
        description: "Please select a branch before creating an order.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        length: item.length,
        width: item.width,
        unitPrice: item.price,
        discount: item.discount,
        notes: item.notes || "",
        area: item.length * item.width,
        lineTotalBeforeDiscount: item.price * item.quantity * item.length * item.width
      }))

      const customerId = parseInt(selectedCustomer)
      const formData = new FormData()
      
      // Add order items
      formData.append('orderItems', JSON.stringify(orderItems))
      formData.append('notes', notes)

      let response

      switch (orderType) {
        case "QUOTATION":
          response = await createQuotationAction(formData, customerId, selectedBranch)
          break
        case "IMMEDIATE_SALE":
          if (!paymentAmount || !paymentMethod) {
            throw new Error("Payment amount and method are required for immediate sales")
          }
          formData.append('paymentAmount', paymentAmount)
          formData.append('paymentMethod', paymentMethod)
          response = await createImmediateSaleAction(formData, customerId, selectedBranch)
          break
        case "FUTURE_COLLECTION":
          if (!paymentAmount || !paymentMethod || !expectedCollectionDate) {
            throw new Error("Payment details and collection date are required")
          }
          formData.append('paymentAmount', paymentAmount)
          formData.append('paymentMethod', paymentMethod)
          formData.append('expectedCollectionDate', expectedCollectionDate)
          response = await createFutureCollectionAction(formData, customerId, selectedBranch)
          break
        case "LAYAWAY":
          // For layaway, you'd need additional form fields for the layaway plan
          toast({
            title: "Feature not implemented",
            description: "Layaway orders require additional configuration.",
            variant: "destructive",
          })
          return
        default:
          throw new Error("Invalid order type")
      }

      if (response.success) {
        toast({
          title: "Order created successfully",
          description: `${orderType.replace('_', ' ').toLowerCase()} order has been created.`,
        })

        // Clear the cart and redirect
        clearCart()
        router.push(`/orders/${response.data.id}`)
      } else {
        throw new Error(response.error || "Failed to create order")
      }
    } catch (error: any) {
      toast({
        title: "Error creating order",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
                <p className="text-muted-foreground">
                  Create orders and process transactions
                  {userBranch && !isAdmin && (
                    <span className="ml-2">
                      • Branch: {branches.find(b => b.id === userBranch)?.name}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={productsLoading}
              />
            </div>
          </div>

          {/* Scrollable Products */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4">
            <Tabs defaultValue="all" className="h-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Products</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.name.toLowerCase()}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <ProductGrid
                  products={products}
                  searchQuery={searchQuery}
                  onAddToCart={addToCart}
                  isLoading={productsLoading}
                  currentUserBranch={!isAdmin ? userBranch : undefined}
                />
              </TabsContent>

              {categories.map(category => (
                <TabsContent key={category.id} value={category.name.toLowerCase()} className="mt-0">
                  <ProductGrid
                    products={products.filter(p => p.productCategoryName === category.name)}
                    searchQuery={searchQuery}
                    onAddToCart={addToCart}
                    isLoading={productsLoading}
                    currentUserBranch={!isAdmin ? userBranch : undefined}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Cart Section - Right Side */}
        <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col h-full">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Fixed Cart Header */}
            <div className="p-4 md:p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Current Order</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  disabled={cartItems.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>

              {/* Order Type Selection */}
              <div className="mb-4">
                <Label>Order Type</Label>
                <Select value={orderType} onValueChange={(value: OrderType) => setOrderType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QUOTATION">Quotation</SelectItem>
                    <SelectItem value="IMMEDIATE_SALE">Immediate Sale</SelectItem>
                    <SelectItem value="FUTURE_COLLECTION">Future Collection</SelectItem>
                    <SelectItem value="LAYAWAY">Layaway</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Scrollable Cart Content */}
            <div className="flex-1 overflow-y-auto p-4 md:px-6">
              {/* Cart Items */}
              <Card className="mb-4">
                <CardContent className="p-4 max-h-[30vh] overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No items in cart
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <div className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} per unit
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeItem(item.id)}
                              type="button"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs">Qty</Label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="h-8 text-center"
                                min="1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Length (m)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={item.length}
                                onChange={(e) => updateDimensions(item.id, parseFloat(e.target.value) || 1, item.width)}
                                className="h-8 text-center"
                                min="0.1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Width (m)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={item.width}
                                onChange={(e) => updateDimensions(item.id, item.length, parseFloat(e.target.value) || 1)}
                                className="h-8 text-center"
                                min="0.1"
                              />
                            </div>
                          </div>

                          <div className="mt-2">
                            <Label className="text-xs">Discount (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={item.discount}
                              onChange={(e) => updateDiscount(item.id, parseFloat(e.target.value) || 0)}
                              className="h-8 text-center"
                              min="0"
                              max="100"
                            />
                          </div>
                          
                          <div className="mt-2 text-right">
                            <div className="text-sm text-muted-foreground">
                              Area: {(item.length * item.width).toFixed(2)} m²
                            </div>
                            {item.discount > 0 && (
                              <div className="text-xs text-muted-foreground line-through">
                                ${(item.price * item.quantity * item.length * item.width).toFixed(2)}
                              </div>
                            )}
                            <div className="font-medium">
                              ${((item.price * item.quantity * item.length * item.width) * (1 - item.discount / 100)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Details Form */}
              <div className="space-y-4">
                {/* Customer Selection */}
                <div>
                  <Label>Customer *</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer} disabled={customersLoading}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={customersLoading ? "Loading customers..." : "Select customer"} />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.firstName} {customer.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowCustomerForm(true)}
                      disabled={customersLoading}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Branch Selection - Show only if admin or multiple branches available */}
                {(isAdmin || branches.length > 1) && (
                  <div>
                    <Label>Branch *</Label>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch} disabled={branchesLoading || (!isAdmin && branches.length === 1)}>
                      <SelectTrigger>
                        <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select branch"} />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name} - {branch.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Payment Details (for non-quotation orders) */}
                {orderType !== "QUOTATION" && (
                  <>
                    <div>
                      <Label>Payment Amount *</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="Enter payment amount"
                          required
                          className="flex-1"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPaymentAmount(total.toFixed(2))}
                              >
                                Full
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Set to full amount (${total.toFixed(2)})</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div>
                      <Label>Payment Method *</Label>
                      <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="CARD">Card</SelectItem>
                          <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                          <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Collection Date (for future collection) */}
                {orderType === "FUTURE_COLLECTION" && (
                  <div>
                    <Label>Expected Collection Date *</Label>
                    <Input
                      type="date"
                      value={expectedCollectionDate}
                      onChange={(e) => setExpectedCollectionDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this order"
                    rows={2}
                  />
                </div>

                {/* Order Summary */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  {/* Payment amount validation for immediate sales */}
                  {orderType === "IMMEDIATE_SALE" && paymentAmount && (
                    <div className="mt-2">
                      {parseFloat(paymentAmount) < total ? (
                        <div className="text-sm text-red-600">
                          Insufficient payment amount. ${(total - parseFloat(paymentAmount)).toFixed(2)} remaining.
                        </div>
                      ) : parseFloat(paymentAmount) > total ? (
                        <div className="text-sm text-green-600">
                          Change: ${(parseFloat(paymentAmount) - total).toFixed(2)}
                        </div>
                      ) : (
                        <div className="text-sm text-green-600">
                          Exact payment amount
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-4 md:p-6 border-t mt-auto">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading ||
                  cartItems.length === 0 ||
                  !selectedCustomer ||
                  !selectedBranch ||
                  !dataLoaded ||
                  (orderType !== "QUOTATION" && (!paymentAmount || !paymentMethod)) ||
                  (orderType === "FUTURE_COLLECTION" && !expectedCollectionDate) ||
                  (orderType === "IMMEDIATE_SALE" && parseFloat(paymentAmount || "0") < total)
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  `Create ${orderType.replace('_', ' ')}`
                )}
              </Button>
              
              {/* Show validation messages */}
              {cartItems.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Add items to cart to create an order
                </p>
              )}
              {orderType === "IMMEDIATE_SALE" && paymentAmount && parseFloat(paymentAmount) < total && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  Payment amount must be at least ${total.toFixed(2)}
                </p>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Customer Creation Dialog */}
      <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to the system for this order.
            </DialogDescription>
          </DialogHeader>
          <QuickCustomerForm
            onCustomerCreated={handleCustomerCreated}
            onCancel={() => setShowCustomerForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
                              