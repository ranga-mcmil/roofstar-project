"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateBranchAction } from "@/actions/branches";
import { BranchDTO } from "@/lib/http-service/branches/types";
import { Loader2 } from "lucide-react";

interface BranchFormProps {
  branch: BranchDTO;
  returnUrl: string;
}

export function BranchFormClient({ branch, returnUrl }: BranchFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Submit to the server action
      const response = await updateBranchAction(formData, branch.id);

      if (response.success) {
        toast({
          title: "Branch updated",
          description: "The branch details have been successfully updated.",
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || "An error occurred while updating the branch.",
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
            Branch Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={branch?.name || ""}
            placeholder="Enter branch name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            name="location"
            defaultValue={branch?.location || ""}
            placeholder="Enter branch location"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">
          Street Address
        </Label>
        <Input
          id="street"
          name="street"
          defaultValue={branch?.address?.street || ""}
          placeholder="Enter street address"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            name="city"
            defaultValue={branch?.address?.city || ""}
            placeholder="Enter city"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="province">
            Province <span className="text-red-500">*</span>
          </Label>
          <Input
            id="province"
            name="province"
            defaultValue={branch?.address?.province || ""}
            placeholder="Enter province"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="country">
            Country
          </Label>
          <Input
            id="country"
            name="country"
            defaultValue={branch?.address?.country || ""}
            placeholder="Enter country"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            Postal Code
          </Label>
          <Input
            id="postalCode"
            name="postalCode"
            defaultValue={branch?.address?.postalCode || ""}
            placeholder="Enter postal code"
          />
        </div>
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
            'Update Branch'
          )}
        </Button>
      </div>
    </form>
  );
}