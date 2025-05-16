"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WarehouseForm } from "@/components/warehouse-form"
import { ArrowLeft } from "lucide-react"

export default function AddWarehousePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add Warehouse</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Details</CardTitle>
          <CardDescription>Fill in the details below to create a new warehouse in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <WarehouseForm warehouseId={null} onClose={() => router.push("/warehouses")} />
        </CardContent>
      </Card>
    </div>
  )
}
