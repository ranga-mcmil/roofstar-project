// app/(main)/users/components/deactivate-button.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

// Client component for the deactivate button with loading state
export function DeactivateButton({ deactivateAction }: { deactivateAction: (formData: FormData) => Promise<void> }) {
  return (
    <form action={deactivateAction}>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      variant="destructive"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deactivating...
        </>
      ) : (
        'Deactivate User'
      )}
    </Button>
  );
}