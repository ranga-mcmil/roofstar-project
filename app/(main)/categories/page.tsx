import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar } from "lucide-react"
import { CategoriesTable } from "./components/categories-table"
import { CategoriesFilters } from "./components/categories-filters"
import { getCategoriesAction } from "@/actions/categories"
import { ProductCategoryDTO } from "@/lib/http-service/categories/types"
import { QuickCreateButton } from "./components/quick-create-button"
import CategoriesClientContent from "./components/categories-client-content"

interface CategoriesPageProps {
  search?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: string
  pageSize?: string
}

export default async function CategoriesPage(props: {
  searchParams?: CategoriesPageProps;
}) {
  const searchParams = props.searchParams || {};
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Product Categories</h1>
            <p className="text-muted-foreground">Manage and track your product categories</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/categories/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Quick Create Button - client component */}
            <QuickCreateButton />
            
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <CategoriesClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}