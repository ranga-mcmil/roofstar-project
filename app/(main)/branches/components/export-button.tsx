// app/(main)/branches/components/export-branches-button.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBranchesAction } from "@/actions/branches";

export function ExportBranchesButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportBranchesCSV = async () => {
    setIsExporting(true);

    try {
      // Fetch all branches (without pagination for export)
      const response = await getBranchesAction({
        pageNo: 0,
        pageSize: 1000, // Large number to get all branches
        sortBy: 'name',
        sortDir: 'asc'
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch branches");
      }

      const branches = response.data.content;

      // Create CSV content
      const headers = [
        "ID", 
        "Name", 
        "Location", 
        "Status", 
        "Street", 
        "City", 
        "Province", 
        "Country", 
        "Postal Code"
      ];
      
      const rows = branches.map((branch) => [
        branch.id,
        `"${branch.name}"`, // Wrap in quotes to handle commas
        `"${branch.location}"`,
        branch.isActive ? "Active" : "Inactive",
        `"${branch.address.street || ""}"`,
        `"${branch.address.city || ""}"`,
        `"${branch.address.province || ""}"`,
        `"${branch.address.country || ""}"`,
        `"${branch.address.postalCode || ""}"`
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
      link.setAttribute("download", `branches_export_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `${branches.length} branches exported to CSV`,
      });
    } catch (error) {
      console.error("Error exporting branches data:", error);
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
      onClick={exportBranchesCSV} 
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