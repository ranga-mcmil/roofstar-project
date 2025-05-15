import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { warehouses } from "@/lib/dummy-data"
import { WarehouseFormClient } from "../../components/warehouse-form-client"
import { getBranchAction } from "@/actions/branches"
import { GetBranchResponse } from "@/lib/http-service/branches/types"

interface EditWarehousePageProps {
  params: {
    id: string
  }
}

export default async function EditWarehousePage({ params }: EditWarehousePageProps) {
  const warehouseId = params.id

  const response = await getBranchAction(warehouseId)
  
  let warehouse = undefined
  
  if (response.success) {
    warehouse = response.data as GetBranchResponse
  }

  if (!warehouse) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/warehouses/${warehouseId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Warehouse {warehouse.name}</h1>
            <p className="text-muted-foreground">Update warehouse information</p>
          </div>
        </div>

        <Card className="p-6">
          <WarehouseFormClient warehouse={warehouse} returnUrl={`/warehouses/${warehouseId}`} />
        </Card>
      </main>
    </div>
  )
}
