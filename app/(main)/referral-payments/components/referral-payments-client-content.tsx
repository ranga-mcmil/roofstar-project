// app/(main)/referral-payments/components/referral-payments-client-content.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Check, X, AlertTriangle } from "lucide-react";
import { ReferralPaymentsTable } from "./referral-payments-table";
import { ReferralPaymentsFilters } from "./referral-payments-filters";
import { useSearchParams } from 'next/navigation';
import { getAllReferralPaymentsAction } from "@/actions/referral-payments";
import { ReferralPaymentDTO } from "@/lib/http-service/referral-payments/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ReferralPaymentsToastHandler } from './referral-payments-toast-handler';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

interface ReferralPaymentsClientContentProps {
  searchParams: Record<string, string | string[]>;
}

export default function ReferralPaymentsClientContent({
  searchParams: initialSearchParams = {}
}: ReferralPaymentsClientContentProps) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // State to store referral payment data
  const [referralPayments, setReferralPayments] = useState<ReferralPaymentDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    paidPayments: 0,
    rejectedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  
  // Function to retry loading data
  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
    setLoading(true);
  };

  // Parse search parameters
  const getParams = () => {
    const status = searchParams?.get('status') || "all";
    const referralId = searchParams?.get('referralId') || "";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    const sortBy = searchParams?.get('sortBy') || "createdAt";
    const sortDir = (searchParams?.get('sortDir') || "desc") as "asc" | "desc";
    
    return { status, referralId, page, pageSize, sortBy, sortDir };
  };

  const { status, referralId, page, pageSize, sortBy, sortDir } = getParams();

  // Load data
  useEffect(() => {
    let isActive = true;
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Get branch ID from session (this would need to be passed from server component or context)
        // For now, we'll use a placeholder - in real implementation, get from session
        const branchId = "your-branch-id"; // This should come from the user's session
        
        // Create pagination params according to API spec
        const paginationParams = {
          pageNo: page - 1, // API uses 0-based pagination
          pageSize: pageSize,
          sortBy: sortBy,
          sortDir: sortDir
        };

        // Load referral payments data using branchId from session
        const referralPaymentsResponse = await getAllReferralPaymentsAction(branchId, paginationParams);
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process referral payments response
        if (referralPaymentsResponse.success && referralPaymentsResponse.data) {
          const paymentData = referralPaymentsResponse.data;
          
          // Filter payments based on status and referralId on client side
          let filteredPayments = paymentData.content;
          
          // Apply status filter
          if (status !== 'all') {
            filteredPayments = filteredPayments.filter(payment =>
              payment.paymentStatus === status
            );
          }
          
          // Apply referral ID filter
          if (referralId) {
            const referralIdNum = parseInt(referralId, 10);
            if (!isNaN(referralIdNum)) {
              filteredPayments = filteredPayments.filter(payment =>
                payment.referralId === referralIdNum
              );
            }
          }
          
          setReferralPayments(filteredPayments);
          
          // For now, use filtered count for pagination
          // In a real implementation, filtering should be done server-side
          setTotalItems(filteredPayments.length);
          setTotalPages(Math.ceil(filteredPayments.length / pageSize));
          
          // Calculate stats
          const allPayments = paymentData.content;
          setStats({
            totalPayments: allPayments.length,
            pendingPayments: allPayments.filter(p => p.paymentStatus === 'PENDING').length,
            approvedPayments: allPayments.filter(p => p.paymentStatus === 'APPROVED').length,
            paidPayments: allPayments.filter(p => p.paymentStatus === 'PAID').length,
            rejectedPayments: allPayments.filter(p => p.paymentStatus === 'REJECTED').length,
          });
        } else {
          setReferralPayments([]);
          setTotalItems(0);
          setTotalPages(1);
        }
        
        // Check for any errors and show a single toast
        if (!referralPaymentsResponse.success) {
          const errorMessage = referralPaymentsResponse.error || "Failed to load referral payments";
          
          const { dismiss } = toast({
            title: "Error loading data",
            description: errorMessage,
            variant: "destructive",
            action: (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  handleRetry();
                  dismiss();
                }}
                className="bg-white text-primary border-0"
              >
                Try Again
              </Button>
            ),
            duration: 10000,
          });
        }
      } catch (error) {
        if (!isActive) return;
        
        console.error("Error loading data:", error);
        
        setReferralPayments([]);
        setTotalItems(0);
        setTotalPages(1);
        
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        const { dismiss } = toast({
          title: "Network Error",
          description: errorMessage,
          variant: "destructive",
          action: (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                handleRetry();
                dismiss();
              }}
              className="bg-white text-primary border-0"
            >
              Try Again
            </Button>
          ),
          duration: 10000,
        });
      } finally {
        if (isActive) {
          setTimeout(() => setLoading(false), 300);
        }
      }
    }
    
    loadData();
    
    return () => {
      isActive = false;
    };
  }, [searchParams, page, pageSize, toast, retryKey]);

  // Calculate pagination details
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return (
    <>
      <ReferralPaymentsToastHandler />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              All referral payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.pendingPayments}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.approvedPayments}
            </div>
            <p className="text-xs text-muted-foreground">Ready for payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.paidPayments}
            </div>
            <p className="text-xs text-muted-foreground">Payment completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.rejectedPayments}
            </div>
            <p className="text-xs text-muted-foreground">Payment declined</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <ReferralPaymentsFilters 
          currentStatus={status} 
          currentReferralId={referralId}
          isLoading={loading} 
        />

        <ReferralPaymentsTable
          referralPayments={referralPayments}
          pagination={{
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: pageSize,
            startIndex,
            endIndex,
          }}
          searchParams={Object.fromEntries(
            Array.from(searchParams.entries()).map(([key, value]) => [key, value])
          )}
          isLoading={loading}
          onRefresh={handleRetry}
        />
      </div>
    </>
  )
}