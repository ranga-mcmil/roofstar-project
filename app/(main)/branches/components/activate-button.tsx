'use client';

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

// Client component for the activate button with loading state
export function ActivateButton({ activateAction }: { activateAction: (formData: FormData) => Promise<void> }) {
  return (
    <form action={activateAction}>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      className="bg-green-600 hover:bg-green-700"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Activating...
        </>
      ) : (
        'Activate Branch'
      )}
    </Button>
  );
}