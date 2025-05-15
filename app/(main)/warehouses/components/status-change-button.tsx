"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { changeWarehouseStatus } from "../actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface StatusChangeButtonProps {
  warehouseId: string
  currentStatus: "active" | "inactive"
  warehouseName: string
}

export function StatusChangeButton({ warehouseId, currentStatus, warehouseName }: StatusChangeButtonProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const toggleWarehouseStatus = () => {
    setShowStatusDialog(true)
  }

  const handleCloseDialog = () => {
    setShowStatusDialog(false)
  }

  const confirmStatusChange = () => {
    setIsChangingStatus(true)
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    changeWarehouseStatus(warehouseId, newStatus)
      .then((result) => {
        if (result.success) {
          toast({
            title: `Warehouse ${newStatus === "active" ? "activated" : "deactivated"}`,
            description: `Warehouse ${warehouseName} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
          })
          router.refresh()
        } else {
          toast({
            title: "Update failed",
            description: result.message || "There was an error updating the warehouse status.",
            variant: "destructive",
          })
        }
      })
      .catch((error) => {
        console.error("Status change error:", error)
        toast({
          title: "Update failed",
          description: "There was an error updating the warehouse status.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsChangingStatus(false)
        setShowStatusDialog(false)
      })
  }

  return (
    <>
      <Button onClick={toggleWarehouseStatus} disabled={isChangingStatus}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isChangingStatus ? "animate-spin" : ""}`} />
        {isChangingStatus ? "Processing..." : currentStatus === "active" ? "Deactivate" : "Activate"}
      </Button>

      <AlertDialog open={showStatusDialog} onOpenChange={handleCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {currentStatus === "active" ? "Deactivate Warehouse" : "Activate Warehouse"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentStatus === "active"
                ? "This will prevent new operations from being assigned to this warehouse. Are you sure you want to deactivate this warehouse?"
                : "This will make the warehouse available for operations. Are you sure you want to activate this warehouse?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              {currentStatus === "active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
