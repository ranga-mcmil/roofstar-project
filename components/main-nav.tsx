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
          { href: "/users", label: "Users" }
        ]
      
      case USER_ROLES.MANAGER:
        return [
          { href: "/", label: "Dashboard" },
          { href: "/products", label: "Products" }
          // Note: Orders will be shown as icon in site-header
        ]
      
      case USER_ROLES.SALES_REP:
        return [
          { href: "/pos", label: "Point of Sale" }
          // Note: Orders will be shown as icon in site-header
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