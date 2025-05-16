"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Edit, Printer } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { exportWarehouseDetails } from "../actions"

interface WarehouseActionsProps {
  warehouseId: string
  warehouseName: string
}

export function WarehouseActions({ warehouseId, warehouseName }: WarehouseActionsProps) {
  const [isPrinting, setIsPrinting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handlePrint = () => {
    setIsPrinting(true)

    setTimeout(() => {
      try {
        window.print()
        toast({
          title: "Print initiated",
          description: "The warehouse details have been sent to your printer.",
        })
      } catch (error) {
        toast({
          title: "Print failed",
          description: "There was an error sending to your printer.",
          variant: "destructive",
        })
      } finally {
        setIsPrinting(false)
      }
    }, 100)
  }

  const handleExport = () => {
    setIsExporting(true)

    exportWarehouseDetails(warehouseId)
      .then(() => {
        // Create a fake download
        const filename = `Warehouse_${warehouseName.replace(/\s+/g, "_")}.pdf`
        const link = document.createElement("a")
        link.href = "#"
        link.setAttribute("download", filename)
        link.click()

        toast({
          title: "Warehouse exported",
          description: `Warehouse details have been exported as ${filename}`,
        })
      })
      .catch((error) => {
        console.error("Export error:", error)
        toast({
          title: "Export failed",
          description: "There was an error exporting the warehouse details.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsExporting(false)
      })
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
        <Printer className="mr-2 h-4 w-4" /> {isPrinting ? "Printing..." : "Print"}
      </Button>
      <Button variant="outline" onClick={handleExport} disabled={isExporting}>
        <Download className="mr-2 h-4 w-4" /> {isExporting ? "Exporting..." : "Export PDF"}
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/warehouses/edit/${warehouseId}`}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
      </Button>
    </div>
  )
}
