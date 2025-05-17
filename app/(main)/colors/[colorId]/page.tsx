import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getColorAction } from "@/actions/colors"
import { GetColorResponse } from "@/lib/http-service/colors/types"

interface ColorDetailsPageProps {
  params: {
    colorId: string
  }
  searchParams: {
    error?: string
  }
}

export default async function ColorDetailsPage({ params, searchParams }: ColorDetailsPageProps) {
  const colorId = parseInt(params.colorId, 10);

  // Fetch color data
  const response = await getColorAction(colorId);
  
  // Check for success and extract color data
  let color = undefined;
  if (response.success) {
    color = response.data as GetColorResponse;
  }

  // If color not found, return 404
  if (!color) {
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
              <Link href="/colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Color: {color.name}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/colors/${colorId}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Color Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">Name</div>
                <div>{color.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">ID</div>
                <div>{color.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Color Preview</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border" 
                    style={{ backgroundColor: color.name.toLowerCase() }}
                  ></div>
                  <span>{color.name}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}