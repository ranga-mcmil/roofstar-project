"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateThicknessAction } from "@/actions/thicknesses";
import { ThicknessDTO } from "@/lib/http-service/thicknesses/types";
import { Loader2 } from "lucide-react";

interface ThicknessFormProps {
  thickness: ThicknessDTO;
  returnUrl: string;
}

export function ThicknessFormClient({ thickness, returnUrl }: ThicknessFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Submit to the server action
      const response = await updateThicknessAction(formData, thickness.id);

      if (response.success) {
        toast({
          title: "Thickness updated",
          description: "The thickness value has been successfully updated.",
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || "An error occurred while updating the thickness.",
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
      <div className="space-y-2">
        <Label htmlFor="thickness">
          Thickness (mm) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="thickness"
          name="thickness"
          defaultValue={thickness?.thickness || ""}
          placeholder="Enter thickness value"
          type="number"
          step="0.1"
          min="0"
          required
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
              Updating...
            </>
          ) : (
            'Update Thickness'
          )}
        </Button>
      </div>
    </form>
  );
}