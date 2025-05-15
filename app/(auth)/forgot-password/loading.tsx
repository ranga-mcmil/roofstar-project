import { CardSkeleton } from "@/components/skeletons/card-skeleton"

export default function ForgotPasswordLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="h-[90px] w-[180px] rounded-md bg-gray-200 animate-pulse" />
        </div>
        <CardSkeleton />
      </div>
    </div>
  )
}
