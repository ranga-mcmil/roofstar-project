'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createBatchAction } from "@/actions/batches";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from 'next/navigation';

interface QuickCreateButtonProps {
  userBranchId: string; // Manager's branch ID from session
}

export function QuickCreateButton({ userBranchId }: QuickCreateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize form state
  const [formData, setFormData] = useState({
    batchNumber: '',
    description: ''
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      submitData.append('batchNumber', formData.batchNumber);
      submitData.append('description', formData.description);

      // Submit to the server action using user's branch ID
      const response = await createBatchAction(submitData, userBranchId);

      if (response.success) {
        // Show success toast
        toast({
          title: "Batch Created",
          description: `Batch "${formData.batchNumber}" was created successfully.`,
          variant: "default",
        });
        
        // Close modal and reset form
        setIsOpen(false);
        setFormData({
          batchNumber: '',
          description: ''
        });
        
        // Force a complete page refresh rather than just a router refresh
        window.location.href = window.location.pathname;
      } else {
        // Show error toast
        toast({
          title: "Error creating batch",
          description: response.error || "There was a problem creating the batch. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      toast({
        title: "Error creating batch",
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
            <Plus className="mr-2 h-4 w-4" /> New Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create New Batch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="batchNumber" className="font-medium">Batch Number *</Label>
              <Input
                id="batchNumber"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                required
                placeholder="Enter batch number"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="font-medium">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter batch description (optional)"
                className="w-full"
                disabled={isLoading}
                rows={3}
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
              disabled={isLoading || !formData.batchNumber}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Batch'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}