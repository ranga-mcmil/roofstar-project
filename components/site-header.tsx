"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FileText, LogOut, Menu, Settings, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { UserRole, USER_ROLES } from "@/lib/types"

// Helper function to get user initials
function getUserInitials(firstName?: string, lastName?: string, email?: string): string {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  if (email) {
    const emailParts = email.split('@')[0].split('.')
    if (emailParts.length >= 2) {
      return `${emailParts[0].charAt(0)}${emailParts[1].charAt(0)}`.toUpperCase()
    }
    return email.charAt(0).toUpperCase()
  }
  return "U"
}

// Helper function to format role display
function formatRole(role: UserRole): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "Admin"
    case USER_ROLES.MANAGER:
      return "Manager"
    case USER_ROLES.SALES_REP:
      return "Sales Rep"
    default:
      return "User"
  }
}

// Helper function to get role color
function getRoleColor(role: UserRole): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case USER_ROLES.MANAGER:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case USER_ROLES.SALES_REP:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  // Get user display name and initials
  const userName = session?.user?.email || "Unknown User"
  const userInitials = getUserInitials(undefined, undefined, session?.user?.email)
  const userRole = session?.user?.role
  const formattedRole = userRole ? formatRole(userRole) : "User"
  const roleColorClass = userRole ? getRoleColor(userRole) : getRoleColor(USER_ROLES.SALES_REP)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-6 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link href="/" className="flex items-center space-x-2" aria-label="RoofStar">
                  <div className="relative h-8 w-8 overflow-hidden">
                    <Image
                      src="/logo.png"
                      alt="RoofStar Industries Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <span className="font-bold">RoofStar POS</span>
                </Link>
              </div>
              
              {/* Mobile User Info */}
              {isMounted && session && (
                <div className="mx-2 my-4 rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {userName}
                      </p>
                      <Badge variant="secondary" className={`text-xs ${roleColorClass}`}>
                        {formattedRole}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-4 px-2 py-4">
                {isMounted && (
                  <>
                    <Link
                      href="/"
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname === "/" 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/pos"
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname === "/pos" 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Point of Sale
                    </Link>
                    <Link
                      href="/sales"
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname.startsWith("/sales") 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Sales
                    </Link>
                    <Link
                      href="/products"
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname === "/products" 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Products
                    </Link>
                    <Link
                      href="/inventory"
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname === "/inventory" 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Inventory
                    </Link>
                    <Link
                      href="/customers"
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname === "/customers" 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Customers
                    </Link>
                    <Link
                      href="/reports"
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname === "/reports" 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Reports
                    </Link>

                    <Link
                      href="/products"
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname === "/products" 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Products
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="hidden md:block">
            <div className="relative h-10 w-40">
              <Image
                src="/logo.png"
                alt="RoofStar Industries Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          
          <div className="hidden md:ml-6 md:block">
            <MainNav />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <nav className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/orders">
                <FileText className="h-5 w-5" />
                <span className="sr-only">Orders</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/reports">
                <BarChart3 className="h-5 w-5" />
                <span className="sr-only">Reports</span>
              </Link>
            </Button>
            

            {/* User Dropdown */}
            {isMounted && status === "loading" && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                <div className="h-5 w-16 bg-muted rounded animate-pulse hidden sm:block" />
              </div>
            )}

            {isMounted && session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-auto rounded-full px-2 py-1">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <Badge variant="secondary" className={`text-xs ${roleColorClass} hidden sm:inline-flex`}>
                        {formattedRole}
                      </Badge>
                    </div>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex w-full cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex w-full cursor-pointer items-center">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isMounted && !session && status !== "loading" && (
              <Button variant="secondary" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}