import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, KeyRound, Power } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserAction } from "@/actions/users"
import { GetUserResponse } from "@/lib/http-service/users/types"
import { getBranchesAction } from "@/actions/branches"

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
  
  // Fetch user data and branches in parallel
  const [userResponse, branchesResponse] = await Promise.all([
    getUserAction(userId),
    getBranchesAction()
  ]);
  
  // Check for success and extract user data
  let user = undefined;
  if (userResponse.success) {
    user = userResponse.data as GetUserResponse;
  }

  // If user not found, return 404
  if (!user) {
    notFound();
  }
  
  // Find branch name if user has a branch
  let branchName = 'Not Assigned';
  if (user.branchId && branchesResponse.success) {
    const branch = branchesResponse.data.content.find(b => b.id === user.branchId);
    if (branch) {
      branchName = branch.name;
    }
  }

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-purple-500">Admin</Badge>;
      case 'MANAGER':
        return <Badge className="bg-blue-500">Manager</Badge>;
      case 'USER':
      default:
        return <Badge variant="outline">User</Badge>;
    }
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
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/users">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{user.name} {user.lastName}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{user.email}</span>
                <span>•</span>
                {getRoleBadge(user.role)}
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
            <Button variant={user.active ? "default" : "secondary"} asChild>
              <Link href={`/users/${userId}/toggle-status`}>
                <Power className="mr-2 h-4 w-4" /> {user.active ? "Deactivate" : "Activate"}
              </Link>
            </Button>
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
                  <div>{user.name} {user.lastName}</div>
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
                  <div>
                    {user.active ? (
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100">Inactive</Badge>
                    )}
                  </div>
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
                  <div>{branchName}</div>
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