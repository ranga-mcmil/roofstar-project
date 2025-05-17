import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getThicknessesAction } from "@/actions/thicknesses"
import { getColorsAction } from "@/actions/colors"
import { getCategoriesAction } from "@/actions/categories"
import { ProductFormClient } from "../components/product-form-client"

interface NewProductPageProps {
  searchParams: {
    categoryId?: string
  }
}

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  // Fetch related data in parallel
  const [thicknessesResponse, colorsResponse, categoriesResponse] = await Promise.all([
    getThicknessesAction(),
    getColorsAction(),
    getCategoriesAction()
  ]);
  
  // Get thicknesses, colors, and categories for the form
  const thicknesses = thicknessesResponse.success ? thicknessesResponse.data : [];
  const colors = colorsResponse.success ? colorsResponse.data : [];
  const categories = categoriesResponse.success ? categoriesResponse.data : [];

  // Pre-selected category if provided in search params
  const selectedCategoryId = searchParams.categoryId ? parseInt(searchParams.categoryId, 10) : undefined;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Product</h1>
            <p className="text-muted-foreground">Add a new product to your inventory</p>
          </div>
        </div>

        <Card className="p-6">
          <ProductFormClient 
            thicknesses={thicknesses}
            colors={colors}
            categories={categories}
            returnUrl="/products"
            isEditing={false}
            selectedCategoryId={selectedCategoryId}
          />
        </Card>
      </main>
    </div>
  )
}