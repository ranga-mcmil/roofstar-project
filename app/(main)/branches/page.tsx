import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar } from "lucide-react"
import { BranchesTable } from "./components/branches-table"
import { BranchesFilters } from "./components/branches-filters"
import { getBranchesAction, getBranchStatsAction } from "@/actions/branches"
import { BranchDTO } from "@/lib/http-service/branches/types"
import { QuickCreateButton } from "./components/quick-create-button"
import BranchesClientContent from "./components/branches-client-content"

interface BranchesPageProps {
  search?: string
  status?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: string
  pageSize?: string
}

export default async function BranchesPage(props: {
  searchParams?: BranchesPageProps;
}) {
  const searchParams = props.searchParams || {};
  
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
            <form action="/api/branches/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
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