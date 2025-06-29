// app/(main)/referrals/page.tsx
import { Button } from "@/components/ui/button"
import { Plus, Download, Settings, Search, UserPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { QuickCreateButton } from "./components/quick-create-button"
import ReferralsClientContent from "./components/referrals-client-content"

interface ReferralsPageProps {
  searchParams?: {
    search?: string
    page?: string
    pageSize?: string
    sortBy?: string
    sortDir?: string
  }
}

export default async function ReferralsPage({ searchParams = {} }: ReferralsPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Referrals</h1>
            <p className="text-muted-foreground">Manage customer referrals and rewards</p>
          </div>
          <div className="flex gap-2">
            {/* Export Button */}
            <form action="/api/referrals/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Referral Management Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Referrals
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Referral Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/referrals/search">
                    <Search className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Search Referrals</span>
                      <span className="text-xs text-muted-foreground">Advanced search options</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/referral-payments">
                    <UserPlus className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                      <span>Referral Payments</span>
                      <span className="text-xs text-muted-foreground">Manage payment statuses</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/referrals/lookup" className="text-blue-600 focus:text-blue-600">
                    <Search className="mr-2 h-4 w-4" />
                    Phone Lookup
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Quick Create Button - client component */}
            <QuickCreateButton />
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <ReferralsClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}