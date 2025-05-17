'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createBranchAction } from "@/actions/branches";
import { Zap, Loader2 } from "lucide-react";

export function QuickCreateBranchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    street: '',
    city: '',
    province: '',
    country: '',
    postalCode: ''
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
      submitData.append('name', formData.name);
      submitData.append('location', formData.location);
      submitData.append('street', formData.street);
      submitData.append('city', formData.city);
      submitData.append('province', formData.province);
      submitData.append('country', formData.country);
      submitData.append('postalCode', formData.postalCode);

      // Submit to the server action
      const response = await createBranchAction(submitData);

      if (response.success) {
        // Show success toast
        toast({
          title: "Branch Created",
          description: `Branch "${formData.name}" was created successfully.`,
          variant: "default",
        });
        
        // Close modal and reset form
        setIsOpen(false);
        setFormData({
          name: '',
          location: '',
          street: '',
          city: '',
          province: '',
          country: '',
          postalCode: ''
        });
      } else {
        // Show error toast
        toast({
          title: "Error creating branch",
          description: response.error || "There was a problem creating the branch. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating branch:", error);
      toast({
        title: "Error creating branch",
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
        <Button variant="secondary" size="sm" className="gap-1">
          <Zap className="h-4 w-4" />
          Quick Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Branch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-medium">Branch Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter branch name"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="font-medium">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter location"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city" className="font-medium">City *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="province" className="font-medium">Province *</Label>
                <Input
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  placeholder="Enter province"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country" className="font-medium">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="Enter country"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="street" className="font-medium">Street Address</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Enter street address"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postalCode" className="font-medium">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
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
                'Create Branch'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}