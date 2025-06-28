// app/(main)/users/components/users-toast-handler.tsx - Added deactivated message
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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
    
    // Check for deleted=true query parameter (kept for backwards compatibility)
    if (params.get('deleted') === 'true') {
      toast({
        title: "User Deleted",
        description: "The user has been permanently deleted.",
        variant: "default",
      });
      
      params.delete('deleted');
      shouldUpdateUrl = true;
    }
    
    // Check for deactivated=true query parameter
    if (params.get('deactivated') === 'true') {
      toast({
        title: "User Deactivated",
        description: "The user has been successfully deactivated and can no longer access the system.",
        variant: "default",
      });
      
      params.delete('deactivated');
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