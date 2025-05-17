'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getThicknessesAction } from "@/actions/thicknesses";
import { ThicknessDTO } from "@/lib/http-service/thicknesses/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThicknessesToastHandler } from "./thicknesses-toast-handler";
import { ThicknessesTable } from "./thicknesses-table";

export default function ThicknessesClientContent() {
  // State management
  const [thicknesses, setThicknesses] = useState<ThicknessDTO[]>([]);
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
        // Load thicknesses data
        const thicknessesResponse = await getThicknessesAction();
        
        // Only proceed if component is still mounted
        if (!isActive) return;
        
        // Process thicknesses response
        if (thicknessesResponse.success && thicknessesResponse.data) {
          setThicknesses(thicknessesResponse.data);
        } else {
          setThicknesses([]);
          
          // Show error toast
          const errorMessage = thicknessesResponse.error || "Failed to load thicknesses";
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
        setThicknesses([]);
        
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
      <ThicknessesToastHandler />
      
      <div className="border rounded-lg p-4">
        <ThicknessesTable 
          thicknesses={thicknesses}
          isLoading={loading}
          onRefresh={handleRetry}
        />
      </div>
    </>
  );
}