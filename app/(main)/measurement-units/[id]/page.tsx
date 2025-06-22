import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, Printer, Package } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getMeasurementUnitAction } from "@/actions/measurement-units"
import { GetMeasurementUnitResponse } from "@/lib/http-service/measurement-units/types"

interface MeasurementUnitDetailsPageProps {
  params: {
    id: string
  }
  searchParams: {
    error?: string
  }
}

export default async function MeasurementUnitDetailsPage({ params, searchParams }: MeasurementUnitDetailsPageProps) {
  const id = parseInt(params.id, 10);

  // Fetch measurement unit data
  const response = await getMeasurementUnitAction(id);
  
  // Check for success and extract measurement unit data
  let measurementUnit = undefined;
  if (response.success) {
    measurementUnit = response.data as GetMeasurementUnitResponse;
  }

  // If measurement unit not found, return 404
  if (!measurementUnit) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8" >
        {/* Error message if present */}
        {searchParams.error && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md">
            {decodeURIComponent(searchParams.error)}
          </div>
        )}
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/measurement-units">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{measurementUnit.unitOfMeasure}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>ID: {measurementUnit.id}</span>
                <span>•</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Measurement Unit
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/measurement-units/${id}/print`}
                target="_blank"
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/api/measurement-units/${id}/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/measurement-units/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button variant="destructive" asChild>
              <Link href={`/measurement-units/${id}/delete`}>
                Delete
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Unit Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Unit of Measure</div>
                  <div className="text-xl font-bold">{measurementUnit.unitOfMeasure}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">ID</div>
                  <div className="text-muted-foreground">{measurementUnit.id}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Type</div>
                  <div>Measurement Unit</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Usage Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Products Using This Unit</div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">0</span>
                    <span className="text-muted-foreground">products</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Available
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Category</div>
                  <div className="text-muted-foreground">
                    {measurementUnit.unitOfMeasure.toLowerCase().includes('meter') || measurementUnit.unitOfMeasure.toLowerCase().includes('cm') || measurementUnit.unitOfMeasure.toLowerCase().includes('mm') 
                      ? 'Length/Distance' 
                      : measurementUnit.unitOfMeasure.toLowerCase().includes('kg') || measurementUnit.unitOfMeasure.toLowerCase().includes('gram') 
                        ? 'Weight/Mass'
                        : measurementUnit.unitOfMeasure.toLowerCase().includes('liter') || measurementUnit.unitOfMeasure.toLowerCase().includes('ml')
                          ? 'Volume'
                          : measurementUnit.unitOfMeasure.toLowerCase().includes('piece') || measurementUnit.unitOfMeasure.toLowerCase().includes('unit')
                            ? 'Count'
                            : 'Other'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Related Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">Products Using This Unit</div>
                <div className="text-muted-foreground">
                  No products are currently using this measurement unit.
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/products?unit=${id}`}>
                    View All Products
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/products/new?unitId=${id}`}>
                    Create Product with This Unit
                  </Link>
                </Button>
              </div>
            </div>
            </CardContent>
          </Card>
      </main>
    </div>
  )
}