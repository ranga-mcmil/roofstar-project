'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addInventoryAction } from "@/actions/inventory";
import { ProductDTO } from "@/lib/http-service/products/types";
import { Loader2 } from "lucide-react";

interface AddInventoryFormProps {
  product: ProductDTO;
  returnUrl: string;
  productId: number;
}

export function AddInventoryFormClient({ 
  product, 
  returnUrl, 
  productId
}: AddInventoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Submit to the server action
      const response = await addInventoryAction(formData, productId);

      if (response.success) {
        toast({
          title: "Inventory Added",
          description: `Successfully added ${quantity} units to ${product.name}.`,
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || "An error occurred while adding inventory.",
          variant: "destructive",
        });
        
        // If there are field errors, we could display them inline
        if (response.fieldErrors) {
          console.error("Field errors:", response.fieldErrors);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle quantity change and validation
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only positive numbers
    if (!value || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="quantity">
          Quantity to Add <span className="text-red-500">*</span>
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          step="any"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Enter quantity to add"
          required
          min="0.01"
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          Enter the quantity of units to add to inventory. Current stock: {product.stockQuantity || 0} units.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">
          Remarks
        </Label>
        <Textarea
          id="remarks"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter any additional notes or remarks about this inventory addition"
          className="h-32 resize-none"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !quantity}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Inventory'
          )}
        </Button>
      </div>
    </form>
  );
}