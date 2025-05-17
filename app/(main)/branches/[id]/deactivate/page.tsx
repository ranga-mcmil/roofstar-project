import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deactivateBranchAction, getBranchAction } from "@/actions/branches";
import { GetBranchResponse } from "@/lib/http-service/branches/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeactivateButton } from "../../components/deactivate-button";

interface DeactivateBranchPageProps {
  params: {
    id: string;
  };
}

export default async function DeactivateBranchPage({ params }: DeactivateBranchPageProps) {
  const { id } = params;
  
  // Get branch details first
  const branchResponse: APIResponse<GetBranchResponse> = await getBranchAction(id);
  
  // If branch not found, show 404
  if (!branchResponse.success || !branchResponse.data) {
    notFound();
  }
  
  const branch: GetBranchResponse = branchResponse.data;
  
  // If branch is already inactive, redirect to branch details page
  if (!branch.isActive) {
    redirect(`/branches/${id}`);
  }
  
  // Server action to handle form submission
  async function deactivateBranch(formData: FormData) {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result: APIResponse<Record<string, string>> = await deactivateBranchAction(id);
    
    if (result.success) {
      redirect(`/branches/${id}`);
    }
    
    // If deactivation fails, we'll show the error on the branch details page
    redirect(`/branches/${id}?error=${encodeURIComponent(result.error || "Failed to deactivate branch")}`);
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-2" />
          <CardTitle className="text-2xl">Deactivate Branch</CardTitle>
          <CardDescription>
            You are about to deactivate branch "{branch.name}".
            Deactivating will prevent new operations for this branch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-amber-50 text-amber-800 rounded-md">
              <p className="font-medium">Deactivation will:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Prevent new products from being allocated to this branch</li>
                <li>Disable inventory additions for this branch</li>
                <li>Remove the branch from active branch listings</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">Note:</p>
              <p className="text-sm mt-1">
                Existing inventory and product records will be preserved. 
                You can reactivate this branch later if needed.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/branches/${id}`}>Cancel</Link>
          </Button>
          <DeactivateButton deactivateAction={deactivateBranch} />
        </CardFooter>
      </Card>
    </div>
  );
}
