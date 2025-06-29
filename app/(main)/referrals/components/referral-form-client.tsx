// app/(main)/referrals/components/referral-form-client.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createReferralAction, updateReferralAction } from "@/actions/referrals";
import { ReferralDTO } from "@/lib/http-service/referrals/types";
import { Loader2 } from "lucide-react";

interface ReferralFormProps {
  referral?: ReferralDTO;
  returnUrl: string;
  isEditing: boolean;
}

export function ReferralFormClient({ 
  referral, 
  returnUrl, 
  isEditing 
}: ReferralFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Submit to the server action
      const response = isEditing 
        ? await updateReferralAction(formData, referral!.id)
        : await createReferralAction(formData);

      if (response.success) {
        toast({
          title: isEditing ? "Referral updated" : "Referral created",
          description: isEditing 
            ? "The referral details have been successfully updated."
            : "The new referral has been successfully created.",
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || `An error occurred while ${isEditing ? 'updating' : 'creating'} the referral.`,
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
          <Label htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={referral?.fullName || ""}
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            defaultValue={referral?.phoneNumber || ""}
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          Address
        </Label>
        <Input
          id="address"
          name="address"
          defaultValue={referral?.address || ""}
          placeholder="Enter address (optional)"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Referral' : 'Create Referral'
          )}
        </Button>
      </div>
    </form>
  );
}