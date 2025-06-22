import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download, Package, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QuickCreateButton } from "./components/quick-create-button"
import ProductionsClientContent from "./components/productions-client-content"

interface ProductionsPageProps {
  search?: string
  batch?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: string
  pageSize?: string
}

export default async function ProductionsPage(props: {
  searchParams?: ProductionsPageProps;
}) {
  const searchParams = props.searchParams || {};
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Productions</h1>
            <p className="text-muted-foreground">Track and manage production records</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/productions/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Related Management Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Related
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Related Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <FileText className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Orders</span>
                      <span className="text-xs text-muted-foreground">Manage production orders</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/inventory">
                    <Package className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                      <span>Inventory</span>
                      <span className="text-xs text-muted-foreground">Manage inventory items</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/batches">
                    <Package className="mr-2 h-4 w-4 text-purple-600" />
                    <div className="flex flex-col">
                      <span>Batches</span>
                      <span className="text-xs text-muted-foreground">Manage production batches</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/orders/new" className="text-blue-600 focus:text-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Quick Add Order
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Quick Create Button - client component */}
            <QuickCreateButton />
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <ProductionsClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}