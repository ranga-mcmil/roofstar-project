// app/(main)/referrals/components/referrals-table.tsx
'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  Phone, 
  MapPin, 
  User,
  DollarSign
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ServerPagination } from "@/components/server-pagination"
import { ReferralDTO } from "@/lib/http-service/referrals/types"
import { Skeleton } from "@/components/ui/skeleton"

interface ReferralsTableProps {
  referrals: ReferralDTO[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
  }
  searchParams?: any
  isLoading?: boolean
  onRefresh?: () => void
}

export function ReferralsTable({
  referrals,
  pagination,
  searchParams,
  isLoading = false,
  onRefresh
}: ReferralsTableProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // Combined loading state (either from parent or from local transitions)
  const loading = isLoading || isPending;

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      router.refresh();
    }
  };

  // Generate skeleton rows for loading state
  const renderSkeletonRows = () => {
    return Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton className="h-4 w-4" />
        </TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-8 rounded-full ml-auto" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <span className="sr-only">Select</span>
              </TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              renderSkeletonRows()
            ) : referrals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No referrals found. Try adjusting your search terms.
                </TableCell>
              </TableRow>
            ) : (
              referrals.map((referral) => (
                <TableRow key={referral.id} className="hover:bg-muted/50">
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link 
                      href={`/referrals/${referral.id}`}
                      className="hover:underline flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      {referral.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {referral.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    {referral.address ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[200px]" title={referral.address}>
                          {referral.address}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No address</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Referral Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/referrals/${referral.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/referrals/${referral.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/referrals/phone/${encodeURIComponent(referral.phoneNumber)}`}>
                            <Phone className="mr-2 h-4 w-4" /> Phone Lookup
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/referral-payments?referralId=${referral.id}`}>
                            <DollarSign className="mr-2 h-4 w-4" /> View Payments
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/referrals/${referral.id}/delete`}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {(referrals.length > 0 || loading) && (
        <div className="flex items-center justify-between mt-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-5 w-48" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} referrals
            </div>
          )}
          <ServerPagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            pathName='/referrals' 
            searchParams={searchParams}
            isLoading={loading}
          />
        </div>
      )}
    </>
  )
}