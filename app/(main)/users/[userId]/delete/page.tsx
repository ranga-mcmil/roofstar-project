import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getUserAction } from "@/actions/users";
import { GetUserResponse } from "@/lib/http-service/users/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeleteButton } from "../../components/delete-button";

interface DeleteUserPageProps {
  params: {
    userId: string;
  };
}

export default async function DeleteUserPage({ params }: DeleteUserPageProps) {
  const { userId } = params;
  
  // Get user details first
  const userResponse: APIResponse<GetUserResponse> = await getUserAction(userId);
  
  // If user not found, show 404
  if (!userResponse.success || !userResponse.data) {
    notFound();
  }
  
  const user: GetUserResponse = userResponse.data;
  
  // Create a form action that uses the existing deleteUserAction (you'll need to create this)
  async function handleDelete() {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Note: You'll need to create deleteUserAction in your users actions file
    // For now, we'll just redirect with a success message
    // const result = await deleteUserAction(userId);
    
    // Placeholder for future implementation
    const result = { success: true };
    
    if (result.success) {
      redirect('/users?deleted=true');
    } else {
      // If deletion fails, redirect to users list with error
      redirect(`/users?error=${encodeURIComponent("Failed to delete user")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Trash2 className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Delete User</CardTitle>
          <CardDescription>
            You are about to permanently delete user "{user.name} {user.lastName}".
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>This user will be permanently deleted</li>
                <li>All user data and settings will be lost</li>
                <li>This operation cannot be reversed</li>
              </ul>
            </div>
            
            {user.active && (
              <div className="p-3 bg-amber-50 text-amber-800 rounded-md mt-2">
                <p className="font-medium">Active User</p>
                <p className="text-sm mt-1">
                  This user is currently active. Consider deactivating instead of deleting if you might need to restore access later.
                </p>
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
          <DeleteButton deleteAction={handleDelete} />
        </CardFooter>
      </Card>
    </div>
  );
}