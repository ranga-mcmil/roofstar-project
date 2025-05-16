"use server"

import { revalidatePath } from "next/cache"
import { warehouses, users } from "@/lib/dummy-data"
import type { Warehouse } from "@/lib/types"

export async function getWarehouses(params: {
  search?: string
  status?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: number
  itemsPerPage?: number
}) {
  const { search = "", status = "all", sortField = "name", sortDirection = "asc", page = 1, itemsPerPage = 10 } = params

  // Apply search filter
  let filteredWarehouses = [...warehouses]

  if (search) {
    const query = search.toLowerCase()
    filteredWarehouses = filteredWarehouses.filter(
      (warehouse) => warehouse.name.toLowerCase().includes(query) || warehouse.location.toLowerCase().includes(query),
    )
  }

  // Apply status filter
  if (status !== "all") {
    filteredWarehouses = filteredWarehouses.filter((warehouse) => warehouse.status === status)
  }

  // Apply sorting
  filteredWarehouses.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case "name":
        aValue = a.name
        bValue = b.name
        break
      case "location":
        aValue = a.location
        bValue = b.location
        break
      case "status":
        aValue = a.status
        bValue = b.status
        break
      default:
        aValue = a.name
        bValue = b.name
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })

  // Calculate pagination
  const totalItems = filteredWarehouses.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedWarehouses = filteredWarehouses.slice(startIndex, endIndex)

  return {
    warehouses: paginatedWarehouses,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage,
      startIndex,
      endIndex: Math.min(endIndex, totalItems),
    },
  }
}

export async function getWarehouseById(warehouseId: string): Promise<Warehouse | null> {
  // In a real app, this would fetch from a database
  // For now, we'll use the dummy data
  const warehouse = warehouses.find((w) => w.id === warehouseId) || null

  // Simulate a delay to mimic a database call
  await new Promise((resolve) => setTimeout(resolve, 300))

  return warehouse
}

export async function getAssignedUsers(warehouseId: string) {
  // In a real app, this would fetch from a database
  // For now, we'll use the dummy data
  const assignedUsers = users.filter((user) => user.warehouseId === warehouseId)

  // Simulate a delay to mimic a database call
  await new Promise((resolve) => setTimeout(resolve, 300))

  return assignedUsers
}

export async function createWarehouse(formData: FormData) {
  // In a real app, this would create a record in the database
  // For now, we'll just simulate a delay and return success
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const name = formData.get("name") as string
  const location = formData.get("location") as string
  const status = formData.get("status") === "on" ? "active" : "inactive"

  if (!name || !location) {
    return {
      success: false,
      message: "Name and location are required",
    }
  }

  // In a real app, we would save this to the database
  // For now, we'll just return success

  revalidatePath("/warehouses")

  return {
    success: true,
    message: "Warehouse created successfully",
  }
}

export async function updateWarehouse(warehouseId: string, formData: FormData) {
  // In a real app, this would update a record in the database
  // For now, we'll just simulate a delay and return success
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const name = formData.get("name") as string
  const location = formData.get("location") as string
  const status = formData.get("status") === "on" ? "active" : "inactive"

  if (!name || !location) {
    return {
      success: false,
      message: "Name and location are required",
    }
  }

  // In a real app, we would update the database
  // For now, we'll just return success

  revalidatePath(`/warehouses/${warehouseId}`)
  revalidatePath("/warehouses")

  return {
    success: true,
    message: "Warehouse updated successfully",
  }
}

export async function changeWarehouseStatus(warehouseId: string, newStatus: "active" | "inactive") {
  // In a real app, this would update the database
  // For now, we'll just simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  revalidatePath(`/warehouses/${warehouseId}`)
  revalidatePath("/warehouses")

  return {
    success: true,
    message: `Warehouse status changed to ${newStatus}`,
  }
}

export async function deleteWarehouse(warehouseId: string) {
  // Check if any users are assigned to this warehouse
  const assignedUsers = users.filter((user) => user.warehouseId === warehouseId)
  if (assignedUsers.length > 0) {
    return {
      success: false,
      message: `This warehouse has ${assignedUsers.length} users assigned to it. Please reassign or remove these users first.`,
    }
  }

  // In a real app, this would delete from a database
  // For now, we'll just simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  revalidatePath("/warehouses")

  return {
    success: true,
    message: "The warehouse has been deleted successfully.",
  }
}

export async function exportWarehouseDetails(warehouseId: string, format: "csv" | "pdf") {
  // In a real app, this would generate a file for download
  // For now, we'll just simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    success: true,
    message: `Warehouse details exported as ${format.toUpperCase()}`,
    // In a real app, we would return a file URL or blob
    fileUrl: `#example-${format}-file`,
  }
}

export async function getWarehouseStats() {
  const totalWarehouses = warehouses.length
  const activeWarehouses = warehouses.filter((warehouse) => warehouse.status === "active").length
  const inactiveWarehouses = warehouses.filter((warehouse) => warehouse.status === "inactive").length
  const totalUsers = warehouses.reduce((sum, warehouse) => {
    return sum + users.filter((user) => user.warehouseId === warehouse.id).length
  }, 0)

  return {
    totalWarehouses,
    activeWarehouses,
    inactiveWarehouses,
    totalUsers,
  }
}
