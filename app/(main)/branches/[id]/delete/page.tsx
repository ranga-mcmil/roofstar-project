import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteBranchAction, getBranchAction } from "@/actions/branches";
import { GetBranchResponse } from "@/lib/http-service/branches/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeleteButton } from "../../components/delete-button";

interface DeleteBranchPageProps {
  params: {
    id: string;
  };
}

export default async function DeleteBranchPage({ params }: DeleteBranchPageProps) {
  const { id } = params;
  
  // Get branch details first
  const branchResponse: APIResponse<GetBranchResponse> = await getBranchAction(id);
  
  // If branch not found, show 404
  if (!branchResponse.success || !branchResponse.data) {
    notFound();
  }
  
  const branch: GetBranchResponse = branchResponse.data;
  
  // Create a form action that uses the existing deleteBranchAction
  async function handleDelete() {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await deleteBranchAction(id);

    
    if (result.success) {
      redirect('/branches?deleted=true');
    } else {
      // If deletion fails, redirect to branches list with error
      redirect(`/branches?error=${encodeURIComponent(result.error || "Failed to delete branch")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Trash2 className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Delete Branch</CardTitle>
          <CardDescription>
            You are about to permanently delete branch "{branch.name}".
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All branch information will be permanently deleted</li>
                <li>This branch will no longer appear in reports</li>
                <li>This operation cannot be reversed</li>
              </ul>
            </div>
            
            {branch.isActive && (
              <div className="p-3 bg-amber-50 text-amber-800 rounded-md mt-2">
                <p className="font-medium">Active Branch</p>
                <p className="text-sm mt-1">
                  This branch is currently active. Consider deactivating instead of deleting if you might need it later.
                </p>
              </div>
            )}
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">Alternative:</p>
              <p className="text-sm mt-1">
                Instead of deleting, you can deactivate the branch to keep its data while preventing new operations.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/branches/${id}`}>Cancel</Link>
          </Button>
          <DeleteButton deleteAction={handleDelete} />
        </CardFooter>
      </Card>
    </div>
  );
}