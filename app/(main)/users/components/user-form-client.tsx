"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateUserAction } from "@/actions/users";
import { UserDTO } from "@/lib/http-service/users/types";
import { Loader2 } from "lucide-react";
import { getBranchesAction } from "@/actions/branches";
import { BranchDTO } from "@/lib/http-service/branches/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormProps {
  user: UserDTO;
  returnUrl: string;
}

export function UserFormClient({ user, returnUrl }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  
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

    fetchBranches();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
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
          <Label htmlFor="name">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={user?.name || ""}
            placeholder="Enter first name"
            required
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
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">
          Role <span className="text-red-500">*</span>
        </Label>
        <Select name="role" defaultValue={user?.role || "USER"}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
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
            'Update User'
          )}
        </Button>
      </div>
    </form>
  );
}