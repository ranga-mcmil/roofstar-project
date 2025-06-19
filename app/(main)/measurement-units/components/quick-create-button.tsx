'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createMeasurementUnitAction } from "@/actions/measurement-units";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from 'next/navigation';

export function QuickCreateMeasurementUnitButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize form state
  const [formData, setFormData] = useState({
    unitOfMeasure: ''
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert form data to FormData for the action
      const submitData = new FormData();
      submitData.append('unitOfMeasure', formData.unitOfMeasure);

      // Submit to the server action
      const response = await createMeasurementUnitAction(submitData);

      if (response.success) {
        // Show success toast
        toast({
          title: "Measurement Unit Created",
          description: `Unit "${formData.unitOfMeasure}" was created successfully.`,
          variant: "default",
        });
        
        // Close modal and reset form
        setIsOpen(false);
        setFormData({
          unitOfMeasure: ''
        });
        
        // Force a complete page refresh rather than just a router refresh
        window.location.href = window.location.pathname;
      } else {
        // Show error toast
        toast({
          title: "Error creating measurement unit",
          description: response.error || "There was a problem creating the measurement unit. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating measurement unit:", error);
      toast({
        title: "Error creating measurement unit",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Quick Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Measurement Unit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="unitOfMeasure" className="font-medium">Unit of Measure *</Label>
              <Input
                id="unitOfMeasure"
                name="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={handleChange}
                required
                placeholder="e.g., pieces, meters, kilograms, liters"
                className="w-full"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Enter the unit of measure (e.g., pieces, meters, kg, liters)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Unit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}