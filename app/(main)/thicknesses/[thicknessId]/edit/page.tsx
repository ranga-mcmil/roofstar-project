import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getThicknessAction } from "@/actions/thicknesses"
import { GetThicknessResponse } from "@/lib/http-service/thicknesses/types"
import { ThicknessFormClient } from "../../components/thicknesses-form-client"

interface EditThicknessPageProps {
  params: {
    thicknessId: string
  }
}

export default async function EditThicknessPage({ params }: EditThicknessPageProps) {
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/thicknesses/${thicknessId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Thickness: {thickness.thickness} mm</h1>
            <p className="text-muted-foreground">Update thickness information</p>
          </div>
        </div>

        <Card className="p-6">
          <ThicknessFormClient thickness={thickness} returnUrl={`/thicknesses/${thicknessId}`} />
        </Card>
      </main>
    </div>
  )
}