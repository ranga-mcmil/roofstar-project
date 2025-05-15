"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"

export function MainNav() {
  const pathname = usePathname()
  const { user, hasPermission } = useAuth()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className={`text-sm font-medium ${
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Dashboard
      </Link>
      <Link
        href="/pos"
        className={`text-sm font-medium ${
          pathname === "/pos" ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Point of Sale
      </Link>
      {/* <Link
        href="/sales"
        className={`text-sm font-medium ${
          pathname.startsWith("/sales") ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Sales
      </Link>
      <Link
        href="/products"
        className={`text-sm font-medium ${
          pathname.startsWith("/products") ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Products
      </Link>
      <Link
        href="/inventory"
        className={`text-sm font-medium ${
          pathname.startsWith("/inventory") ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Inventory
      </Link>
      <Link
        href="/referrers"
        className={`text-sm font-medium ${
          pathname.startsWith("/referrers") ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Referrers
      </Link> */}
      <Link
        href="/warehouses"
        className={`text-sm font-medium ${
          pathname.startsWith("/warehouses") ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Warehouses
      </Link>
      
      <Link
        href="/users"
        className={`text-sm font-medium ${
          pathname.startsWith("/users") ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Users
      </Link>
      <Link
        href="/reports"
        className={`text-sm font-medium ${
          pathname.startsWith("/reports") ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Reports
      </Link>
      {/* <Link
        href="/invoices"
        className={`text-sm font-medium ${
          pathname.startsWith("/invoices") ? "text-primary" : "text-muted-foreground"
        } transition-colors hover:text-primary`}
      >
        Invoices
      </Link> */}
    </nav>
  )
}
