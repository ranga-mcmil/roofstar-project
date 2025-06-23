"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createBatchAction, updateBatchAction } from "@/actions/batches";
import { BatchDTO } from "@/lib/http-service/batches/types";
import { Loader2 } from "lucide-react";

interface BatchFormProps {
  batch?: BatchDTO;
  returnUrl: string;
  isEditing: boolean;
  userBranchId: string; // Manager's branch ID from session
}

export function BatchFormClient({ 
  batch, 
  returnUrl, 
  isEditing,
  userBranchId
}: BatchFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Submit to the server action
      const response = isEditing 
        ? await updateBatchAction(formData, batch!.id)
        : await createBatchAction(formData, userBranchId); // Use user's branch ID

      if (response.success) {
        toast({
          title: isEditing ? "Batch updated" : "Batch created",
          description: isEditing 
            ? "The batch details have been successfully updated."
            : "The new batch has been successfully created.",
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || `An error occurred while ${isEditing ? 'updating' : 'creating'} the batch.`,
          variant: "destructive",
        });
        
        // If there are field errors, we could display them inline
        if (response.fieldErrors) {
          console.error("Field errors:", response.fieldErrors);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="batchNumber">
            Batch Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="batchNumber"
            name="batchNumber"
            defaultValue={batch?.batchNumber || ""}
            placeholder="Enter batch number"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={batch?.description || ""}
          placeholder="Enter batch description (optional)"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Batch' : 'Create Batch'
          )}
        </Button>
      </div>
    </form>
  );
}