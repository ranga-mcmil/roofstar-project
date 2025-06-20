'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createBatchAction } from "@/actions/batches";
import { getBranchesAction } from "@/actions/branches";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function QuickCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // State for related data
  const [branches, setBranches] = useState([]);

  // Initialize form state
  const [formData, setFormData] = useState({
    batchNumber: '',
    description: '',
    branchId: ''
  });

  // Load required data when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        setDataLoading(true);
        try {
          const branchesRes = await getBranchesAction();

          if (branchesRes.success) setBranches(branchesRes.data.content);
        } catch (error) {
          console.error("Error loading form data:", error);
          toast({
            title: "Error",
            description: "Could not load form data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setDataLoading(false);
        }
      };

      loadData();
    }
  }, [isOpen, toast]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
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

      // Submit to the server action
      const response = await createBatchAction(submitData, formData.branchId);

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
          description: '',
          branchId: ''
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
        {dataLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        ) : (
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
                <Label htmlFor="branchId" className="font-medium">Branch *</Label>
                <Select 
                  name="branchId"
                  value={formData.branchId}
                  onValueChange={(value) => handleSelectChange('branchId', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                disabled={isLoading || !formData.batchNumber || !formData.branchId}
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
        )}
      </DialogContent>
    </Dialog>
  );
}