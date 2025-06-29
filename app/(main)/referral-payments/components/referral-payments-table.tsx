// app/(main)/referral-payments/components/referral-payments-table.tsx
'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Eye, 
  Check, 
  X, 
  Clock,
  DollarSign,
  User,
  FileText
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
import { ReferralPaymentDTO, ReferralPaymentStatus } from "@/lib/http-service/referral-payments/types"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"

interface ReferralPaymentsTableProps {
  referralPayments: ReferralPaymentDTO[]
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

export function ReferralPaymentsTable({
  referralPayments,
  pagination,
  searchParams,
  isLoading = false,
  onRefresh
}: ReferralPaymentsTableProps) {
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

  const getStatusBadge = (status: ReferralPaymentStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'PAID':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <DollarSign className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <X className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
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
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
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
              <TableHead>Referral Name</TableHead>
              <TableHead>Order Number</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              renderSkeletonRows()
            ) : referralPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No referral payments found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              referralPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-muted/50">
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link 
                      href={`/referrals/${payment.referralId}`}
                      className="hover:underline flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      {payment.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link 
                      href={`/orders/${payment.orderId}`}
                      className="hover:underline flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {payment.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payment.referralAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {payment.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.paymentStatus)}
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
                        <DropdownMenuLabel>Payment Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/referrals/${payment.referralId}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Referral
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/orders/${payment.orderId}`}>
                            <FileText className="mr-2 h-4 w-4" /> View Order
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        {payment.paymentStatus === 'PENDING' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/referral-payments/${payment.id}/approve`}>
                                <Check className="mr-2 h-4 w-4 text-green-600" /> Approve Payment
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/referral-payments/${payment.id}/reject`}>
                                <X className="mr-2 h-4 w-4 text-red-600" /> Reject Payment
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {payment.paymentStatus === 'APPROVED' && (
                          <DropdownMenuItem asChild>
                            <Link href={`/referral-payments/${payment.id}/mark-paid`}>
                              <DollarSign className="mr-2 h-4 w-4 text-blue-600" /> Mark as Paid
                            </Link>
                          </DropdownMenuItem>
                        )}
                        
                        {(payment.paymentStatus === 'PENDING' || payment.paymentStatus === 'APPROVED') && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/referral-payments/${payment.id}/cancel`} className="text-red-600 focus:text-red-600">
                                <X className="mr-2 h-4 w-4" /> Cancel Payment
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {(referralPayments.length > 0 || loading) && (
        <div className="flex items-center justify-between mt-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-5 w-48" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} payments
            </div>
          )}
          <ServerPagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            pathName='/referral-payments' 
            searchParams={searchParams}
            isLoading={loading}
          />
        </div>
      )}
    </>
  )
}