// app/(main)/users/components/quick-create-button.tsx - Updated with new roles
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createUserAction } from "@/actions/users";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBranchesAction } from "@/actions/branches";
import { BranchDTO } from "@/lib/http-service/branches/types";
import { USER_ROLES } from "@/lib/types";

export function QuickCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize form state - UPDATED DEFAULT ROLE
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: USER_ROLES.SALES_REP, // Updated to use new role constant
    branchId: '',
  });

  // Load branches for dropdown
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranchesAction();
        if (response.success && response.data) {
          setBranches(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        setLoadingBranches(false);
      }
    };

    if (isOpen) {
      fetchBranches();
    }
  }, [isOpen]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      submitData.append('email', formData.email);
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('password', formData.password);
      submitData.append('role', formData.role);
      if (formData.branchId && formData.branchId !== "_none") {
        submitData.append('branchId', formData.branchId);
      }

      // Submit to the server action
      const response = await createUserAction(submitData);

      if (response.success) {
        // Show success toast
        toast({
          title: "User Created",
          description: `User "${formData.firstName} ${formData.lastName}" was created successfully.`,
          variant: "default",
        });
        
        // Close modal and reset form
        setIsOpen(false);
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          role: USER_ROLES.SALES_REP, // Reset to default role
          branchId: '',
        });
        
        // Refresh data without full page reload
        window.location.href = window.location.pathname;
      } else {
        // Show error toast
        toast({
          title: "Error creating user",
          description: response.error || "There was a problem creating the user. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error creating user",
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
          <Plus className="mr-2 h-4 w-4" /> New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className="font-medium">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter first name"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName" className="font-medium">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter last name"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-medium">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-medium">Password <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role" className="font-medium">Role <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleSelectChange('role', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
                    <SelectItem value={USER_ROLES.MANAGER}>Manager</SelectItem>
                    <SelectItem value={USER_ROLES.SALES_REP}>Sales Rep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="branchId" className="font-medium">Branch</Label>
                <Select 
                  value={formData.branchId} 
                  onValueChange={(value) => handleSelectChange('branchId', value)}
                  disabled={isLoading || loadingBranches}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">None</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}