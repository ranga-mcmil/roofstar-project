import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download, Building2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QuickCreateButton } from "./components/quick-create-button"
import BatchesClientContent from "./components/batches-client-content"

interface BatchesPageProps {
  search?: string
  branch?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: string
  pageSize?: string
}

export default async function BatchesPage(props: {
  searchParams?: BatchesPageProps;
}) {
  const searchParams = props.searchParams || {};
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Batches</h1>
            <p className="text-muted-foreground">Manage and track your production batches</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/batches/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Branch Management Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Manage Branches
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Branch Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/branches">
                    <Building2 className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Branches</span>
                      <span className="text-xs text-muted-foreground">Manage branch locations</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/branches/new" className="text-blue-600 focus:text-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Quick Add Branch
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Quick Create Button - client component */}
            <QuickCreateButton />
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <BatchesClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}