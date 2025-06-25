// components/unauthorized-handler.tsx
"use client";
import { useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function UnauthorizedHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    let shouldUpdateUrl = false

    const unauthorized = params.get('unauthorized')
    const attemptedPath = params.get('attempted')

    if (unauthorized === 'true') {
      
      // Clean up URL first
      params.delete('unauthorized')
      params.delete('attempted')
      shouldUpdateUrl = true
      
      // Update URL immediately
      if (shouldUpdateUrl) {
        const newSearch = params.toString()
        const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname
        router.replace(newUrl, { scroll: false })
      }
      
      // Show toast after URL update with a small delay
      setTimeout(() => {
        toast({
          title: "Access Denied",
          description: attemptedPath 
            ? `You don't have permission to access ${attemptedPath}`
            : "You don't have permission to access this page",
          variant: "destructive",
          duration: 5000,
        })
      }, 50) // Small delay to ensure URL update completes
    }
  }, [searchParams, toast, router, pathname])

  return null
}