import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getColorAction } from "@/actions/colors"
import { GetColorResponse } from "@/lib/http-service/colors/types"
import { ColorFormClient } from "../../components/color-form-client"

interface EditColorPageProps {
  params: {
    colorId: string
  }
}

export default async function EditColorPage({ params }: EditColorPageProps) {
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/colors/${colorId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Color: {color.name}</h1>
            <p className="text-muted-foreground">Update color information</p>
          </div>
        </div>

        <Card className="p-6">
          <ColorFormClient color={color} returnUrl={`/colors/${colorId}`} />
        </Card>
      </main>
    </div>
  )
}