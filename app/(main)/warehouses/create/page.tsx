import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { WarehouseFormClient } from "../components/warehouse-form-client"

export default function CreateWarehousePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/warehouses">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Warehouse</h1>
            <p className="text-muted-foreground">Add a new warehouse to your inventory</p>
          </div>
        </div>

        <Card className="p-6">
          <WarehouseFormClient returnUrl="/warehouses" />
        </Card>
      </main>
    </div>
  )
}
