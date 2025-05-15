"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, User, Package, CreditCard, FileText } from "lucide-react"

interface Activity {
  id: string
  referrer: string
  action: "purchase" | "inquiry" | "return" | "payment" | "quote"
  date: string
  details: string
  value?: number
}

const activities: Activity[] = [
  {
    id: "act-1",
    referrer: "John Doe",
    action: "purchase",
    date: "2025-04-10",
    details: "Purchased 50 IBR sheets and accessories",
    value: 1850,
  },
  {
    id: "act-2",
    referrer: "Jane Smith",
    action: "inquiry",
    date: "2025-04-09",
    details: "Inquired about bulk pricing for upcoming project",
  },
  {
    id: "act-3",
    referrer: "Robert Johnson",
    action: "purchase",
    date: "2025-04-08",
    details: "Purchased 25 IBR sheets",
    value: 925,
  },
  {
    id: "act-4",
    referrer: "Sarah Williams",
    action: "return",
    date: "2025-04-07",
    details: "Returned 5 damaged sheets",
    value: 185,
  },
  {
    id: "act-5",
    referrer: "Michael Brown",
    action: "payment",
    date: "2025-04-06",
    details: "Made payment for outstanding invoice",
    value: 1250,
  },
  {
    id: "act-6",
    referrer: "Emily Davis",
    action: "quote",
    date: "2025-04-05",
    details: "Requested quote for new warehouse roofing",
  },
  {
    id: "act-7",
    referrer: "David Wilson",
    action: "purchase",
    date: "2025-04-04",
    details: "Purchased fasteners and accessories",
    value: 320,
  },
  {
    id: "act-8",
    referrer: "Lisa Taylor",
    action: "payment",
    date: "2025-04-03",
    details: "Made payment for recent purchase",
    value: 2750,
  },
  {
    id: "act-9",
    referrer: "John Doe",
    action: "quote",
    date: "2025-04-02",
    details: "Requested quote for residential project",
  },
  {
    id: "act-10",
    referrer: "Jane Smith",
    action: "purchase",
    date: "2025-04-01",
    details: "Purchased 30 IBR sheets",
    value: 1110,
  },
]

interface ReferrerActivityProps {
  page?: number
  itemsPerPage?: number
}

export function ReferrerActivity({ page = 1, itemsPerPage = 5 }: ReferrerActivityProps) {
  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedActivities = activities.slice(startIndex, endIndex)

  const getActionIcon = (action: Activity["action"]) => {
    switch (action) {
      case "purchase":
        return <ShoppingCart className="h-4 w-4" />
      case "inquiry":
        return <User className="h-4 w-4" />
      case "return":
        return <Package className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "quote":
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionBadge = (action: Activity["action"]) => {
    switch (action) {
      case "purchase":
        return <Badge className="bg-green-500">Purchase</Badge>
      case "inquiry":
        return <Badge className="bg-blue-500">Inquiry</Badge>
      case "return":
        return <Badge className="bg-yellow-500">Return</Badge>
      case "payment":
        return <Badge className="bg-purple-500">Payment</Badge>
      case "quote":
        return <Badge className="bg-orange-500">Quote</Badge>
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Referrer</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Details</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedActivities.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No activities found.
            </TableCell>
          </TableRow>
        ) : (
          paginatedActivities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={activity.referrer} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{activity.referrer}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getActionIcon(activity.action)}
                  {getActionBadge(activity.action)}
                </div>
              </TableCell>
              <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
              <TableCell>{activity.details}</TableCell>
              <TableCell className="text-right">{activity.value ? `$${activity.value.toFixed(2)}` : "-"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
