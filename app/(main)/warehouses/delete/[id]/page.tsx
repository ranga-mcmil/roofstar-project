import { warehouses, users } from "@/lib/dummy-data"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DeleteWarehousePageProps {
  params: {
    id: string
  }
}

export default function DeleteWarehousePage({ params }: DeleteWarehousePageProps) {
  const { id } = params

  // Find the warehouse
  const warehouse = warehouses.find((w) => w.id === id)

  if (!warehouse) {
    redirect("/warehouses")
  }

  // Check if any users are assigned to this warehouse
  const assignedUsers = users.filter((user) => user.warehouseId === id)
  const hasAssignedUsers = assignedUsers.length > 0

  async function deleteWarehouse() {
    "use server"

    // In a real app, this would delete from a database
    // For now, we'll just redirect back to the warehouses page
    redirect("/warehouses")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Warehouse</h1>
            <p className="text-gray-500">Are you sure you want to delete the warehouse "{warehouse.name}"?</p>
          </div>

          {hasAssignedUsers ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              <p className="font-medium">Cannot delete warehouse</p>
              <p className="mt-1">
                This warehouse has {assignedUsers.length} users assigned to it. Please reassign or remove these users
                first.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
              <p className="font-medium">Warning</p>
              <p className="mt-1">
                This action cannot be undone. This will permanently delete the warehouse and all associated data.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/warehouses">Cancel</Link>
            </Button>

            <form action={deleteWarehouse}>
              <Button type="submit" variant="destructive" disabled={hasAssignedUsers}>
                Delete Warehouse
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
