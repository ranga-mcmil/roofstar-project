import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteProductAction, getProductAction } from "@/actions/products";
import { GetProductResponse } from "@/lib/http-service/products/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeleteButton } from "../../components/delete-button";

interface DeleteProductPageProps {
  params: {
    id: string;
  };
}

export default async function DeleteProductPage({ params }: DeleteProductPageProps) {
  const id = parseInt(params.id, 10);
  
  // Get product details first
  const productResponse: APIResponse<GetProductResponse> = await getProductAction(id);
  
  // If product not found, show 404
  if (!productResponse.success || !productResponse.data) {
    notFound();
  }
  
  const product: GetProductResponse = productResponse.data;
  
  // Create a form action that uses the existing deleteProductAction
  async function handleDelete() {
    "use server";
    
    // Simulate a delay to show the loading state (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await deleteProductAction(id);
    
    if (result.success) {
      redirect('/products?deleted=true');
    } else {
      // If deletion fails, redirect to products list with error
      redirect(`/products?error=${encodeURIComponent(result.error || "Failed to delete product")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Trash2 className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Delete Product</CardTitle>
          <CardDescription>
            You are about to permanently delete product "{product.name}".
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All product information will be permanently deleted</li>
                <li>This product will no longer appear in reports</li>
                <li>All inventory records for this product will be affected</li>
                <li>This operation cannot be reversed</li>
              </ul>
            </div>
            
            {product.stockQuantity > 0 && (
              <div className="p-3 bg-amber-50 text-amber-800 rounded-md mt-2">
                <p className="font-medium">Inventory Warning</p>
                <p className="text-sm mt-1">
                  This product has {product.stockQuantity} units in stock. Deleting it will remove these items from your inventory.
                </p>
              </div>
            )}
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">Alternative:</p>
              <p className="text-sm mt-1">
                Instead of deleting, you may want to mark the product as inactive to keep its data for reference.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/products/${id}`}>Cancel</Link>
          </Button>
          <DeleteButton deleteAction={handleDelete} />
        </CardFooter>
      </Card>
    </div>
  );
}