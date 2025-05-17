import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function EditWarehouseLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Skeleton className="h-7 w-[200px] mb-1" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </div>

        <Card className="p-6">
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-pulse text-center">
              <div className="h-12 w-64 bg-muted rounded mb-4 mx-auto"></div>
              <div className="h-8 w-40 bg-muted rounded mx-auto"></div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
