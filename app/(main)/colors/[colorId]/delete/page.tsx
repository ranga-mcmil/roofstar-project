import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteColorAction, getColorAction } from "@/actions/colors";
import { GetColorResponse } from "@/lib/http-service/colors/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeleteButton } from "../../components/delete-button";

interface DeleteColorPageProps {
  params: {
    colorId: string;
  };
}

export default async function DeleteColorPage({ params }: DeleteColorPageProps) {
  const colorId = parseInt(params.colorId, 10);
  
  // Get color details first
  const colorResponse: APIResponse<GetColorResponse> = await getColorAction(colorId);
  
  // If color not found, show 404
  if (!colorResponse.success || !colorResponse.data) {
    notFound();
  }
  
  const color: GetColorResponse = colorResponse.data;
  
  // Create a form action that uses the existing deleteColorAction
  async function handleDelete() {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await deleteColorAction(colorId);
    
    if (result.success) {
      redirect('/colors?deleted=true');
    } else {
      // If deletion fails, redirect to colors list with error
      redirect(`/colors?error=${encodeURIComponent(result.error || "Failed to delete color")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Trash2 className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Delete Color</CardTitle>
          <CardDescription>
            You are about to permanently delete color "{color.name}".
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>This color will be permanently deleted</li>
                <li>Products using this color may be affected</li>
                <li>This operation cannot be reversed</li>
              </ul>
            </div>
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">Color preview:</p>
              <div className="flex items-center gap-2 mt-2">
                <div 
                  className="w-6 h-6 rounded border" 
                  style={{ backgroundColor: color.name.toLowerCase() }}
                ></div>
                <span>{color.name}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/colors/${colorId}`}>Cancel</Link>
          </Button>
          <DeleteButton deleteAction={handleDelete} />
        </CardFooter>
      </Card>
    </div>
  );
}