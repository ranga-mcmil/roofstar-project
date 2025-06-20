'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllStockMovementsAction } from "@/actions/stock-movements";

export function ExportStockMovementsButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportStockMovementsCSV = async () => {
    setIsExporting(true);

    try {
      // Fetch all stock movements (without pagination for export)
      const response = await getAllStockMovementsAction({
        pageNo: 0,
        pageSize: 1000, // Large number to get all movements
        sortBy: 'movementDate',
        sortDir: 'desc'
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch stock movements");
      }

      const movements = response.data.content;

      // Create CSV content
      const headers = [
        "ID", 
        "Product ID",
        "Product Name",
        "Order ID", 
        "Order Number", 
        "Movement Type",
        "Quantity",
        "Stock Before",
        "Stock After",
        "Movement Date",
        "Created By",
        "Notes",
        "Reversed",
        "Reversed Date"
      ];
      
      const rows = movements.map((movement) => [
        movement.id,
        movement.productId,
        `"${movement.productName}"`, // Wrap in quotes to handle commas
        movement.orderId,
        `"${movement.orderNumber}"`,
        movement.movementType,
        movement.quantity,
        movement.stockBefore,
        movement.stockAfter,
        new Date(movement.movementDate).toISOString(),
        `"${movement.createdByName}"`,
        `"${movement.notes || ""}"`,
        movement.reversed ? "Yes" : "No",
        movement.reversedDate ? new Date(movement.reversedDate).toISOString() : ""
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","), 
        ...rows.map((row) => row.join(","))
      ].join("\n");

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `stock_movements_export_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `${movements.length} stock movements exported to CSV`,
      });
    } catch (error) {
      console.error("Error exporting stock movements data:", error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred while exporting",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={exportStockMovementsCSV} 
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </>
      )}
    </Button>
  );
}