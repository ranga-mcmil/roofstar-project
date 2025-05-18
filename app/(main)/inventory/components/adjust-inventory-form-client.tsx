'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { adjustInventoryAction } from "@/actions/inventory";
import { ProductDTO } from "@/lib/http-service/products/types";
import { Loader2, TrendingUp, TrendingDown, Pencil } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AdjustInventoryFormProps {
  product: ProductDTO;
  returnUrl: string;
  productId: number;
  movementType: string;
}

export function AdjustInventoryFormClient({ 
  product, 
  returnUrl, 
  productId,
  movementType
}: AdjustInventoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Submit to the server action
      const response = await adjustInventoryAction(formData, productId, movementType);

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

  // Handle quantity change and validation
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only positive numbers
    if (!value || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
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
        <Label htmlFor="quantity" className={actionText.color}>
          Quantity to {actionText.title} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          step="any"
          value={quantity}
          onChange={handleQuantityChange}
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
        <Label htmlFor="reason">
          Reason <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="reason"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
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
          disabled={isSubmitting || !quantity || !reason}
          className={`bg-${actionText.color.replace('text-', '')} hover:bg-${actionText.color.replace('text-', '')}-700`}
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