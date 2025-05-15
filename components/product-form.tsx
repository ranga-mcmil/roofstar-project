"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductFormProps {
  productId: string | null
  initialData?: any
  onClose: () => void
}

export function ProductForm({ productId, initialData, onClose }: ProductFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    category: "ibr",
    color: "",
    gauge: "",
    length: "",
    stock: "",
    status: "active",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        sku: initialData.sku || "",
        price: initialData.price?.toString() || "",
        category: initialData.category || "ibr",
        color: initialData.color || "",
        gauge: initialData.gauge || "",
        length: initialData.length?.toString() || "",
        stock: initialData.stock?.toString() || "",
        status: initialData.status || "active",
      })
    }
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.sku || !formData.price) {
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
        title: productId ? "Product updated" : "Product created",
        description: productId
          ? "The product has been updated successfully."
          : "The product has been created successfully.",
      })
      onClose()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">
            SKU <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            placeholder="Enter product SKU"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ibr">IBR Sheets</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="fasteners">Fasteners</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Enter color"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gauge">Gauge</Label>
          <Input
            id="gauge"
            name="gauge"
            value={formData.gauge}
            onChange={handleInputChange}
            placeholder="Enter gauge"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="length">Length (m)</Label>
          <Input
            id="length"
            name="length"
            type="number"
            step="0.1"
            value={formData.length}
            onChange={handleInputChange}
            placeholder="0.0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="status" checked={formData.status === "active"} onCheckedChange={handleStatusChange} />
          <Label htmlFor="status">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
