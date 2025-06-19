import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductAction } from "@/actions/products"
import { getThicknessesAction } from "@/actions/thicknesses"
import { getColorsAction } from "@/actions/colors"
import { getCategoriesAction } from "@/actions/categories"
import { getMeasurementUnitsAction } from "@/actions/measurement-units" // Added missing import
import { GetProductResponse } from "@/lib/http-service/products/types"
import { ProductFormClient } from "../../components/product-form-client"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const id = parseInt(params.id, 10);

  // Fetch product and related data in parallel
  const [
    productResponse, 
    thicknessesResponse, 
    colorsResponse, 
    categoriesResponse,
    measurementUnitsResponse // Added missing measurement units fetch
  ] = await Promise.all([
    getProductAction(id),
    getThicknessesAction(),
    getColorsAction(),
    getCategoriesAction(),
    getMeasurementUnitsAction() // Added missing measurement units fetch
  ]);
  
  // Check for success and extract product data
  let product = undefined;
  if (productResponse.success) {
    product = productResponse.data as GetProductResponse;
  }

  // If product not found, return 404
  if (!product) {
    notFound();
  }

  // Get related data for the form
  const thicknesses = thicknessesResponse.success ? thicknessesResponse.data : [];
  const colors = colorsResponse.success ? colorsResponse.data : [];
  const categories = categoriesResponse.success ? categoriesResponse.data : [];
  const measurementUnits = measurementUnitsResponse.success ? measurementUnitsResponse.data : []; // Added missing measurement units

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/products/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Product: {product.name}</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>

        <Card className="p-6">
          <ProductFormClient 
            product={product} 
            thicknesses={thicknesses}
            colors={colors}
            categories={categories}
            measurementUnits={measurementUnits} // Added missing measurement units
            returnUrl={`/products/${id}`} 
            isEditing={true}
          />
        </Card>
      </main>
    </div>
  )
}