export interface Referrer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "inactive"
}

export interface Product {
  id: string
  name: string
  sku: string
  price: number
  category: string
  color: string
  gauge: string
  length: number
}

export interface SaleItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Sale {
  id: string
  date: string
  customerId: string
  customerName: string
  items: SaleItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  paymentMethod: "cash" | "card" | ""
  notes: string
  status: "completed" | "refunded" | "cancelled"
  invoiceId?: string // Reference to an invoice if this sale is linked to one
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  customerId: string
  customerName: string
  items: SaleItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  notes: string
  status: "paid" | "unpaid" | "overdue" | "cancelled"
  paymentDate?: string
  saleId?: string // Reference to a sale if this invoice has been paid
}

export type UserRole = "admin" | "store_manager" | "sales_rep"

export interface Warehouse {
  id: string
  name: string
  location: string
  status: "active" | "inactive"
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: "active" | "inactive"
  warehouseId?: string // Only for store managers
  warehouseName?: string // Only for store managers
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export interface RolePermission {
  roleId: UserRole
  permissions: string[] // Permission IDs
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "inactive"
}
