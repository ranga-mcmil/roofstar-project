"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createMeasurementUnitAction, updateMeasurementUnitAction } from "@/actions/measurement-units";
import { MeasurementUnitDTO } from "@/lib/http-service/measurement-units/types";
import { Loader2 } from "lucide-react";

interface MeasurementUnitFormProps {
  measurementUnit?: MeasurementUnitDTO;
  returnUrl: string;
  isEditing: boolean;
}

export function MeasurementUnitFormClient({ 
  measurementUnit, 
  returnUrl, 
  isEditing 
}: MeasurementUnitFormProps) {
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
        ? await updateMeasurementUnitAction(formData, measurementUnit!.id)
        : await createMeasurementUnitAction(formData);

      if (response.success) {
        toast({
          title: isEditing ? "Measurement unit updated" : "Measurement unit created",
          description: isEditing 
            ? "The measurement unit has been successfully updated."
            : "The new measurement unit has been successfully created.",
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || `An error occurred while ${isEditing ? 'updating' : 'creating'} the measurement unit.`,
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
        <Label htmlFor="unitOfMeasure">
          Unit of Measure <span className="text-red-500">*</span>
        </Label>
        <Input
          id="unitOfMeasure"
          name="unitOfMeasure"
          defaultValue={measurementUnit?.unitOfMeasure || ""}
          placeholder="Enter unit of measure (e.g., pieces, meters, kg, liters)"
          required
          className="font-medium"
        />
        <p className="text-sm text-muted-foreground">
          Specify how this product will be measured (e.g., pieces, meters, kilograms, liters, square meters, etc.)
        </p>
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
            isEditing ? 'Update Unit' : 'Create Unit'
          )}
        </Button>
      </div>
    </form>
  );
}