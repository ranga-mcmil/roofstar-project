import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getMeasurementUnitAction } from "@/actions/measurement-units"
import { GetMeasurementUnitResponse } from "@/lib/http-service/measurement-units/types"
import { MeasurementUnitFormClient } from "../../components/measurement-unit-form-client"

interface EditMeasurementUnitPageProps {
  params: {
    id: string
  }
}

export default async function EditMeasurementUnitPage({ params }: EditMeasurementUnitPageProps) {
  const id = parseInt(params.id, 10);

  // Fetch measurement unit data
  const measurementUnitResponse = await getMeasurementUnitAction(id);
  
  // Check for success and extract measurement unit data
  let measurementUnit = undefined;
  if (measurementUnitResponse.success) {
    measurementUnit = measurementUnitResponse.data as GetMeasurementUnitResponse;
  }

  // If measurement unit not found, return 404
  if (!measurementUnit) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/measurement-units/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Measurement Unit: {measurementUnit.unitOfMeasure}</h1>
            <p className="text-muted-foreground">Update measurement unit information</p>
          </div>
        </div>

        <Card className="p-6">
          <MeasurementUnitFormClient 
            measurementUnit={measurementUnit} 
            returnUrl={`/measurement-units/${id}`} 
            isEditing={true}
          />
        </Card>
      </main>
    </div>
  )
}