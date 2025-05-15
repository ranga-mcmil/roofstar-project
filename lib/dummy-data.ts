import type { Customer, Product, Sale, Invoice } from "@/lib/types"
import type { User, Warehouse } from "./types"

// Generate a random ID
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`
}

// Initialize dummy data
export function initializeDummyData() {
  // Initialize customers if they don't exist
  if (!localStorage.getItem("customers")) {
    const customers: Customer[] = [
      {
        id: "cust-1",
        name: "John Doe Construction",
        email: "john@doeconstruction.com",
        phone: "555-123-4567",
        company: "John Doe Construction",
        status: "active",
      },
      {
        id: "cust-2",
        name: "Smith Developments",
        email: "contact@smithdev.com",
        phone: "555-987-6543",
        company: "Smith Developments",
        status: "active",
      },
      {
        id: "cust-3",
        name: "Johnson & Miller",
        email: "info@johnsonmiller.com",
        phone: "555-456-7890",
        company: "Johnson & Miller",
        status: "active",
      },
      {
        id: "cust-4",
        name: "Williams Roofing",
        email: "service@williamsroofing.com",
        phone: "555-789-0123",
        company: "Williams Roofing",
        status: "inactive",
      },
      {
        id: "cust-5",
        name: "Brown Brothers Construction",
        email: "info@brownbros.com",
        phone: "555-234-5678",
        company: "Brown Brothers Construction",
        status: "active",
      },
    ]
    localStorage.setItem("customers", JSON.stringify(customers))
  }

  // Initialize products if they don't exist
  if (!localStorage.getItem("products")) {
    const products: Product[] = [
      {
        id: "ibr-1",
        name: "IBR 0.47mm - Charcoal",
        sku: "IBR-047-CH",
        price: 36.0,
        category: "ibr",
        color: "Charcoal",
        gauge: "0.47mm",
        length: 3.6,
      },
      {
        id: "ibr-2",
        name: "IBR 0.53mm - Galvanized",
        sku: "IBR-053-GL",
        price: 45.0,
        category: "ibr",
        color: "Galvanized",
        gauge: "0.53mm",
        length: 3.6,
      },
      {
        id: "ibr-3",
        name: "IBR 0.47mm - Red",
        sku: "IBR-047-RD",
        price: 38.0,
        category: "ibr",
        color: "Red",
        gauge: "0.47mm",
        length: 4.8,
      },
      {
        id: "ibr-4",
        name: "IBR 0.53mm - Green",
        sku: "IBR-053-GR",
        price: 47.0,
        category: "ibr",
        color: "Green",
        gauge: "0.53mm",
        length: 4.8,
      },
      {
        id: "ibr-5",
        name: "IBR 0.47mm - Blue",
        sku: "IBR-047-BL",
        price: 38.0,
        category: "ibr",
        color: "Blue",
        gauge: "0.47mm",
        length: 6.0,
      },
      {
        id: "ibr-6",
        name: "IBR 0.53mm - Brown",
        sku: "IBR-053-BR",
        price: 47.0,
        category: "ibr",
        color: "Brown",
        gauge: "0.53mm",
        length: 6.0,
      },
      {
        id: "acc-1",
        name: "Ridge Cap - Galvanized",
        sku: "ACC-RC-GL",
        price: 15.0,
        category: "accessories",
        color: "Galvanized",
        gauge: "0.47mm",
        length: 1.8,
      },
      {
        id: "acc-2",
        name: "Ridge Cap - Charcoal",
        sku: "ACC-RC-CH",
        price: 18.0,
        category: "accessories",
        color: "Charcoal",
        gauge: "0.47mm",
        length: 1.8,
      },
      {
        id: "acc-3",
        name: "Flashing - Galvanized",
        sku: "ACC-FL-GL",
        price: 12.0,
        category: "accessories",
        color: "Galvanized",
        gauge: "0.47mm",
        length: 2.4,
      },
      {
        id: "acc-4",
        name: "Flashing - Charcoal",
        sku: "ACC-FL-CH",
        price: 14.0,
        category: "accessories",
        color: "Charcoal",
        gauge: "0.47mm",
        length: 2.4,
      },
      {
        id: "fast-1",
        name: "Roofing Screws (100 pack)",
        sku: "FAST-RS-100",
        price: 25.0,
        category: "fasteners",
        color: "Galvanized",
        gauge: "N/A",
        length: 0,
      },
      {
        id: "fast-2",
        name: "Roofing Nails (500g)",
        sku: "FAST-RN-500",
        price: 18.0,
        category: "fasteners",
        color: "Galvanized",
        gauge: "N/A",
        length: 0,
      },
    ]
    localStorage.setItem("products", JSON.stringify(products))
  }

  // Initialize sales if they don't exist
  if (!localStorage.getItem("sales")) {
    const sales: Sale[] = [
      {
        id: "sale-1",
        date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        customerId: "cust-1",
        customerName: "John Doe Construction",
        items: [
          {
            id: "item-1-1",
            productId: "ibr-1",
            productName: "IBR 0.47mm - Charcoal",
            quantity: 20,
            unitPrice: 36.0,
            totalPrice: 720.0,
          },
          {
            id: "item-1-2",
            productId: "fast-1",
            productName: "Roofing Screws (100 pack)",
            quantity: 2,
            unitPrice: 25.0,
            totalPrice: 50.0,
          },
        ],
        subtotal: 770.0,
        taxRate: 0.15,
        taxAmount: 115.5,
        discount: 0,
        total: 885.5,
        paymentMethod: "card",
        notes: "",
        status: "completed",
      },
      {
        id: "sale-2",
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        customerId: "cust-2",
        customerName: "Smith Developments",
        items: [
          {
            id: "item-2-1",
            productId: "ibr-2",
            productName: "IBR 0.53mm - Galvanized",
            quantity: 15,
            unitPrice: 45.0,
            totalPrice: 675.0,
          },
          {
            id: "item-2-2",
            productId: "acc-1",
            productName: "Ridge Cap - Galvanized",
            quantity: 5,
            unitPrice: 15.0,
            totalPrice: 75.0,
          },
        ],
        subtotal: 750.0,
        taxRate: 0.15,
        taxAmount: 112.5,
        discount: 50.0,
        total: 812.5,
        paymentMethod: "cash",
        notes: "Delivery scheduled for next week",
        status: "completed",
      },
      {
        id: "sale-3",
        date: new Date().toISOString(), // Today
        customerId: "cust-3",
        customerName: "Johnson & Miller",
        items: [
          {
            id: "item-3-1",
            productId: "ibr-3",
            productName: "IBR 0.47mm - Red",
            quantity: 10,
            unitPrice: 38.0,
            totalPrice: 380.0,
          },
          {
            id: "item-3-2",
            productId: "ibr-4",
            productName: "IBR 0.53mm - Green",
            quantity: 10,
            unitPrice: 47.0,
            totalPrice: 470.0,
          },
          {
            id: "item-3-3",
            productId: "fast-2",
            productName: "Roofing Nails (500g)",
            quantity: 3,
            unitPrice: 18.0,
            totalPrice: 54.0,
          },
        ],
        subtotal: 904.0,
        taxRate: 0.15,
        taxAmount: 135.6,
        discount: 90.4,
        total: 949.2,
        paymentMethod: "card",
        notes: "Customer requested specific delivery time",
        status: "completed",
      },
    ]
    localStorage.setItem("sales", JSON.stringify(sales))
  }

  // Initialize invoices if they don't exist
  if (!localStorage.getItem("invoices")) {
    const invoices: Invoice[] = [
      {
        id: "inv-1",
        invoiceNumber: "INV-001",
        date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
        dueDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        customerId: "cust-4",
        customerName: "Williams Roofing",
        items: [
          {
            id: "item-inv1-1",
            productId: "ibr-5",
            productName: "IBR 0.47mm - Blue",
            quantity: 25,
            unitPrice: 38.0,
            totalPrice: 950.0,
          },
          {
            id: "item-inv1-2",
            productId: "acc-3",
            productName: "Flashing - Galvanized",
            quantity: 8,
            unitPrice: 12.0,
            totalPrice: 96.0,
          },
        ],
        subtotal: 1046.0,
        taxRate: 0.15,
        taxAmount: 156.9,
        discount: 0,
        total: 1202.9,
        notes: "Net 7 payment terms",
        status: "overdue",
      },
      {
        id: "inv-2",
        invoiceNumber: "INV-002",
        date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // Due in 2 days
        customerId: "cust-5",
        customerName: "Brown Brothers Construction",
        items: [
          {
            id: "item-inv2-1",
            productId: "ibr-6",
            productName: "IBR 0.53mm - Brown",
            quantity: 18,
            unitPrice: 47.0,
            totalPrice: 846.0,
          },
          {
            id: "item-inv2-2",
            productId: "fast-1",
            productName: "Roofing Screws (100 pack)",
            quantity: 3,
            unitPrice: 25.0,
            totalPrice: 75.0,
          },
        ],
        subtotal: 921.0,
        taxRate: 0.15,
        taxAmount: 138.15,
        discount: 92.1,
        total: 967.05,
        notes: "Net 7 payment terms",
        status: "unpaid",
      },
      {
        id: "inv-3",
        invoiceNumber: "INV-003",
        date: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
        dueDate: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 days ago
        customerId: "cust-1",
        customerName: "John Doe Construction",
        items: [
          {
            id: "item-inv3-1",
            productId: "ibr-1",
            productName: "IBR 0.47mm - Charcoal",
            quantity: 30,
            unitPrice: 36.0,
            totalPrice: 1080.0,
          },
        ],
        subtotal: 1080.0,
        taxRate: 0.15,
        taxAmount: 162.0,
        discount: 0,
        total: 1242.0,
        notes: "Net 7 payment terms",
        status: "paid",
        paymentDate: new Date(Date.now() - 86400000 * 7).toISOString(), // Paid 7 days ago
        saleId: "sale-1",
      },
    ]
    localStorage.setItem("invoices", JSON.stringify(invoices))
  }
}

// Get the next invoice number
export function getNextInvoiceNumber(): string {
  const invoices = JSON.parse(localStorage.getItem("invoices") || "[]") as Invoice[]
  const lastInvoiceNumber =
    invoices.length > 0 ? Number.parseInt(invoices[invoices.length - 1].invoiceNumber.split("-")[1]) : 0
  return `INV-${(lastInvoiceNumber + 1).toString().padStart(3, "0")}`
}

// Add warehouses
export const warehouses: Warehouse[] = [
  {
    id: "wh-001",
    name: "Main Warehouse",
    location: "New York, NY",
    status: "active",
  },
  {
    id: "wh-002",
    name: "West Coast Distribution",
    location: "Los Angeles, CA",
    status: "active",
  },
  {
    id: "wh-003",
    name: "Midwest Facility",
    location: "Chicago, IL",
    status: "active",
  },
  {
    id: "wh-004",
    name: "Southern Warehouse",
    location: "Atlanta, GA",
    status: "inactive",
  },
]

// Add users
export const users: User[] = [
  {
    id: "usr-001",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-15T10:30:00Z",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "usr-002",
    email: "manager1@example.com",
    name: "John Manager",
    role: "store_manager",
    status: "active",
    warehouseId: "wh-001",
    warehouseName: "Main Warehouse",
    lastLogin: "2023-05-14T14:45:00Z",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-05-14T14:45:00Z",
  },
  {
    id: "usr-003",
    email: "manager2@example.com",
    name: "Sarah Manager",
    role: "store_manager",
    status: "active",
    warehouseId: "wh-002",
    warehouseName: "West Coast Distribution",
    lastLogin: "2023-05-15T09:15:00Z",
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2023-05-15T09:15:00Z",
  },
  {
    id: "usr-004",
    email: "sales1@example.com",
    name: "Mike Sales",
    role: "sales_rep",
    status: "active",
    lastLogin: "2023-05-15T08:30:00Z",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-05-15T08:30:00Z",
  },
  {
    id: "usr-005",
    email: "sales2@example.com",
    name: "Lisa Sales",
    role: "sales_rep",
    status: "active",
    lastLogin: "2023-05-14T16:20:00Z",
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-05-14T16:20:00Z",
  },
  {
    id: "usr-006",
    email: "inactive@example.com",
    name: "Inactive User",
    role: "sales_rep",
    status: "inactive",
    lastLogin: "2023-04-01T11:45:00Z",
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2023-04-15T00:00:00Z",
  },
]

export const customers = (() => {
  try {
    const savedCustomers = localStorage.getItem("customers")
    return savedCustomers ? JSON.parse(savedCustomers) : []
  } catch (error) {
    console.error("Error loading customers from localStorage:", error)
    return []
  }
})()

export const products = (() => {
  try {
    const savedProducts = localStorage.getItem("products")
    return savedProducts ? JSON.parse(savedProducts) : []
  } catch (error) {
    console.error("Error loading products from localStorage:", error)
    return []
  }
})()

export const referrers = (() => {
  try {
    const savedReferrers = localStorage.getItem("customers")
    return savedReferrers ? JSON.parse(savedReferrers) : []
  } catch (error) {
    console.error("Error loading referrers from localStorage:", error)
    return []
  }
})()

export const getProducts = () => {
  try {
    const savedProducts = localStorage.getItem("products")
    return savedProducts ? (JSON.parse(savedProducts) as Product[]) : []
  } catch (error) {
    console.error("Error loading products from localStorage:", error)
    return []
  }
}
