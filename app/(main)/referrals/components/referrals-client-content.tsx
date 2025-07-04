// app/(main)/referrals/components/referrals-client-content.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Search, Phone } from "lucide-react";
import { ReferralsTable } from "./referrals-table";
import { ReferralsFilters } from "./referrals-filters";
import { useSearchParams } from 'next/navigation';
import { getAllReferralsAction } from "@/actions/referrals";
import { ReferralDTO } from "@/lib/http-service/referrals/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ReferralsToastHandler } from './referrals-toast-handler';

interface ReferralsClientContentProps {
  searchParams: Record<string, string | string[]>;
}

function ReferralsContent({
  searchParams: initialSearchParams = {}
}: ReferralsClientContentProps) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // State to store referral data
  const [referrals, setReferrals] = useState<ReferralDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    recentReferrals: 0,
    searchCount: 0,
    phoneSearches: 0
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
    const search = searchParams?.get('search') || "";
    const page = Number.parseInt(searchParams?.get('page') || "1", 10);
    const pageSize = Number.parseInt(searchParams?.get('pageSize') || "10", 10);
    const sortBy = searchParams?.get('sortBy') || "id";
    const sortDir = (searchParams?.get('sortDir') || "asc") as "asc" | "desc";
    
    return { search, page, pageSize, sortBy, sortDir };
  };

  const { search, page, pageSize, sortBy, sortDir } = getParams();

  // Load data
  useEffect(() => {
    let isActive = true;
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Create pagination params according to API spec
        const paginationParams = {
          pageNo: page - 1, // API uses 0-based pagination
          pageSize: pageSize,
          sortBy: sortBy,
          sortDir: sortDir
        };

        // Load referrals data
        const referralsResponse = await getAllReferralsAction(paginationParams);
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process referrals response
        if (referralsResponse.success && referralsResponse.data) {
          const referralData = referralsResponse.data;
          
          // Filter referrals based on search on client side
          let filteredReferrals = referralData.content;
          
          // Apply search filter
          if (search) {
            const searchTerm = search.toLowerCase();
            filteredReferrals = filteredReferrals.filter(referral =>
              referral.fullName.toLowerCase().includes(searchTerm) ||
              referral.phoneNumber.toLowerCase().includes(searchTerm) ||
              (referral.address && referral.address.toLowerCase().includes(searchTerm))
            );
          }
          
          setReferrals(filteredReferrals);
          
          // For now, use filtered count for pagination
          // In a real implementation, filtering should be done server-side
          setTotalItems(filteredReferrals.length);
          setTotalPages(Math.ceil(filteredReferrals.length / pageSize));
          
          // Calculate stats
          setStats({
            totalReferrals: referralData.totalElements,
            recentReferrals: referralData.content.length, // Could filter by date
            searchCount: search ? filteredReferrals.length : 0,
            phoneSearches: 0 // Would need separate tracking
          });
        } else {
          setReferrals([]);
          setTotalItems(0);
          setTotalPages(1);
        }
        
        // Check for any errors and show a single toast
        if (!referralsResponse.success) {
          const errorMessage = referralsResponse.error || "Failed to load referrals";
          
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
        
        setReferrals([]);
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
      <ReferralsToastHandler />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalReferrals}
            </div>
            <p className="text-xs text-muted-foreground">
              All referrals in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Referrals</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.recentReferrals}
            </div>
            <p className="text-xs text-muted-foreground">Current page results</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Results</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.searchCount}
            </div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Lookups</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.phoneSearches}
            </div>
            <p className="text-xs text-muted-foreground">Recent searches</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <ReferralsFilters currentSearch={search} isLoading={loading} />

        <ReferralsTable
          referrals={referrals}
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

// Main export with Suspense boundary
export default function ReferralsClientContent(props: ReferralsClientContentProps) {
  return (
    <Suspense fallback={
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 rounded mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    }>
      <ReferralsContent {...props} />
    </Suspense>
  );
}