import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toggleUserStatusAction, getUserAction } from "@/actions/users";
import { GetUserResponse } from "@/lib/http-service/users/types";
import { APIResponse } from "@/lib/http-service/apiClient";

interface ToggleUserStatusPageProps {
  params: {
    userId: string;
  };
}

export default async function ToggleUserStatusPage({ params }: ToggleUserStatusPageProps) {
  const { userId } = params;
  
  // Get user details first
  const userResponse: APIResponse<GetUserResponse> = await getUserAction(userId);
  
  // If user not found, show 404
  if (!userResponse.success || !userResponse.data) {
    notFound();
  }
  
  const user: GetUserResponse = userResponse.data;
  const isActive = user.active;
  
  // Create a form action that uses the existing toggleUserStatusAction
  async function handleToggleStatus() {
    "use server";
    
    // Simulate a delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await toggleUserStatusAction(userId);
    
    if (result.success) {
      redirect(`/users/${userId}?statusUpdated=true`);
    } else {
      // If toggle fails, redirect with error
      redirect(`/users/${userId}?error=${encodeURIComponent(result.error || "Failed to update user status")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Power className={`h-16 w-16 mb-2 ${isActive ? 'text-amber-500' : 'text-green-500'}`} />
          <CardTitle className="text-2xl">{isActive ? "Deactivate" : "Activate"} User</CardTitle>
          <CardDescription>
            You are about to {isActive ? "deactivate" : "activate"} user "{user.name} {user.lastName}".
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {isActive ? (
              <div className="p-3 bg-amber-50 text-amber-800 rounded-md">
                <p className="font-medium">Deactivation will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Prevent the user from logging into the system</li>
                  <li>Maintain all user data and settings</li>
                  <li>Allow you to reactivate the account later if needed</li>
                </ul>
              </div>
            ) : (
              <div className="p-3 bg-green-50 text-green-800 rounded-md">
                <p className="font-medium">Activation will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Allow the user to log into the system</li>
                  <li>Restore access to all previous data and settings</li>
                  <li>Enable all user functionalities</li>
                </ul>
              </div>
            )}
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">User details:</p>
              <div className="mt-2 space-y-1">
                <p><span className="font-medium">Name:</span> {user.name} {user.lastName}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Role:</span> {user.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/users/${userId}`}>Cancel</Link>
          </Button>
          <form action={handleToggleStatus}>
            <Button 
              type="submit" 
              variant={isActive ? "destructive" : "default"}
            >
              {isActive ? "Deactivate User" : "Activate User"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}