import { CardSkeleton } from "@/components/skeletons/card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="container max-w-screen-lg py-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="mb-4">
        <Skeleton className="h-10 w-[300px]" />
      </div>

      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
