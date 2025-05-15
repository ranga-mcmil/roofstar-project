import Link from "next/link";

export function ServerPagination({ currentPage, totalPages, pathName, searchParams }: { currentPage: number; totalPages: number;  pathName: string; searchParams: Record<string, string>}) {

  const createPageURL = (pageNumber: number | string, searchParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathName}?${params.toString()}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page, last page, current page, and pages adjacent to current
      const firstPage = 1
      const lastPage = totalPages

      // Add first page
      pageNumbers.push(firstPage)

      // Add ellipsis if needed
      if (currentPage > 3) {
        pageNumbers.push("...")
      }

      // Add pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i !== firstPage && i !== lastPage) {
          pageNumbers.push(i)
        }
      }

      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push("...")
      }

      // Add last page if not already added
      if (lastPage !== firstPage) {
        pageNumbers.push(lastPage)
      }
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={currentPage > 1 ? createPageURL(currentPage - 1, searchParams) : "#"}
        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
          currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50"
        }`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        Previous
      </Link>

      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <Link
              key={index}
              href={createPageURL(page, searchParams)}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                currentPage === page
                  ? "z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  : "text-gray-700 hover:bg-gray-50"
              } rounded-md`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Link>
          ) : (
            <span key={index} className="px-3 py-2 text-sm text-gray-700">
              {page}
            </span>
          ),
        )}
      </div>

      <Link
        href={currentPage < totalPages ? createPageURL(currentPage + 1, searchParams) : "#"}
        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
          currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50"
        }`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        Next
      </Link>
    </div>
  )
}
