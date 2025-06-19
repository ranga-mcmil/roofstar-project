import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getProductAction } from "@/actions/products"
import { getBatchesAction } from "@/actions/batches"
import { GetProductResponse } from "@/lib/http-service/products/types"
import { AdjustInventoryFormClient } from "@/app/(main)/inventory/components/adjust-inventory-form-client"

interface AdjustInventoryPageProps {
  params: {
    productId: string,
    movementType: string
  }
}

export default async function AdjustInventoryPage({ params }: AdjustInventoryPageProps) {
  const { productId: productIdStr, movementType } = params;
  const productId = parseInt(productIdStr, 10);

  // Validate movement type
  if (movementType !== 'add' && movementType !== 'remove' && movementType !== 'correct') {
    redirect(`/inventory/products/${productId}/history`);
  }

  // Fetch product data
  const productResponse = await getProductAction(productId);
  
  // If product not found, return 404
  if (!productResponse.success || !productResponse.data) {
    notFound();
  }

  const product = productResponse.data as GetProductResponse;

  // Fetch available batches for the product's branch
  const batchesResponse = await getBatchesAction({ 
    branchId: product.branchId,
    pageSize: 100 // Get all batches for this branch
  });
  
  const availableBatches = batchesResponse.success ? batchesResponse.data.content : [];

  // Format movement type for display
  const getMovementTitle = () => {
    switch (movementType) {
      case 'add':
        return 'Add Inventory';
      case 'remove':
        return 'Remove Inventory';
      case 'correct':
        return 'Correct Inventory';
      default:
        return 'Adjust Inventory';
    }
  };

  // If no batches available, show error
  if (availableBatches.length === 0) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/inventory/products/${productId}/history`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {getMovementTitle()}: {product.name}
              </h1>
              <p className="text-muted-foreground">
                Current Stock: {product.stockQuantity || 0} units | Product Code: {product.code}
              </p>
            </div>
          </div>

          <Card className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No Batches Available</h3>
              <p className="text-muted-foreground mb-4">
                No batches are available for this product's branch. Please create a batch first.
              </p>
              <Button asChild>
                <Link href={`/branches/${product.branchId}/batches/create`}>
                  Create Batch
                </Link>
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/inventory/products/${productId}/history`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {getMovementTitle()}: {product.name}
            </h1>
            <p className="text-muted-foreground">
              Current Stock: {product.stockQuantity || 0} units | Product Code: {product.code}
            </p>
          </div>
        </div>

        <Card className="p-6">
          <AdjustInventoryFormClient
            product={product}
            returnUrl={`/inventory/products/${productId}/history`}
            productId={productId}
            movementType={movementType}
            availableBatches={availableBatches}
          />
        </Card>
      </main>
    </div>
  )
}