import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
  className?: string
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {}, className }: PaginationProps) {
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

  // Create URL with updated page parameter
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()

    // Add all existing search params
    for (const [key, value] of Object.entries(searchParams)) {
      if (key !== "page") {
        params.append(key, value)
      }
    }

    // Add the page parameter
    params.append("page", page.toString())

    // Return the URL with query parameters
    return `${baseUrl}?${params.toString()}`
  }

  return (
    <nav role="navigation" aria-label="Pagination" className={cn("mx-auto flex w-full justify-center pt-4", className)}>
      <div className="flex items-center space-x-2">
        {/* Previous page button */}
        {currentPage > 1 ? (
          <Link href={createPageUrl(currentPage - 1)} passHref>
            <Button variant="outline" size="icon" aria-label="Go to previous page" className="h-9 w-9" asChild>
              <span>
                <ChevronLeft className="h-4 w-4" />
              </span>
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="icon"
            disabled
            aria-label="Go to previous page"
            className="h-9 w-9 cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Page numbers */}
        {pages.map((page, i) => {
          // Render ellipsis
          if (page < 0) {
            return (
              <Button key={`ellipsis-${i}`} variant="outline" size="icon" disabled className="cursor-default h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More pages</span>
              </Button>
            )
          }

          // Render page number
          return currentPage === page ? (
            <Button
              key={page}
              variant="default"
              size="icon"
              aria-label={`Page ${page}`}
              aria-current="page"
              className="h-9 w-9"
            >
              {page}
            </Button>
          ) : (
            <Link href={createPageUrl(page)} passHref key={page}>
              <Button variant="outline" size="icon" aria-label={`Go to page ${page}`} className="h-9 w-9" asChild>
                <span>{page}</span>
              </Button>
            </Link>
          )
        })}

        {/* Next page button */}
        {currentPage < totalPages ? (
          <Link href={createPageUrl(currentPage + 1)} passHref>
            <Button variant="outline" size="icon" aria-label="Go to next page" className="h-9 w-9" asChild>
              <span>
                <ChevronRight className="h-4 w-4" />
              </span>
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="icon"
            disabled
            aria-label="Go to next page"
            className="h-9 w-9 cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </nav>
  )
}
