'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export function UsersToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  useEffect(() => {
    // Create a copy of the current search params
    const params = new URLSearchParams(searchParams);
    let shouldUpdateUrl = false;
    
    // Status update message
    if (params.get('statusUpdated') === 'true') {
      toast({
        title: "User Status Updated",
        description: "The user's status has been successfully updated.",
        variant: "default",
      });
      
      params.delete('statusUpdated');
      shouldUpdateUrl = true;
    }
    
    // Password change message
    if (params.get('passwordChanged') === 'true') {
      toast({
        title: "Password Changed",
        description: "The password has been successfully updated.",
        variant: "default",
      });
      
      params.delete('passwordChanged');
      shouldUpdateUrl = true;
    }
    
    // Check for deleted=true query parameter
    if (params.get('deleted') === 'true') {
      toast({
        title: "User Deleted",
        description: "The user has been permanently deleted.",
        variant: "default",
      });
      
      // Remove the parameter after showing toast
      params.delete('deleted');
      shouldUpdateUrl = true;
    }
    
    // Check for error query parameter
    const error = params.get('error');
    if (error) {
      toast({
        title: "Operation Failed",
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