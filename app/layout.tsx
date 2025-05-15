import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "RoofStar Industries - POS System",
  description: "Point of Sale system for RoofStar Industries roofing products",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
