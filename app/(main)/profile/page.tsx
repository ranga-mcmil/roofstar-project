// app/(main)/profile/page.tsx
import { getCurrentUserAction } from "@/actions/users"
import { getBranchAction } from "@/actions/branches"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"
import { ProfileClientWrapper } from "./components/profile-client-wrapper"
import { UserDTO } from "@/lib/http-service/users/types"
import { BranchDTO } from "@/lib/http-service/branches/types"
import { Camera, Clock, Shield, User, UserRound } from "lucide-react"

export default async function ProfilePage() {
  // Get session on server
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  // Load user data and branch data on server
  let userData: UserDTO | null = null
  let branchData: BranchDTO | null = null
  let error: string | null = null

  try {
    const response = await getCurrentUserAction()
    
    if (response.success && response.data) {
      userData = response.data
      
      // If user has a branch, fetch branch details
      if (userData.branchId) {
        try {
          const branchResponse = await getBranchAction(userData.branchId)
          if (branchResponse.success && branchResponse.data) {
            branchData = branchResponse.data
          }
        } catch (branchErr) {
          console.error("Error loading branch data:", branchErr)
          // Don't fail the whole page if branch loading fails
        }
      }
    } else {
      error = response.error || "Failed to load profile data"
    }
  } catch (err) {
    console.error("Error loading user data:", err)
    error = "An unexpected error occurred while loading your profile"
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with profile summary - Server rendered */}
        <div className="w-full md:w-1/3">
          <ProfileSidebar userData={userData} branchData={branchData} />
        </div>

        {/* Main content area - Client wrapper for forms */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <ProfileClientWrapper userData={userData} branchData={branchData} error={error} />
        </div>
      </div>
    </div>
  )
}

// Server component for the sidebar
function ProfileSidebar({ userData, branchData }: { userData: UserDTO | null; branchData: BranchDTO | null }) {
  if (!userData) {
    return (
      <div className="sticky top-6">
        <div className="p-6 border rounded-lg">
          <div className="text-center text-muted-foreground">
            Profile data not available
          </div>
        </div>
      </div>
    )
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrator'
      case 'ROLE_MANAGER':
        return 'Manager'
      case 'ROLE_SALES_REP':
        return 'Sales Representative'
      default:
        return role.replace('ROLE_', '').replace('_', ' ')
    }
  }

  return (
    <div className="sticky top-6">
      <div className="border rounded-lg">
        <div className="pt-6 px-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-4">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                <UserRound className="h-16 w-16 text-primary/60" />
              </div>
              <button className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80">
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload new picture</span>
              </button>
            </div>
            <h3 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h3>
            <p className="text-muted-foreground">{getRoleDisplayName(userData.role)}</p>
            <p className="text-sm text-muted-foreground mt-1">{userData.email}</p>
          </div>

          <div className="border-t border-border my-4"></div>

          <div className="space-y-4 pb-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary/60" />
              </div>
              <div>
                <p className="text-sm font-medium">User ID</p>
                <p className="text-sm text-muted-foreground">{userData.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary/60" />
              </div>
              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground">{getRoleDisplayName(userData.role)}</p>
              </div>
            </div>

            {userData.branchId && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary/60" />
                </div>
                <div>
                  <p className="text-sm font-medium">Branch</p>
                  <p className="text-sm text-muted-foreground">
                    {branchData ? branchData.name : 'Loading...'}
                  </p>
                  {branchData?.location && (
                    <p className="text-xs text-muted-foreground">
                      {branchData.location}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}