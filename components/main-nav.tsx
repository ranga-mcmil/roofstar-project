"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { USER_ROLES } from "@/lib/types"

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  const userRole = session?.user?.role

  // If no session or role, don't render anything
  if (!session || !userRole) {
    return null
  }

  // Define navigation items based on role
  const getNavItems = () => {
    switch (userRole) {
      case USER_ROLES.ADMIN:
        return [
          { href: "/", label: "Dashboard" },
          { href: "/branches", label: "Branches" },
          { href: "/users", label: "Users" },
          { href: "/customers", label: "Customers" },
          { href: "/products", label: "Products" },
          { href: "/batches", label: "Batches" },
          { href: "/orders", label: "Orders" },
          { href: "/productions", label: "Productions" },
          { href: "/stock-movements", label: "Stock Movements" },
          { href: "/reports", label: "Reports" }
        ]
      
      case USER_ROLES.MANAGER:
        return [
          { href: "/", label: "Dashboard" },
          { href: "/customers", label: "Customers" },
          { href: "/products", label: "Products" },
          { href: "/batches", label: "Batches" },
          { href: "/orders", label: "Orders" },
          { href: "/productions", label: "Productions" },
          { href: "/stock-movements", label: "Stock Movements" },
          { href: "/reports", label: "Reports" }
        ]
      
      case USER_ROLES.SALES_REP:
        return [
          { href: "/", label: "Dashboard" },
          { href: "/pos", label: "Point of Sale" },
          { href: "/customers", label: "Customers" },
          { href: "/products", label: "Products" },
          { href: "/orders", label: "Orders" },
          { href: "/reports", label: "Reports" }
        ]
      
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium ${
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              ? "text-primary" 
              : "text-muted-foreground"
          } transition-colors hover:text-primary`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}