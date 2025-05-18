import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { getInventoryAdjustmentsAction } from "@/actions/inventory"
import InventoryAdjustmentsClientContent from "../components/inventory-adjustments-client-content"

interface InventoryAdjustmentsPageProps {
  search?: string
  startDate?: string
  endDate?: string
  movementType?: string
  page?: string
  pageSize?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
}

export default async function InventoryAdjustmentsPage(props: {
  searchParams?: InventoryAdjustmentsPageProps;
}) {
  const searchParams = props.searchParams || {};
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory Adjustments</h1>
            <p className="text-muted-foreground">Track and manage inventory adjustments</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/inventory/adjustments/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <InventoryAdjustmentsClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}