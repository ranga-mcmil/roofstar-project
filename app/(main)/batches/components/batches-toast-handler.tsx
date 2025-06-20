'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function BatchesToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  useEffect(() => {
    // Create a copy of the current search params
    const params = new URLSearchParams(searchParams);
    let shouldUpdateUrl = false;
    
    // Check for deleted=true query parameter
    if (params.get('deleted') === 'true') {
      toast({
        title: "Batch deleted",
        description: "The batch has been permanently deleted.",
        variant: "default",
      });
      
      // Remove the parameter after showing toast
      params.delete('deleted');
      shouldUpdateUrl = true;
    }
    
    // Check for created=true query parameter
    if (params.get('created') === 'true') {
      toast({
        title: "Batch created",
        description: "The new batch has been successfully created.",
        variant: "default",
      });
      
      // Remove the parameter after showing toast
      params.delete('created');
      shouldUpdateUrl = true;
    }
    
    // Check for updated=true query parameter
    if (params.get('updated') === 'true') {
      toast({
        title: "Batch updated",
        description: "The batch has been successfully updated.",
        variant: "default",
      });
      
      // Remove the parameter after showing toast
      params.delete('updated');
      shouldUpdateUrl = true;
    }
    
    // Check for error query parameter
    const error = params.get('error');
    if (error) {
      toast({
        title: "Operation failed",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
      
      // Remove the parameter after showing toast
      params.delete('error');
      shouldUpdateUrl = true;
    }
    
    // Update the URL without the notification parameters (no reload/redirect)
    if (shouldUpdateUrl) {
      const newSearch = params.toString();
      const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, toast, router, pathname]);
  
  // This component doesn't render anything
  return null;
}