import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { QuickCreateButton } from "./components/quick-create-button"
import BranchesClientContent from "./components/branches-client-content"
import { ExportBranchesButton } from "./components/export-button"

interface BranchesPageProps {
  searchParams?: {
    search?: string
    status?: string
    sortField?: string
    sortDirection?: "asc" | "desc"
    page?: string
    pageSize?: string
  }
}

export default async function BranchesPage({ searchParams = {} }: BranchesPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Branches</h1>
            <p className="text-muted-foreground">Manage and track your branches</p>
          </div>
          <div className="flex gap-2">            
            {/* Export Button - client component */}
            <ExportBranchesButton />
            
            {/* Quick Create Button - client component */}
            <QuickCreateButton />
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <BranchesClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}