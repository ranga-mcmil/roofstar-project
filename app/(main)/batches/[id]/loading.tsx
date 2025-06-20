// app/(main)/batches/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function BatchDetailsLoading() {
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[140px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-6 w-[150px]" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-5 w-[200px]" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-5 w-[120px]" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[90px]" />
                  <Skeleton className="h-5 w-[180px]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[100px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-[120px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="h-8 w-12 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-4 w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}