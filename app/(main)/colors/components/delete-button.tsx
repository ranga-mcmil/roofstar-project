'use client';

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

// Client component for the delete button with loading state
export function DeleteButton({ deleteAction }: { deleteAction: (formData: FormData) => Promise<void> }) {
  return (
    <form action={deleteAction}>
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
          Deleting...
        </>
      ) : (
        'Delete Color'
      )}
    </Button>
  );
}