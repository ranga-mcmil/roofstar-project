'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { adjustInventoryAction } from "@/actions/inventory";
import { ProductDTO } from "@/lib/http-service/products/types";
import { BatchDTO } from "@/lib/http-service/batches/types";
import { Loader2, TrendingUp, TrendingDown, Pencil } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AdjustInventoryFormProps {
  product: ProductDTO;
  returnUrl: string;
  productId: number;
  movementType: string;
  availableBatches: BatchDTO[];
}

export function AdjustInventoryFormClient({ 
  product, 
  returnUrl, 
  productId,
  movementType,
  availableBatches
}: AdjustInventoryFormProps) {
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
      const response = await adjustInventoryAction(formData, productId, parseInt(batchId), movementType);

      if (response.success) {
        const actionText = getActionText();
        toast({
          title: `Inventory ${actionText.title}`,
          description: `Successfully ${actionText.past} ${quantity} units ${actionText.direction} ${product.name}.`,
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || `An error occurred while ${getActionText().gerund} inventory.`,
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

  // Get appropriate text based on movement type
  const getActionText = () => {
    switch (movementType) {
      case 'add':
        return {
          title: 'Addition',
          past: 'added',
          gerund: 'adding',
          direction: 'to',
          icon: <TrendingUp className="h-5 w-5" />,
          color: 'text-green-600',
          description: 'Adding inventory will increase the available stock for this product.'
        };
      case 'remove':
        return {
          title: 'Reduction',
          past: 'removed',
          gerund: 'removing',
          direction: 'from',
          icon: <TrendingDown className="h-5 w-5" />,
          color: 'text-red-600',
          description: 'Removing inventory will decrease the available stock for this product.'
        };
      case 'correct':
        return {
          title: 'Correction',
          past: 'corrected',
          gerund: 'correcting',
          direction: 'for',
          icon: <Pencil className="h-5 w-5" />,
          color: 'text-blue-600',
          description: 'Correcting inventory will adjust the stock count to fix discrepancies.'
        };
      default:
        return {
          title: 'Adjustment',
          past: 'adjusted',
          gerund: 'adjusting',
          direction: 'for',
          icon: <Pencil className="h-5 w-5" />,
          color: 'text-blue-600',
          description: 'Adjusting inventory will modify the available stock for this product.'
        };
    }
  };

  // Handle numeric input changes
  const handleNumericChange = (value: string, setter: (value: string) => void) => {
    // Allow only positive numbers
    if (!value || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const actionText = getActionText();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className={`border-l-4 border-l-${actionText.color.replace('text-', '')}`}>
        <div className="flex items-center gap-2">
          {actionText.icon}
          <AlertTitle>Inventory {actionText.title}</AlertTitle>
        </div>
        <AlertDescription>
          {actionText.description} Current stock: {product.stockQuantity || 0} units.
        </AlertDescription>
      </Alert>

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
          Select the batch for this inventory adjustment.
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
        <Label htmlFor="quantity" className={actionText.color}>
          Quantity to {actionText.title} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          step="any"
          value={quantity}
          onChange={(e) => handleNumericChange(e.target.value, setQuantity)}
          placeholder={`Enter quantity to ${actionText.past.toLowerCase()}`}
          required
          min="0.01"
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          Enter the quantity of units to {actionText.past.toLowerCase()}.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">
          Reason <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="remarks"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder={`Explain why you are ${actionText.gerund} inventory`}
          className="h-32 resize-none"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !quantity || !remarks || !batchId}
          className={actionText.color === 'text-green-600' ? 'bg-green-600 hover:bg-green-700' : 
                     actionText.color === 'text-red-600' ? 'bg-red-600 hover:bg-red-700' : 
                     'bg-blue-600 hover:bg-blue-700'}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `${actionText.title} Inventory`
          )}
        </Button>
      </div>
    </form>
  );
}