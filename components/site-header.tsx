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
import { BarChart3, FileText, LogOut, Menu, Settings, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSignOut = async () => {
    // Since we've removed authentication, this just redirects to the homepage
    await signOut()
  }

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
              <nav className="flex flex-col gap-4 px-2 py-4">
                {isMounted && (
                  <>
                    <Link
                      href="/"
                      className={`px-4 py-2 text-sm font-medium ${
                        pathname === "/" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/pos"
                      className={`px-4 py-2 text-sm font-medium ${
                        pathname === "/pos" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Point of Sale
                    </Link>
                    <Link
                      href="/sales"
                      className={`px-4 py-2 text-sm font-medium ${
                        pathname.startsWith("/sales") ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Sales
                    </Link>
                    <Link
                      href="/products"
                      className={`px-4 py-2 text-sm font-medium ${
                        pathname === "/products" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Products
                    </Link>
                    <Link
                      href="/inventory"
                      className={`px-4 py-2 text-sm font-medium ${
                        pathname === "/inventory" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Inventory
                    </Link>
                    <Link
                      href="/customers"
                      className={`px-4 py-2 text-sm font-medium ${
                        pathname === "/customers" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Customers
                    </Link>
                    <Link
                      href="/reports"
                      className={`px-4 py-2 text-sm font-medium ${
                        pathname === "/reports" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Reports
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
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/sales">
                <FileText className="h-5 w-5" />
                <span className="sr-only">Sales</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/reports">
                <BarChart3 className="h-5 w-5" />
                <span className="sr-only">Reports</span>
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="relative h-8 rounded-full">
                  <span className="sr-only">User menu</span>
                  <span>Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
          </nav>
        </div>
      </div>
    </header>
  )
}
