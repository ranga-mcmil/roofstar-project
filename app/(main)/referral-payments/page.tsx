// app/(main)/referral-payments/page.tsx
import { Button } from "@/components/ui/button"
import { Download, Filter, DollarSign, Check, X, Clock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import ReferralPaymentsClientContent from "./components/referral-payments-client-content"

interface ReferralPaymentsPageProps {
  searchParams?: {
    status?: string
    referralId?: string
    page?: string
    pageSize?: string
    sortBy?: string
    sortDir?: string
  }
}

export default async function ReferralPaymentsPage({ searchParams = {} }: ReferralPaymentsPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Referral Payments</h1>
            <p className="text-muted-foreground">Manage and track referral payment statuses</p>
          </div>
          <div className="flex gap-2">
            {/* Export Button */}
            <form action="/api/referral-payments/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Quick Status Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Quick Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Payment Status Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/referral-payments?status=PENDING">
                    <Clock className="mr-2 h-4 w-4 text-amber-600" />
                    <div className="flex flex-col">
                      <span>Pending Payments</span>
                      <span className="text-xs text-muted-foreground">Awaiting approval</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/referral-payments?status=APPROVED">
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                      <span>Approved Payments</span>
                      <span className="text-xs text-muted-foreground">Ready for payment</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/referral-payments?status=PAID">
                    <DollarSign className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Paid Payments</span>
                      <span className="text-xs text-muted-foreground">Payment completed</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/referral-payments?status=REJECTED">
                    <X className="mr-2 h-4 w-4 text-red-600" />
                    <div className="flex flex-col">
                      <span>Rejected Payments</span>
                      <span className="text-xs text-muted-foreground">Payment declined</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/referrals" className="text-blue-600 focus:text-blue-600">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Manage Referrals
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <ReferralPaymentsClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}