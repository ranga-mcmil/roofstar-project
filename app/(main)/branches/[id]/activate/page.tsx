import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { activateBranchAction, getBranchAction } from "@/actions/branches";
import { GetBranchResponse } from "@/lib/http-service/branches/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { ActivateButton } from "../../components/activate-button";

interface ActivateBranchPageProps {
  params: {
    id: string;
  };
}

export default async function ActivateBranchPage({ params }: ActivateBranchPageProps) {
  const { id } = params;
  
  // Get branch details first
  const branchResponse: APIResponse<GetBranchResponse> = await getBranchAction(id);
  
  // If branch not found, show 404
  if (!branchResponse.success || !branchResponse.data) {
    notFound();
  }
  
  const branch: GetBranchResponse = branchResponse.data;
  
  // If branch is already active, redirect to branch details page
  if (branch.isActive) {
    redirect(`/branches/${id}`);
  }
  
  // Server action to handle form submission
  async function activateBranch(formData: FormData) {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result: APIResponse<Record<string, string>> = await activateBranchAction(id);
    
    if (result.success) {
      redirect(`/branches/${id}`);
    }
    
    // If activation fails, we'll show the error on the branch details page
    redirect(`/branches/${id}?error=${encodeURIComponent(result.error || "Failed to activate branch")}`);
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
          <CardTitle className="text-2xl">Activate Branch</CardTitle>
          <CardDescription>
            You are about to activate branch "{branch.name}".
            Activating will make this branch available for operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-green-50 text-green-800 rounded-md">
              <p className="font-medium">Activation will:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Allow products to be allocated to this branch</li>
                <li>Enable inventory operations for this branch</li>
                <li>Make the branch visible in active branch listings</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/branches/${id}`}>Cancel</Link>
          </Button>
          <ActivateButton activateAction={activateBranch} />
        </CardFooter>
      </Card>
    </div>
  );
}
