import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { NextAuthProvider } from "./providers/next-auth-provider"
import { UnauthorizedHandler } from "@/components/unauthorized-handler"

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
        <UnauthorizedHandler />
      </div>
    </NextAuthProvider>
  )
}