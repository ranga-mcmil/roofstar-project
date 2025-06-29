// app/(main)/referrals/components/quick-create-button.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createReferralAction } from "@/actions/referrals";
import { Loader2, Plus } from "lucide-react";

export function QuickCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form state
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: ''
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
      submitData.append('fullName', formData.fullName);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('address', formData.address);

      // Submit to the server action
      const response = await createReferralAction(submitData);

      if (response.success) {
        // Show success toast
        toast({
          title: "Referral Created",
          description: `Referral for "${formData.fullName}" was created successfully.`,
          variant: "default",
        });
        
        // Close modal and reset form
        setIsOpen(false);
        setFormData({
          fullName: '',
          phoneNumber: '',
          address: ''
        });
        
        // Force a complete page refresh rather than just a router refresh
        window.location.href = window.location.pathname;
      } else {
        // Show error toast
        toast({
          title: "Error creating referral",
          description: response.error || "There was a problem creating the referral. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating referral:", error);
      toast({
        title: "Error creating referral",
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
            <Plus className="mr-2 h-4 w-4" /> New Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Referral</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="font-medium">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber" className="font-medium">Phone Number *</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="font-medium">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address (optional)"
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
                'Create Referral'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}