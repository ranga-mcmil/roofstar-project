import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteCategoryAction, getCategoryAction } from "@/actions/categories";
import { GetCategoryResponse } from "@/lib/http-service/categories/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeleteButton } from "../../components/delete-button";

interface DeleteCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function DeleteCategoryPage({ params }: DeleteCategoryPageProps) {
  const id = parseInt(params.id, 10);
  
  // Get category details first
  const categoryResponse: APIResponse<GetCategoryResponse> = await getCategoryAction(id);
  
  // If category not found, show 404
  if (!categoryResponse.success || !categoryResponse.data) {
    notFound();
  }
  
  const category: GetCategoryResponse = categoryResponse.data;
  
  // Create a form action that uses the existing deleteCategoryAction
  async function handleDelete() {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await deleteCategoryAction(id);
    
    if (result.success) {
      redirect('/categories?deleted=true');
    } else {
      // If deletion fails, redirect to categories list with error
      redirect(`/categories?error=${encodeURIComponent(result.error || "Failed to delete category")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Trash2 className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Delete Category</CardTitle>
          <CardDescription>
            You are about to permanently delete category "{category.name}".
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All category information will be permanently deleted</li>
                <li>Products assigned to this category may be affected</li>
                <li>This category will no longer appear in reports</li>
                <li>This operation cannot be reversed</li>
              </ul>
            </div>
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">Recommendation:</p>
              <p className="text-sm mt-1">
                Before deleting, ensure that no products are dependent on this category.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/categories/${id}`}>Cancel</Link>
          </Button>
          <DeleteButton deleteAction={handleDelete} />
        </CardFooter>
      </Card>
    </div>
  );
}