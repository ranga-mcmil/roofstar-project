import { Loader2 } from "lucide-react"

export function AuthLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}
