import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteMeasurementUnitAction, getMeasurementUnitAction } from "@/actions/measurement-units";
import { GetMeasurementUnitResponse } from "@/lib/http-service/measurement-units/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeleteButton } from "../../components/delete-button";

interface DeleteMeasurementUnitPageProps {
  params: {
    id: string;
  };
}

export default async function DeleteMeasurementUnitPage({ params }: DeleteMeasurementUnitPageProps) {
  const id = parseInt(params.id, 10);
  
  // Get measurement unit details first
  const measurementUnitResponse: APIResponse<GetMeasurementUnitResponse> = await getMeasurementUnitAction(id);
  
  // If measurement unit not found, show 404
  if (!measurementUnitResponse.success || !measurementUnitResponse.data) {
    notFound();
  }
  
  const measurementUnit: GetMeasurementUnitResponse = measurementUnitResponse.data;
  
  // Create a form action that uses the existing deleteMeasurementUnitAction
  async function handleDelete() {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await deleteMeasurementUnitAction(id);
    
    if (result.success) {
      redirect('/measurement-units?deleted=true');
    } else {
      // If deletion fails, redirect to measurement units list with error
      redirect(`/measurement-units?error=${encodeURIComponent(result.error || "Failed to delete measurement unit")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Trash2 className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Delete Measurement Unit</CardTitle>
          <CardDescription>
            You are about to permanently delete the measurement unit "{measurementUnit.unitOfMeasure}".
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All measurement unit information will be permanently deleted</li>
                <li>Products using this unit may be affected</li>
                <li>This unit will no longer be available for new products</li>
                <li>This operation cannot be reversed</li>
              </ul>
            </div>
            
            <div className="p-3 bg-amber-50 text-amber-800 rounded-md mt-2">
              <p className="font-medium">Products Impact</p>
              <p className="text-sm mt-1">
                Check if any products are using this measurement unit before deleting it. 
                Deleting a unit that's in use may cause issues with product management.
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">Alternative:</p>
              <p className="text-sm mt-1">
                Consider creating a replacement measurement unit before deleting this one 
                to ensure continuity in your product catalog.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/measurement-units/${id}`}>Cancel</Link>
          </Button>
          <DeleteButton deleteAction={handleDelete} />
        </CardFooter>
      </Card>
    </div>
  );
}