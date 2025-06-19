import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download, ArrowLeft } from "lucide-react"
import { getMeasurementUnitsAction } from "@/actions/measurement-units"
import { QuickCreateMeasurementUnitButton } from "./components/quick-create-button"
import MeasurementUnitsClientContent from "./components/measurement-units-client-content"

interface MeasurementUnitsPageProps {
  search?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: string
  pageSize?: string
}

export default async function MeasurementUnitsPage(props: {
  searchParams?: MeasurementUnitsPageProps;
}) {
  const searchParams = props.searchParams || {};
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Products</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Measurement Units</h1>
              <p className="text-muted-foreground">Manage units of measure for your products</p>
            </div>
          </div>
          <div className="flex gap-2">
            <form action="/api/measurement-units/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Quick Create Button - client component */}
            <QuickCreateMeasurementUnitButton />
            
            <Button asChild>
              <Link href="/measurement-units/new">
                <Plus className="mr-2 h-4 w-4" /> New Unit
              </Link>
            </Button>
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <MeasurementUnitsClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}