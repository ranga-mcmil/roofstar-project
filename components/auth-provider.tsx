"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/types"

// Create a mock context with default values
const mockUser: User = {
  id: "usr-001",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
  status: "active",
  lastLogin: "2023-05-15T10:30:00Z",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-05-15T10:30:00Z",
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => true,
  logout: () => {},
  hasPermission: () => true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues by only rendering client-specific content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const contextValue = {
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
    login: async () => true,
    logout: () => {},
    hasPermission: () => true,
  }

  // During SSR or before hydration, provide a minimal context value
  if (!mounted) {
    return <>{children}</>
  }

  // After hydration, provide the full context
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
