// app/(main)/referrals/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function ReferralDetailsLoading() {
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
              <Skeleton className="h-5 w-[150px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-5 w-[200px]" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-5 w-[150px]" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-5 w-[180px]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[150px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[140px]" />
                  <Skeleton className="h-6 w-[40px]" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[160px]" />
                  <Skeleton className="h-6 w-[40px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-[120px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

