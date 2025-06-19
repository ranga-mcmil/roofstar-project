'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addInventoryAction } from "@/actions/inventory";
import { ProductDTO } from "@/lib/http-service/products/types";
import { BatchDTO } from "@/lib/http-service/batches/types";
import { Loader2 } from "lucide-react";

interface AddInventoryFormProps {
  product: ProductDTO;
  returnUrl: string;
  productId: number;
  availableBatches: BatchDTO[];
}

export function AddInventoryFormClient({ 
  product, 
  returnUrl, 
  productId,
  availableBatches
}: AddInventoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [batchId, setBatchId] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!batchId) {
      toast({
        title: "Error",
        description: "Please select a batch.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Submit to the server action with batchId
      const response = await addInventoryAction(formData, productId, parseInt(batchId));

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

  // Handle numeric input changes
  const handleNumericChange = (value: string, setter: (value: string) => void) => {
    // Allow only positive numbers
    if (!value || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="batchId">
          Batch <span className="text-red-500">*</span>
        </Label>
        <Select name="batchId" value={batchId} onValueChange={setBatchId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a batch" />
          </SelectTrigger>
          <SelectContent>
            {availableBatches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id.toString()}>
                {batch.batchNumber} {batch.description && `- ${batch.description}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Select the batch for this inventory addition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">
            Length
          </Label>
          <Input
            id="length"
            name="length"
            type="number"
            step="any"
            value={length}
            onChange={(e) => handleNumericChange(e.target.value, setLength)}
            placeholder="Enter length"
            min="0"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="width">
            Width
          </Label>
          <Input
            id="width"
            name="width"
            type="number"
            step="any"
            value={width}
            onChange={(e) => handleNumericChange(e.target.value, setWidth)}
            placeholder="Enter width"
            min="0"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">
            Weight
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="any"
            value={weight}
            onChange={(e) => handleNumericChange(e.target.value, setWeight)}
            placeholder="Enter weight"
            min="0"
            className="w-full"
          />
        </div>
      </div>

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
          onChange={(e) => handleNumericChange(e.target.value, setQuantity)}
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
        <Button type="submit" disabled={isSubmitting || !quantity || !batchId}>
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