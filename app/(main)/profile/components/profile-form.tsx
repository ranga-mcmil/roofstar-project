// app/(main)/profile/components/profile-form.tsx - Fixed role display consistency
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2 } from "lucide-react"
import { updateUserAction } from "@/actions/users"
import { UserDTO } from "@/lib/http-service/users/types"
import { BranchDTO } from "@/lib/http-service/branches/types"
import { useRouter } from "next/navigation"
import { USER_ROLES } from "@/lib/types"

interface ProfileFormProps {
  userData: UserDTO
  branchData: BranchDTO | null
}

export function ProfileForm({ userData, branchData }: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: userData.role
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const submitFormData = new FormData()
      submitFormData.append('firstName', formData.firstName)
      submitFormData.append('lastName', formData.lastName)
      submitFormData.append('email', formData.email)
      submitFormData.append('role', formData.role)

      const response = await updateUserAction(submitFormData, userData.id)

      if (response.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        })
        
        // Update the form data with the new values to show immediate feedback
        // Refresh the page to show updated data from server
        router.refresh()
      } else {
        toast({
          title: "Error updating profile",
          description: response.error || "There was a problem updating your profile. Please try again.",
          variant: "destructive",
        })

        // If there are field errors, show them
        if (response.fieldErrors) {
          console.error("Field errors:", response.fieldErrors)
          const fieldErrorMessages = Object.entries(response.fieldErrors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n')
          
          toast({
            title: "Validation errors",
            description: fieldErrorMessages,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Get role display name - CONSISTENT WITH API RESPONSE
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
      case 'ROLE_ADMIN':
        return 'Administrator'
      case USER_ROLES.MANAGER:
      case 'ROLE_MANAGER':
        return 'Manager'
      case USER_ROLES.SALES_REP:
      case 'ROLE_SALES_REP':
        return 'Sales Representative'
      default:
        // Handle any other role format by cleaning it up
        return role.replace('ROLE_', '').replace('_', ' ')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and contact information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isSaving}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isSaving}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSaving}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={getRoleDisplayName(formData.role)}
                disabled={true}
                className="bg-muted"
                readOnly
              />
              <p className="text-xs text-muted-foreground">
                Role cannot be changed. Contact an administrator to modify your role.
              </p>
            </div>
            {userData.branchId && branchData && (
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch</Label>
                <Input
                  id="branchName"
                  value={branchData.name}
                  disabled={true}
                  className="bg-muted"
                  readOnly
                />
                <p className="text-xs text-muted-foreground">
                  {branchData.location && `Located at: ${branchData.location}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Branch assignment cannot be changed through this form.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}