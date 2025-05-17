import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { getProductsAction } from "@/actions/products"
import { QuickCreateButton } from "./components/quick-create-button"
import ProductsClientContent from "./components/products-client-content"

interface ProductsPageProps {
  search?: string
  status?: string
  category?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: string
  pageSize?: string
}

export default async function ProductsPage(props: {
  searchParams?: ProductsPageProps;
}) {
  const searchParams = props.searchParams || {};
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage and track your products</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/products/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Quick Create Button - client component */}
            <QuickCreateButton />
            
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <ProductsClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}