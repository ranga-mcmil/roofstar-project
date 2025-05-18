import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getProductAction } from "@/actions/products"
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
          />
        </Card>
      </main>
    </div>
  )
}