// app/(main)/users/components/change-password-form.tsx - Fixed to remove userId parameter
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { changePasswordAction } from "@/actions/users";
import { UserDTO } from "@/lib/http-service/users/types";
import { Loader2 } from "lucide-react";

interface ChangePasswordFormProps {
  user: UserDTO;
  returnUrl: string;
}

export function ChangePasswordFormClient({ user, returnUrl }: ChangePasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Validate passwords match
      const newPassword = formData.get('newPassword') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      
      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "The new password and confirmation password do not match.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Submit to the server action (removed userId parameter since auth endpoint uses session)
      const response = await changePasswordAction(formData);

      if (response.success) {
        toast({
          title: "Password Changed",
          description: "The password has been successfully updated.",
        });
        router.push(`${returnUrl}?passwordChanged=true`);
      } else {
        toast({
          title: "Error",
          description: response.error || "An error occurred while changing the password.",
          variant: "destructive",
        });
        
        // If there are field errors, we could display them inline
        if (response.fieldErrors) {
          console.error("Field errors:", response.fieldErrors);
          
          // Handle specific field errors
          const fieldErrors = response.fieldErrors;
          if (fieldErrors.currentPassword) {
            toast({
              title: "Invalid Current Password",
              description: fieldErrors.currentPassword[0],
              variant: "destructive",
            });
          }
          if (fieldErrors.newPassword) {
            toast({
              title: "Invalid New Password",
              description: fieldErrors.newPassword[0],
              variant: "destructive",
            });
          }
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
    <div className="space-y-6">
      {/* Display user info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Changing password for:</span> {user.firstName} {user.lastName} ({user.email})
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Branch: {user.branchName || 'Not Assigned'} • Status: {user.isActive ? 'Active' : 'Inactive'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">
            Current Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">
            New Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">
            Password should be at least 6 characters long.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm New Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            required
            disabled={isSubmitting}
          />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}