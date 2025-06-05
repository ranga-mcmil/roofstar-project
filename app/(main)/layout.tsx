import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProtectedRoute } from "@/components/protected-route"
import { NextAuthProvider } from "./providers/next-auth-provider";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextAuthProvider>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </NextAuthProvider>
  )
}
