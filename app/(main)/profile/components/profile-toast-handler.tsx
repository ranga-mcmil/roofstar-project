// app/(main)/profile/components/profile-toast-handler.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function ProfileToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  useEffect(() => {
    // Create a copy of the current search params
    const params = new URLSearchParams(searchParams);
    let shouldUpdateUrl = false;
    
    // Check for updated=true query parameter
    if (params.get('updated') === 'true') {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
      
      // Remove the parameter after showing toast
      params.delete('updated');
      shouldUpdateUrl = true;
    }
    
    // Check for password-updated=true query parameter
    if (params.get('password-updated') === 'true') {
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
        variant: "default",
      });
      
      // Remove the parameter after showing toast
      params.delete('password-updated');
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