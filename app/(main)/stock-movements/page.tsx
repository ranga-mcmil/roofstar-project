import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import StockMovementsClientContent from "./components/stock-movements-client-content"
import { ExportStockMovementsButton } from "./components/export-button"

interface StockMovementsPageProps {
  searchParams?: {
    search?: string
    productId?: string
    orderId?: string
    movementType?: string
    branchId?: string
    isReversed?: string
    fromDate?: string
    toDate?: string
    page?: string
    pageSize?: string
  }
}

export default async function StockMovementsPage({ searchParams = {} }: StockMovementsPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stock Movements</h1>
            <p className="text-muted-foreground">Track all stock movements and changes</p>
          </div>
          <div className="flex gap-2">            
            {/* Export Button - client component */}
            <ExportStockMovementsButton />
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <StockMovementsClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}