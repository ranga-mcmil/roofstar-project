import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProductionFormClient } from "../components/production-form-client"

interface NewProductionPageProps {
  searchParams: {
    orderId?: string
    inventoryId?: string
  }
}

export default async function NewProductionPage({ searchParams }: NewProductionPageProps) {
  // Pre-selected order and inventory if provided in search params
  const selectedOrderId = searchParams.orderId ? parseInt(searchParams.orderId, 10) : undefined;
  const selectedInventoryId = searchParams.inventoryId ? parseInt(searchParams.inventoryId, 10) : undefined;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/productions">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Production Record</h1>
            <p className="text-muted-foreground">Record a new production activity</p>
          </div>
        </div>

        <Card className="p-6">
          <ProductionFormClient 
            returnUrl="/productions"
            isEditing={false}
            selectedOrderId={selectedOrderId}
            selectedInventoryId={selectedInventoryId}
          />
        </Card>
      </main>
    </div>
  )
}