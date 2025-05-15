"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { updateWarehouse, createWarehouse } from "../actions"
import type { Warehouse } from "@/lib/types"
import { BranchResponse } from "@/lib/http-service/branches/types"

interface WarehouseFormProps {
  warehouse?: BranchResponse
  returnUrl: string
}

export function WarehouseFormClient({ warehouse, returnUrl }: WarehouseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    if (warehouse) {
      // Update existing warehouse
      updateWarehouse(warehouse.id, formData)
        .then((result) => {
          if (result.success) {
            toast({
              title: "Warehouse updated",
              description: result.message,
            })
            router.push(returnUrl)
          } else {
            toast({
              title: "Error",
              description: result.message,
              variant: "destructive",
            })
          }
        })
        .catch((error) => {
          console.error("Form submission error:", error)
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    } else {
      // Create new warehouse
      createWarehouse(formData)
        .then((result) => {
          if (result.success) {
            toast({
              title: "Warehouse created",
              description: result.message,
            })
            router.push(returnUrl)
          } else {
            toast({
              title: "Error",
              description: result.message,
              variant: "destructive",
            })
          }
        })
        .catch((error) => {
          console.error("Form submission error:", error)
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Warehouse Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={warehouse?.name || ""}
            placeholder="Enter warehouse name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            name="location"
            defaultValue={warehouse?.location || ""}
            placeholder="Enter warehouse location"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="status" name="status" defaultChecked={warehouse ? warehouse.status === "active" : true} />
        <Label htmlFor="status">Active</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : warehouse ? "Update Warehouse" : "Create Warehouse"}
        </Button>
      </div>
    </form>
  )
}
