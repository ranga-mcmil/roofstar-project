import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function ThicknessDetailsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Skeleton className="h-7 w-[200px] mb-1" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-[120px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-6 w-full rounded" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}