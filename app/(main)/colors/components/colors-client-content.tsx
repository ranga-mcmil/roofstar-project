'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getColorsAction } from "@/actions/colors";
import { ColorDTO } from "@/lib/http-service/colors/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ColorsToastHandler } from "./colors-toast-handler";
import { ColorsTable } from "./colors-table";

export default function ColorsClientContent() {
  // State management
  const [colors, setColors] = useState<ColorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0); // Used to force a refresh
  const { toast } = useToast();
  const router = useRouter();
  
  // Function to retry loading data
  const handleRetry = useCallback(() => {
    console.log("Refresh/Retry clicked");
    setRetryKey(prev => prev + 1); // Increment retry key to force a reload
    setLoading(true); // Show loading state immediately
  }, []);

  // Load data
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    async function loadData() {
      setLoading(true);
      
      try {
        // Load colors data
        const colorsResponse = await getColorsAction();
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process colors response
        if (colorsResponse.success && colorsResponse.data) {
          setColors(colorsResponse.data);
        } else {
          setColors([]);
          
          // Show error toast
          const errorMessage = colorsResponse.error || "Failed to load colors";
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
                className="bg-white text-primary border-0"
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
        setColors([]);
        
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
              className="bg-white text-primary border-0"
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
  }, [toast, handleRetry, retryKey]);
  
  return (
    <>
      <ColorsToastHandler />
      
      <div className="border rounded-lg p-4">
        <ColorsTable 
          colors={colors}
          isLoading={loading}
          onRefresh={handleRetry}
        />
      </div>
    </>
  );
}