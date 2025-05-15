import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableSkeletonProps {
  columnCount?: number
  rowCount?: number
}

export function TableSkeleton({ columnCount = 5, rowCount = 5 }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array(columnCount)
            .fill(null)
            .map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-full max-w-[100px]" />
              </TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(rowCount)
          .fill(null)
          .map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array(columnCount)
                .fill(null)
                .map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
