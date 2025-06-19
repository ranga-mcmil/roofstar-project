import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download, Settings, Palette, Layers, Tag, Ruler } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
            
            {/* Product Attributes Management Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Attributes
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Product Attributes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/categories">
                    <Tag className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span>Categories</span>
                      <span className="text-xs text-muted-foreground">Manage product categories</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/colors">
                    <Palette className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                      <span>Colors</span>
                      <span className="text-xs text-muted-foreground">Manage product colors</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/thicknesses">
                    <Layers className="mr-2 h-4 w-4 text-purple-600" />
                    <div className="flex flex-col">
                      <span>Thicknesses</span>
                      <span className="text-xs text-muted-foreground">Manage material thickness</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                {/* Added measurement units menu item */}
                <DropdownMenuItem asChild>
                  <Link href="/measurement-units">
                    <Ruler className="mr-2 h-4 w-4 text-orange-600" />
                    <div className="flex flex-col">
                      <span>Measurement Units</span>
                      <span className="text-xs text-muted-foreground">Manage units of measure</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/categories/new" className="text-blue-600 focus:text-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Quick Add Category
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/colors" className="text-green-600 focus:text-green-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Quick Add Color
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/thicknesses" className="text-purple-600 focus:text-purple-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Quick Add Thickness
                  </Link>
                </DropdownMenuItem>
                
                {/* Added measurement units quick add */}
                <DropdownMenuItem asChild>
                  <Link href="/measurement-units" className="text-orange-600 focus:text-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Quick Add Unit
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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