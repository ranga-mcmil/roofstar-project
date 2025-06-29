// app/(main)/referral-payments/components/status-change-button.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface StatusChangeButtonProps {
  action: (formData: FormData) => Promise<void>;
  label: string;
  loadingLabel: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

// Client component for the status change button with loading state
export function StatusChangeButton({ 
  action, 
  label, 
  loadingLabel, 
  variant = "default",
  className 
}: StatusChangeButtonProps) {
  return (
    <form action={action}>
      <SubmitButton 
        label={label} 
        loadingLabel={loadingLabel} 
        variant={variant}
        className={className}
      />
    </form>
  );
}

function SubmitButton({ 
  label, 
  loadingLabel, 
  variant,
  className 
}: {
  label: string;
  loadingLabel: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      variant={variant}
      disabled={pending}
      className={className}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
}