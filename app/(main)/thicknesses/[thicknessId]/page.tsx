import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getThicknessAction } from "@/actions/thicknesses"
import { GetThicknessResponse } from "@/lib/http-service/thicknesses/types"

interface ThicknessDetailsPageProps {
  params: {
    thicknessId: string
  }
  searchParams: {
    error?: string
  }
}

export default async function ThicknessDetailsPage({ params, searchParams }: ThicknessDetailsPageProps) {
  console.log('thicknessId', params.thicknessId)
  const thicknessId = parseInt(params.thicknessId, 10);

  // Fetch thickness data
  const response = await getThicknessAction(thicknessId);
  
  // Check for success and extract thickness data
  let thickness = undefined;
  if (response.success) {
    thickness = response.data as GetThicknessResponse;
  }

  // If thickness not found, return 404
  if (!thickness) {
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
              <Link href="/thicknesses">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Thickness: {thickness.thickness} mm</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/thicknesses/${thicknessId}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Thickness Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">Value (mm)</div>
                <div>{thickness.thickness} mm</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">ID</div>
                <div>{thickness.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Visual Representation</div>
                <div className="h-6 bg-gray-200 rounded" style={{ width: `${Math.min(thickness.thickness * 10, 100)}%` }}>
                  <div className="h-full bg-primary rounded" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}