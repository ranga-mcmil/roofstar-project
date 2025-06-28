// app/(main)/users/[userId]/delete/page.tsx - Replaced delete with deactivation since API has no delete endpoint
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getUserAction, toggleUserStatusAction } from "@/actions/users";
import { GetUserResponse } from "@/lib/http-service/users/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeactivateButton } from "../../components/deactivate-button";

interface DeactivateUserPageProps {
  params: {
    userId: string;
  };
}

export default async function DeactivateUserPage({ params }: DeactivateUserPageProps) {
  const { userId } = params;
  
  // Get user details first
  const userResponse: APIResponse<GetUserResponse> = await getUserAction(userId);
  
  // If user not found, show 404
  if (!userResponse.success || !userResponse.data) {
    notFound();
  }
  
  const user: GetUserResponse = userResponse.data;
  
  // If user is already inactive, redirect to user details
  if (!user.isActive) {
    redirect(`/users/${userId}?error=${encodeURIComponent("User is already deactivated")}`);
  }
  
  // Create a form action that deactivates the user
  async function handleDeactivate() {
    "use server";
    
    // Simulate a delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await toggleUserStatusAction(userId);
    
    if (result.success) {
      redirect(`/users?deactivated=true`);
    } else {
      // If deactivation fails, redirect to users list with error
      redirect(`/users?error=${encodeURIComponent(result.error || "Failed to deactivate user")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <UserX className="h-16 w-16 text-amber-500 mb-2" />
          <CardTitle className="text-2xl">Deactivate User</CardTitle>
          <CardDescription>
            You are about to deactivate user "{user.firstName} {user.lastName}".
            This will prevent them from accessing the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-amber-50 text-amber-800 rounded-md">
              <p className="font-medium">Note: User deletion is not available</p>
              <p className="text-sm mt-1">
                This system uses deactivation instead of deletion to preserve data integrity and audit trails.
              </p>
            </div>

            <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
              <p className="font-medium">Deactivation will:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Prevent the user from logging into the system</li>
                <li>Preserve all user data and transaction history</li>
                <li>Allow you to reactivate the account later if needed</li>
                <li>Maintain data integrity for reporting and auditing</li>
              </ul>
            </div>
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">User details:</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Role:</span> {user.role}</p>
                <p><span className="font-medium">Status:</span> {user.isActive ? "Active" : "Inactive"}</p>
                <p><span className="font-medium">Branch:</span> {user.branchName || 'Not Assigned'}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/users/${userId}`}>Cancel</Link>
          </Button>
          <DeactivateButton deactivateAction={handleDeactivate} />
        </CardFooter>
      </Card>
    </div>
  );
}