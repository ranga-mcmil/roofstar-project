"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null
  }

  // Generate page numbers with ellipsis
  const generatePagination = () => {
    // Always show first and last page
    // For small number of pages, show all
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // For larger number of pages, show current page,
    // one page before and after current, and first and last page
    const pages = [1]

    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push(-1) // -1 represents ellipsis
    }

    // Pages around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(-2) // -2 represents ellipsis
    }

    // Add last page if not already included
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pages = generatePagination()

  return (
    <nav role="navigation" aria-label="Pagination" className={cn("mx-auto flex w-full justify-center pt-4", className)}>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((page, i) => {
          // Render ellipsis
          if (page < 0) {
            return (
              <Button key={`ellipsis-${i}`} variant="outline" size="icon" disabled className="cursor-default">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More pages</span>
              </Button>
            )
          }

          // Render page number
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  )
}

export const PaginationContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex w-full items-center justify-center", className)} {...props} />
  },
)
PaginationContent.displayName = "PaginationContent"

export const PaginationItem = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(
  ({ className, ...props }, ref) => {
    return <Button ref={ref} variant="outline" size="icon" className={cn("h-9 w-9", className)} {...props} />
  },
)
PaginationItem.displayName = "PaginationItem"

export const PaginationLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
          className,
        )}
        {...props}
      />
    )
  },
)
PaginationLink.displayName = "PaginationLink"

export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return <span ref={ref} className={cn("h-9 w-9 text-center", className)} {...props} />
  },
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export const PaginationPrevious = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return <Button ref={ref} variant="outline" size="icon" className={cn("h-9 w-9", className)} {...props} />
  },
)
PaginationPrevious.displayName = "PaginationPrevious"

export const PaginationNext = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return <Button ref={ref} variant="outline" size="icon" className={cn("h-9 w-9", className)} {...props} />
  },
)
PaginationNext.displayName = "PaginationNext"
