'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createThicknessAction } from "@/actions/thicknesses";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize form state
  const [formData, setFormData] = useState({
    thickness: '',
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
      submitData.append('thickness', formData.thickness);

      // Submit to the server action
      const response = await createThicknessAction(submitData);

      if (response.success) {
        // Show success toast
        toast({
          title: "Thickness Created",
          description: `Thickness "${formData.thickness}mm" was created successfully.`,
          variant: "default",
        });
        
        // Close modal and reset form
        setIsOpen(false);
        setFormData({
          thickness: '',
        });
        
        // Refresh data without full page reload
        window.location.href = window.location.pathname;
      } else {
        // Show error toast
        toast({
          title: "Error creating thickness",
          description: response.error || "There was a problem creating the thickness. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating thickness:", error);
      toast({
        title: "Error creating thickness",
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
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Thickness
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Thickness</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="thickness" className="font-medium">Thickness (mm) <span className="text-red-500">*</span></Label>
              <Input
                id="thickness"
                name="thickness"
                value={formData.thickness}
                onChange={handleChange}
                required
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter thickness value"
                className="w-full"
                disabled={isLoading}
              />
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
                'Create Thickness'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}