"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Warehouse } from "@/lib/types"

interface ExportButtonProps {
  warehouses: Warehouse[]
  userCounts: Record<string, number>
}

export function ExportButton({ warehouses, userCounts }: ExportButtonProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const exportWarehousesCSV = () => {
    setIsExporting(true)

    try {
      // Create CSV content
      const headers = ["Name", "Location", "Status", "Assigned Users"]
      const rows = warehouses.map((warehouse) => [
        warehouse.name,
        warehouse.location,
        warehouse.status,
        userCounts[warehouse.id] || "0",
      ])

      // Combine headers and rows
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `warehouses_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `${warehouses.length} warehouses exported to CSV`,
      })
    } catch (error) {
      console.error("Error exporting warehouses data:", error)
      toast({
        title: "Export failed",
        description: "An error occurred while exporting",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" onClick={exportWarehousesCSV} disabled={isExporting}>
      <Download className="mr-2 h-4 w-4" /> {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  )
}
