// components/dashboard-server/low-stock-items.tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getLowStockItems } from "@/lib/actions/dashboard-actions"
import Link from "next/link"

export async function LowStockItems() {
  const items = await getLowStockItems()

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Low Stock Alert</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className={item.status === 'critical' ? 'border-red-200' : 'border-yellow-200'}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${
                item.status === 'critical' ? 'text-red-500' : 'text-yellow-500'
              }`}>
                {item.stock} sheets left
              </div>
              <p className="text-xs text-muted-foreground">Reorder point: {item.reorderPoint}</p>
            </CardContent>
            <CardFooter>
              <Link href="/inventory/reorder">
                <Button size="sm" variant="outline">
                  Reorder
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}