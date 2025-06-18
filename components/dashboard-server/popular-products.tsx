// components/dashboard-server/popular-products.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPopularProducts } from "@/lib/actions/dashboard-actions"

export async function PopularProducts() {
  const products = await getPopularProducts()

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Top Selling IBR Sheets</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{product.sheets} sheets</div>
              <p className="text-xs text-muted-foreground">${product.sales.toLocaleString()} in sales</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
