// app/(main)/profile/components/profile-client-wrapper.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Shield, Loader2 } from "lucide-react"
import { updateUserAction, changePasswordAction } from "@/actions/users"
import { UserDTO } from "@/lib/http-service/users/types"
import { BranchDTO } from "@/lib/http-service/branches/types"
import { ProfileForm } from "./profile-form"
import { PasswordForm } from "./password-form"
import { ProfileToastHandler } from "./profile-toast-handler"

interface ProfileClientWrapperProps {
  userData: UserDTO | null
  branchData: BranchDTO | null
  error: string | null
}

export function ProfileClientWrapper({ userData, branchData, error }: ProfileClientWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (!userData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              {error ? "Failed to load profile data" : "Loading profile..."}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <ProfileToastHandler />
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <ProfileForm userData={userData} branchData={branchData} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <PasswordForm userData={userData} />

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary/60" />
                  </div>
                  <div>
                    <h4 className="font-medium">Authenticator App</h4>
                    <p className="text-sm text-muted-foreground">
                      Use an authenticator app to generate one-time codes
                    </p>
                  </div>
                </div>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  Setup
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary/60" />
                  </div>
                  <div>
                    <h4 className="font-medium">SMS Authentication</h4>
                    <p className="text-sm text-muted-foreground">Receive verification codes via SMS</p>
                  </div>
                </div>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  Setup
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}