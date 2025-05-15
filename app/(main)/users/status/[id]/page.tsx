import { warehouses } from "@/lib/dummy-data"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ChangeWarehouseStatusPageProps {
  params: {
    id: string
  }
  searchParams: {
    action?: "activate" | "deactivate"
  }
}

export default function ChangeWarehouseStatusPage({ params, searchParams }: ChangeWarehouseStatusPageProps) {
  const { id } = params
  const action = searchParams.action || "activate"

  // Find the warehouse
  const warehouse = warehouses.find((w) => w.id === id)

  if (!warehouse) {
    redirect("/warehouses")
  }

  // Validate the action
  if (
    (action === "activate" && warehouse.status === "active") ||
    (action === "deactivate" && warehouse.status === "inactive")
  ) {
    redirect("/warehouses")
  }

  async function changeStatus() {
    "use server"

    // In a real app, this would update the database
    // For now, we'll just redirect back to the warehouses page
    redirect("/warehouses")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">{action === "activate" ? "Activate" : "Deactivate"} Warehouse</h1>
            <p className="text-gray-500">
              Are you sure you want to {action === "activate" ? "activate" : "deactivate"}
              the warehouse "{warehouse.name}"?
            </p>
          </div>

          <div
            className={`bg-${action === "activate" ? "green" : "amber"}-50 border border-${action === "activate" ? "green" : "amber"}-200 rounded-md p-4 text-${action === "activate" ? "green" : "amber"}-700`}
          >
            <p className="font-medium">{action === "activate" ? "Activation" : "Deactivation"} Information</p>
            <p className="mt-1">
              {action === "activate"
                ? "This will make the warehouse available for operations."
                : "This will prevent new operations from being assigned to this warehouse."}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/warehouses">Cancel</Link>
            </Button>

            <form action={changeStatus}>
              <Button type="submit" variant={action === "activate" ? "default" : "secondary"}>
                {action === "activate" ? "Activate" : "Deactivate"} Warehouse
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
