"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import type { Warehouse } from "@/lib/types"
import { warehouses } from "@/lib/dummy-data"

interface WarehouseFormProps {
  warehouseId: string | null
  onClose: () => void
}

export function WarehouseForm({ warehouseId, onClose }: WarehouseFormProps) {
  const [formData, setFormData] = useState<Partial<Warehouse>>({
    name: "",
    location: "",
    status: "active",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (warehouseId) {
      const warehouse = warehouses.find((w) => w.id === warehouseId)
      if (warehouse) {
        setFormData({
          name: warehouse.name,
          location: warehouse.location,
          status: warehouse.status,
        })
      }
    }
  }, [warehouseId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // In a real app, this would be an API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: warehouseId ? "Warehouse updated" : "Warehouse created",
        description: warehouseId
          ? "The warehouse has been updated successfully."
          : "The warehouse has been created successfully.",
      })
      onClose()
    }, 1000)
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
            value={formData.name}
            onChange={handleInputChange}
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
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter warehouse location"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="status" checked={formData.status === "active"} onCheckedChange={handleStatusChange} />
        <Label htmlFor="status">Active</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : warehouseId ? "Update Warehouse" : "Create Warehouse"}
        </Button>
      </div>
    </form>
  )
}
