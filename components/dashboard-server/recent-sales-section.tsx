// components/dashboard-server/recent-sales-section.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentSales } from "@/lib/actions/dashboard-actions"
import Link from "next/link"

export async function RecentSalesSection() {
  const recentSales = await getRecentSales()

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made {recentSales.length * 53} sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                <AvatarFallback>{sale.initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                <p className="text-sm text-muted-foreground">{sale.email}</p>
              </div>
              <div className="ml-auto font-medium">+${sale.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/sales">
          <Button variant="outline" className="w-full">
            View All
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}