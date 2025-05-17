import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteThicknessAction, getThicknessAction } from "@/actions/thicknesses";
import { GetThicknessResponse } from "@/lib/http-service/thicknesses/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeleteButton } from "../../components/delete-button";

interface DeleteThicknessPageProps {
  params: {
    thicknessId: string;
  };
}

export default async function DeleteThicknessPage({ params }: DeleteThicknessPageProps) {
  const thicknessId = parseInt(params.thicknessId, 10);
  
  // Get thickness details first
  const thicknessResponse: APIResponse<GetThicknessResponse> = await getThicknessAction(thicknessId);
  
  // If thickness not found, show 404
  if (!thicknessResponse.success || !thicknessResponse.data) {
    notFound();
  }
  
  const thickness: GetThicknessResponse = thicknessResponse.data;
  
  // Create a form action that uses the existing deleteThicknessAction
  async function handleDelete() {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await deleteThicknessAction(thicknessId);
    
    if (result.success) {
      redirect('/thicknesses?deleted=true');
    } else {
      // If deletion fails, redirect to thicknesses list with error
      redirect(`/thicknesses?error=${encodeURIComponent(result.error || "Failed to delete thickness")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Trash2 className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Delete Thickness</CardTitle>
          <CardDescription>
            You are about to permanently delete thickness "{thickness.thickness} mm".
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>This thickness will be permanently deleted</li>
                <li>Products using this thickness may be affected</li>
                <li>This operation cannot be reversed</li>
              </ul>
            </div>
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">Thickness preview:</p>
              <div className="mt-2">
                <div className="h-6 bg-gray-200 rounded" style={{ width: `${Math.min(thickness.thickness * 10, 100)}%` }}>
                  <div className="h-full bg-primary rounded" style={{ width: '100%' }}></div>
                </div>
                <p className="text-sm mt-1">{thickness.thickness} mm</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/thicknesses/${thicknessId}`}>Cancel</Link>
          </Button>
          <DeleteButton deleteAction={handleDelete} />
        </CardFooter>
      </Card>
    </div>
  );
}