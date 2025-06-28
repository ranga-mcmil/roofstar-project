// app/(main)/users/components/user-form-client.tsx - Fixed with branch dropdown
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateUserAction } from "@/actions/users";
import { getBranchesAction } from "@/actions/branches";
import { UserDTO } from "@/lib/http-service/users/types";
import { BranchDTO } from "@/lib/http-service/branches/types";
import { Loader2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES } from "@/lib/types";

interface UserFormProps {
  user: UserDTO;
  returnUrl: string;
}

export function UserFormClient({ user, returnUrl }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Load branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      setBranchesLoading(true);
      try {
        const response = await getBranchesAction();
        if (response.success && response.data) {
          setBranches(response.data.content);
        } else {
          toast({
            title: "Failed to load branches",
            description: "Branch selection may not be available.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast({
          title: "Error loading branches",
          description: "Branch selection may not be available.",
          variant: "destructive",
        });
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, [toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Handle special "none" value for branchId
      const branchId = formData.get('branchId') as string;
      if (branchId === '__none__') {
        formData.delete('branchId'); // Remove it so it's not sent to API
      }
      
      // Submit to the server action
      const response = await updateUserAction(formData, user.id);

      if (response.success) {
        toast({
          title: "User updated",
          description: "The user has been successfully updated.",
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || "An error occurred while updating the user.",
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={user?.firstName || ""}
            placeholder="Enter first name"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={user?.lastName || ""}
            placeholder="Enter last name"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email || ""}
          placeholder="Enter email address"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">
          Role <span className="text-red-500">*</span>
        </Label>
        <Select name="role" defaultValue={user?.role || USER_ROLES.SALES_REP} disabled={isSubmitting}>
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

      <div className="space-y-2">
        <Label htmlFor="branchId">Branch Assignment</Label>
        <Select 
          name="branchId" 
          defaultValue={user?.branchId || "__none__"} 
          disabled={isSubmitting || branchesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={
              branchesLoading ? "Loading branches..." : "Select branch (optional)"
            } />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">No Branch Assignment</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name} {branch.location && `(${branch.location})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Optional: Assign user to a specific branch for role-based access
        </p>
        {branchesLoading && (
          <p className="text-xs text-muted-foreground">
            <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
            Loading available branches...
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push(returnUrl)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || branchesLoading}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update User'
          )}
        </Button>
      </div>
    </form>
  );
}