'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Package, Tag, Ruler } from "lucide-react";
import { MeasurementUnitsTable } from "./measurement-units-table";
import { MeasurementUnitsFilters } from "./measurement-units-filters";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { getMeasurementUnitsAction } from "@/actions/measurement-units";
import { MeasurementUnitDTO } from "@/lib/http-service/measurement-units/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MeasurementUnitsToastHandler } from './measurement-units-toast-handler';

export default function MeasurementUnitsClientContent({
  searchParams: initialSearchParams = {}
}: {
  searchParams: Record<string, string | string[]>;
}) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  // State to store measurement unit data
  const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitDTO[]>([]);
  const [stats, setStats] = useState({
    totalUnits: 0,
    activeProducts: 0,
    categories: 0,
    mostUsed: 'N/A'
  });
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0); // Used to force a refresh
  
  // Function to retry loading data
  const handleRetry = () => {
    setRetryKey(prev => prev + 1); // Increment retry key to force a reload
    setLoading(true); // Show loading state immediately
  };

  // Parse search parameters
  const getParams = () => {
    const search = searchParams?.get('search') || "";
    
    return { search };
  };

  const { search } = getParams();

  // Load data
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Load measurement units
        const measurementUnitsResponse = await getMeasurementUnitsAction();
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process measurement units response
        if (measurementUnitsResponse.success && measurementUnitsResponse.data) {
          let units = measurementUnitsResponse.data;
          
          // Filter by search if provided
          if (search) {
            units = units.filter(unit => 
              unit.unitOfMeasure.toLowerCase().includes(search.toLowerCase())
            );
          }
          
          setMeasurementUnits(units);
          
          // Calculate stats
          const totalUnits = measurementUnitsResponse.data.length;
          const mostUsedUnit = measurementUnitsResponse.data.length > 0 
            ? measurementUnitsResponse.data[0].unitOfMeasure 
            : 'N/A';
          
          // Set stats (simplified since we don't have product usage data)
          setStats({
            totalUnits: totalUnits,
            activeProducts: 0, // Would need to fetch from products API
            categories: Math.ceil(totalUnits / 3), // Simulated categories
            mostUsed: mostUsedUnit
          });
        } else {
          setMeasurementUnits([]);
        }
        
        // Check for any errors and show a toast
        if (!measurementUnitsResponse.success) {
          const errorMessage = measurementUnitsResponse.error || "Failed to load measurement units";
          
          // Show error toast
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
                  dismiss(); // Close the toast when retry is clicked
                }}
                className="bg-white text-primary border-0" // White background, blue text, no border
              >
                Try Again
              </Button>
            ),
            duration: 10000,
          });
        }
      } catch (error) {
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        console.error("Error loading data:", error);
        
        // Reset state on error
        setMeasurementUnits([]);
        
        // Show error toast for unexpected errors
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
                dismiss(); // Close the toast when retry is clicked
              }}
              className="bg-white text-primary border-0" // White background, blue text, no border
            >
              Try Again
            </Button>
          ),
          duration: 10000,
        });
      } finally {
        // Only proceed if component is still mounted
        if (isActive) {
          setTimeout(() => setLoading(false), 300);
        }
      }
    }
    
    loadData();
    
    // Cleanup function
    return () => {
      isActive = false;
    };
  }, [searchParams, toast, retryKey]);
  
  return (
    <>
      <MeasurementUnitsToastHandler />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.totalUnits}
            </div>
            <p className="text-xs text-muted-foreground">
              All measurement units
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.activeProducts}
            </div>
            <p className="text-xs text-muted-foreground">Using units</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16 rounded" /> : stats.categories}
            </div>
            <p className="text-xs text-muted-foreground">Unit categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-24 rounded" /> : stats.mostUsed}
            </div>
            <p className="text-xs text-muted-foreground">Popular unit</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-2">
        <MeasurementUnitsFilters 
          currentSearch={search} 
          isLoading={loading} 
        />

        <MeasurementUnitsTable
          measurementUnits={measurementUnits}
          searchParams={Object.fromEntries(
            Array.from(searchParams.entries()).map(([key, value]) => [key, value])
          )}
          isLoading={loading}
          onRefresh={handleRetry} // Add refresh callback for handling updates
        />
      </div>
    </>
  )
}