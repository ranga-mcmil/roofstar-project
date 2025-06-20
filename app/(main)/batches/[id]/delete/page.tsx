import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteBatchAction, getBatchAction } from "@/actions/batches";
import { GetBatchResponse } from "@/lib/http-service/batches/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeleteButton } from "../../components/delete-button";

interface DeleteBatchPageProps {
  params: {
    id: string;
  };
}

export default async function DeleteBatchPage({ params }: DeleteBatchPageProps) {
  const id = parseInt(params.id, 10);
  
  // Get batch details first
  const batchResponse: APIResponse<GetBatchResponse> = await getBatchAction(id);
  
  // If batch not found, show 404
  if (!batchResponse.success || !batchResponse.data) {
    notFound();
  }
  
  const batch: GetBatchResponse = batchResponse.data;
  
  // Create a form action that uses the existing deleteBatchAction
  async function handleDelete() {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await deleteBatchAction(id);
    
    if (result.success) {
      redirect('/batches?deleted=true');
    } else {
      // If deletion fails, redirect to batches list with error
      redirect(`/batches?error=${encodeURIComponent(result.error || "Failed to delete batch")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Trash2 className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Delete Batch</CardTitle>
          <CardDescription>
            You are about to permanently delete batch "{batch.batchNumber}".
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All batch information will be permanently deleted</li>
                <li>This batch will no longer appear in reports</li>
                <li>All inventory records for this batch will be affected</li>
                <li>All production records linked to this batch will be affected</li>
                <li>This operation cannot be reversed</li>
              </ul>
            </div>
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">Alternative:</p>
              <p className="text-sm mt-1">
                Consider archiving the batch instead of deleting it to maintain data integrity and historical records.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/batches/${id}`}>Cancel</Link>
          </Button>
          <DeleteButton deleteAction={handleDelete} />
        </CardFooter>
      </Card>
    </div>
  );
}