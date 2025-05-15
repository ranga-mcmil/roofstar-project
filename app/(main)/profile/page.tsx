"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Camera, Clock, Save, Shield, User, UserRound } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "+1 (555) 123-4567",
    bio: "Experienced store manager with 5+ years in retail operations. Specialized in inventory management and customer service excellence.",
    jobTitle: "Store Manager",
    department: "Operations",
    location: "Main Branch",
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setProfileData((prev) => ({
      ...prev,
      name: user?.displayName || "Admin User",
      email: user?.email || "admin@example.com",
    }))
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    }, 1000)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with profile summary */}
        <div className="w-full md:w-1/3">
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-16 w-16 text-primary/60" />
                  </div>
                  <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0">
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Upload new picture</span>
                  </Button>
                </div>
                <h3 className="text-xl font-semibold">{profileData.name}</h3>
                <p className="text-muted-foreground">{profileData.jobTitle}</p>
                <p className="text-sm text-muted-foreground mt-1">{profileData.email}</p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">{profileData.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm text-muted-foreground">Administrator</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">January 2023</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full md:w-auto">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={profileData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={profileData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        placeholder="Your position"
                        value={profileData.jobTitle}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        placeholder="Your department"
                        value={profileData.department}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Your work location"
                        value={profileData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters and include a number and a symbol.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>

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
                    <Button variant="outline">Setup</Button>
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
                    <Button variant="outline">Setup</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
