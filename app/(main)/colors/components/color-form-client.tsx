"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateColorAction } from "@/actions/colors";
import { ColorDTO } from "@/lib/http-service/colors/types";
import { Loader2 } from "lucide-react";

interface ColorFormProps {
  color: ColorDTO;
  returnUrl: string;
}

export function ColorFormClient({ color, returnUrl }: ColorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Submit to the server action
      const response = await updateColorAction(formData, color.id);

      if (response.success) {
        toast({
          title: "Color updated",
          description: "The color details have been successfully updated.",
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || "An error occurred while updating the color.",
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
        <Label htmlFor="name">
          Color Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={color?.name || ""}
          placeholder="Enter color name"
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
            'Update Color'
          )}
        </Button>
      </div>
    </form>
  );
}