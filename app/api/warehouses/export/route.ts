import { NextResponse } from "next/server"
import { warehouses, users } from "@/lib/dummy-data"

export async function POST() {
  try {
    // Create CSV content
    const headers = ["Name", "Location", "Status", "Assigned Users"]
    const rows = warehouses.map((warehouse) => [
      warehouse.name,
      warehouse.location,
      warehouse.status,
      users.filter((user) => user.warehouseId === warehouse.id).length.toString(),
    ])

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Return CSV as a downloadable file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="warehouses_export_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting warehouses data:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to export warehouses" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
