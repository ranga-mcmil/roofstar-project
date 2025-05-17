import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, Printer } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategoryAction } from "@/actions/categories"
import { GetCategoryResponse } from "@/lib/http-service/categories/types"

interface CategoryDetailsPageProps {
  params: {
    id: string
  }
  searchParams: {
    error?: string
  }
}

export default async function CategoryDetailsPage({ params, searchParams }: CategoryDetailsPageProps) {
  const id = parseInt(params.id, 10);

  // Fetch category data
  const response = await getCategoryAction(id);
  
  // Check for success and extract category data
  let category = undefined;
  if (response.success) {
    category = response.data as GetCategoryResponse;
  }

  // If category not found, return 404
  if (!category) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Error message if present */}
        {searchParams.error && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md">
            {decodeURIComponent(searchParams.error)}
          </div>
        )}
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/categories">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Category ID: {category.id}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/categories/${id}/print`}
                target="_blank"
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/api/categories/${id}/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/categories/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button variant="destructive" asChild>
              <Link href={`/categories/${id}/delete`}>
                Delete
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Category Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Name</div>
                  <div>{category.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">ID</div>
                  <div>{category.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Assigned Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total Products:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  No products assigned to this category
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild size="sm">
                  <Link href={`/products/new?categoryId=${id}`}>
                    Add Product
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground mb-4">No products found in this category.</div>
            <Button variant="outline" asChild>
              <Link href={`/products/add?categoryId=${id}`}>Add Products</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}