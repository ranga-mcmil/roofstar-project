// app/(main)/users/[userId]/page.tsx - Fixed role display consistency
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, KeyRound, Power, UserX } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserAction } from "@/actions/users"
import { GetUserResponse } from "@/lib/http-service/users/types"
import { USER_ROLES } from "@/lib/types"

interface UserDetailsPageProps {
  params: {
    userId: string
  }
  searchParams: {
    error?: string
    passwordChanged?: string
    statusUpdated?: string
  }
}

export default async function UserDetailsPage({ params, searchParams }: UserDetailsPageProps) {
  const { userId } = params;
  
  // Fetch user data
  const userResponse = await getUserAction(userId);
  
  // Check for success and extract user data
  let user = undefined;
  if (userResponse.success) {
    user = userResponse.data as GetUserResponse;
  }

  // If user not found, return 404
  if (!user) {
    notFound();
  }

  // Get role badge - CONSISTENT WITH API RESPONSE
  const getRoleBadge = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
      case 'ROLE_ADMIN':
        return <Badge className="bg-purple-500">Admin</Badge>;
      case USER_ROLES.MANAGER:
      case 'ROLE_MANAGER':
        return <Badge className="bg-blue-500">Manager</Badge>;
      case USER_ROLES.SALES_REP:
      case 'ROLE_SALES_REP':
        return <Badge variant="outline">Sales Rep</Badge>;
      default:
        // Handle any other role format by cleaning it up
        const cleanRole = role.replace('ROLE_', '').replace('_', ' ');
        return <Badge variant="secondary">{cleanRole}</Badge>;
    }
  };

  // Get role display name for text
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
      case 'ROLE_ADMIN':
        return 'Administrator';
      case USER_ROLES.MANAGER:
      case 'ROLE_MANAGER':
        return 'Manager';
      case USER_ROLES.SALES_REP:
      case 'ROLE_SALES_REP':
        return 'Sales Representative';
      default:
        return role.replace('ROLE_', '').replace('_', ' ');
    }
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500">Active</Badge>
    ) : (
      <Badge className="bg-red-500">Inactive</Badge>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Error message if present */}
        {searchParams.error && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md">
            {decodeURIComponent(searchParams.error)}
          </div>
        )}

        {/* Success messages */}
        {searchParams.passwordChanged && (
          <div className="p-3 bg-green-50 text-green-800 rounded-md">
            Password has been successfully updated.
          </div>
        )}

        {searchParams.statusUpdated && (
          <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
            User status has been successfully updated.
          </div>
        )}
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/users">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{user.email}</span>
                <span>•</span>
                {getRoleBadge(user.role)}
                <span>•</span>
                {getStatusBadge(user.isActive)}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" asChild>
              <Link href={`/users/${userId}/change-password`}>
                <KeyRound className="mr-2 h-4 w-4" /> Change Password
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/users/${userId}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button variant="default" asChild>
              <Link href={`/users/${userId}/toggle-status`}>
                <Power className="mr-2 h-4 w-4" /> 
                {user.isActive ? 'Deactivate' : 'Activate'}
              </Link>
            </Button>
            {user.isActive && (
              <Button variant="destructive" asChild>
                <Link href={`/users/${userId}/delete`}>
                  <UserX className="mr-2 h-4 w-4" /> Deactivate
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Full Name</div>
                  <div>{user.firstName} {user.lastName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Email</div>
                  <div>{user.email}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Role</div>
                  <div>{getRoleBadge(user.role)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <div>{getStatusBadge(user.isActive)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">User ID</div>
                  <div className="text-sm text-muted-foreground">{user.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Branch Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Assigned Branch</div>
                  <div>{user.branchName || 'Not Assigned'}</div>
                </div>
                {user.branchId && (
                  <div className="mt-4">
                    <Button variant="outline" asChild size="sm">
                      <Link href={`/branches/${user.branchId}`}>
                        View Branch Details
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground mb-4">No recent activity available for this user.</div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}