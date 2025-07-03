"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/actions/products";
import { ProductDTO } from "@/lib/http-service/products/types";
import { Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { ThicknessDTO } from "@/lib/http-service/thicknesses/types";
import { ColorDTO } from "@/lib/http-service/colors/types";
import { ProductCategoryDTO } from "@/lib/http-service/categories/types";
import { MeasurementUnitDTO } from "@/lib/http-service/measurement-units/types";

interface ProductFormProps {
  product?: ProductDTO;
  thicknesses: ThicknessDTO[];
  colors: ColorDTO[];
  categories: ProductCategoryDTO[];
  measurementUnits: MeasurementUnitDTO[];
  returnUrl: string;
  isEditing: boolean;
  selectedCategoryId?: number;
}

export function ProductFormClient({ 
  product, 
  thicknesses, 
  colors, 
  categories,
  measurementUnits,
  returnUrl, 
  isEditing, 
  selectedCategoryId 
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [price, setPrice] = useState<number>(product?.price || 0);
  const [referrablePercentage, setReferrablePercentage] = useState<number>(0);
  const [isReferable, setIsReferable] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Add the checkbox values manually since they might not be in FormData
      if (isReferable) {
        formData.set('isReferable', 'true');
        formData.set('referrablePercentage', referrablePercentage.toString());
      }
      
      // Submit to the server action
      const response = isEditing 
        ? await updateProductAction(formData, product!.id)
        : await createProductAction(formData);

      if (response.success) {
        toast({
          title: isEditing ? "Product updated" : "Product created",
          description: isEditing 
            ? "The product details have been successfully updated."
            : "The new product has been successfully created.",
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || `An error occurred while ${isEditing ? 'updating' : 'creating'} the product.`,
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

  // Handle price change and format as currency
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setPrice(numValue);
    } else {
      setPrice(0);
    }
  };

  // Handle referrable percentage change
  const handleReferrablePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setReferrablePercentage(numValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Product Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={product?.name || ""}
            placeholder="Enter product name (optional)"
          />
          <p className="text-xs text-muted-foreground">
            Product name is optional. If not provided, it will be generated from other attributes.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">
            Product Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            name="code"
            type="number"
            defaultValue={product?.code || ""}
            placeholder="Enter unique product code"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">
          Price <span className="text-red-500">*</span>
        </Label>
        <Input
          id="price"
          name="price"
          value={price ? formatCurrency(price, false) : ''}
          onChange={handlePriceChange}
          placeholder="Enter price"
          required
          className="font-medium"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="productCategoryId">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="productCategoryId"
            defaultValue={
              (product?.productCategoryName 
                ? String(categories.find(c => c.name === product.productCategoryName)?.id) 
                : selectedCategoryId 
                  ? String(selectedCategoryId) 
                  : undefined) || ""
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="colorId">
            Color <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="colorId"
            defaultValue={
              product?.colorName 
                ? String(colors.find(c => c.name === product.colorName)?.id) 
                : ""
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color.id} value={String(color.id)}>
                  {color.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="thicknessId">
            Thickness <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="thicknessId"
            defaultValue={
              product?.thickness 
                ? String(thicknesses.find(t => t.thickness === product.thickness)?.id) 
                : ""
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a thickness" />
            </SelectTrigger>
            <SelectContent>
              {thicknesses.map((thickness) => (
                <SelectItem key={thickness.id} value={String(thickness.id)}>
                  {thickness.thickness} mm
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="unitOfMeasureId">
            Unit of Measure <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="unitOfMeasureId"
            defaultValue={
              product?.unitOfMeasure 
                ? String(measurementUnits.find(u => u.unitOfMeasure === product.unitOfMeasure)?.id) 
                : ""
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {measurementUnits.map((unit) => (
                <SelectItem key={unit.id} value={String(unit.id)}>
                  {unit.unitOfMeasure}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="typeOfProduct">
            Product Type <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="typeOfProduct"
            defaultValue={product?.typeOfProduct || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LENGTH_WIDTH">Length & Width</SelectItem>
              <SelectItem value="WEIGHT">Weight</SelectItem>
              <SelectItem value="UNKNOWN">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Referral Settings */}
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isReferable" 
            checked={isReferable}
            onCheckedChange={(checked) => setIsReferable(checked === true)}
          />
          <Label htmlFor="isReferable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            This product is referable
          </Label>
        </div>
        
        {isReferable && (
          <div className="space-y-2">
            <Label htmlFor="referrablePercentage">
              Referral Percentage <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="referrablePercentage"
                name="referrablePercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={referrablePercentage}
                onChange={handleReferrablePercentageChange}
                placeholder="0.00"
                className="w-32"
                required={isReferable}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Percentage of the product price that will be paid as referral commission.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
}