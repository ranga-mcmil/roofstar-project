"use client"

import type React from "react"
import { useState, useEffect } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Return nothing during SSR to avoid hydration mismatch
  }

  return <>{children}</>
}
