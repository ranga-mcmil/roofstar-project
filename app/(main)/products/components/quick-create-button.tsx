'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createProductAction } from "@/actions/products";
import { getThicknessesAction } from "@/actions/thicknesses";
import { getColorsAction } from "@/actions/colors";
import { getCategoriesAction } from "@/actions/categories";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

export function QuickCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // State for related data
  const [thicknesses, setThicknesses] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);

  // Initialize form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    price: '',
    thicknessId: '',
    colorId: '',
    productCategoryId: ''
  });

  // Load required data when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        setDataLoading(true);
        try {
          const [thicknessesRes, colorsRes, categoriesRes] = await Promise.all([
            getThicknessesAction(),
            getColorsAction(),
            getCategoriesAction()
          ]);

          if (thicknessesRes.success) setThicknesses(thicknessesRes.data);
          if (colorsRes.success) setColors(colorsRes.data);
          if (categoriesRes.success) setCategories(categoriesRes.data);
        } catch (error) {
          console.error("Error loading form data:", error);
          toast({
            title: "Error",
            description: "Could not load form data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setDataLoading(false);
        }
      };

      loadData();
    }
  }, [isOpen, toast]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Format price while typing
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFormData((prev) => ({ ...prev, price: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert form data to FormData for the action
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('code', formData.code);
      submitData.append('price', formData.price);
      submitData.append('thicknessId', formData.thicknessId);
      submitData.append('colorId', formData.colorId);
      submitData.append('productCategoryId', formData.productCategoryId);

      // Submit to the server action
      const response = await createProductAction(submitData);

      if (response.success) {
        // Show success toast
        toast({
          title: "Product Created",
          description: `Product "${formData.name}" was created successfully.`,
          variant: "default",
        });
        
        // Close modal and reset form
        setIsOpen(false);
        setFormData({
          name: '',
          code: '',
          price: '',
          thicknessId: '',
          colorId: '',
          productCategoryId: ''
        });
        
        // Force a complete page refresh rather than just a router refresh
        window.location.href = window.location.pathname;
      } else {
        // Show error toast
        toast({
          title: "Error creating product",
          description: response.error || "There was a problem creating the product. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error creating product",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format price for display with currency
  const displayPrice = formData.price ? formatCurrency(parseFloat(formData.price), false) : '';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        {dataLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="font-medium">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="code" className="font-medium">Product Code *</Label>
                  <Input
                    id="code"
                    name="code"
                    type="number"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    placeholder="Enter product code"
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price" className="font-medium">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  value={displayPrice}
                  onChange={handlePriceChange}
                  required
                  placeholder="Enter price"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="productCategoryId" className="font-medium">Category *</Label>
                  <Select 
                    name="productCategoryId"
                    value={formData.productCategoryId}
                    onValueChange={(value) => handleSelectChange('productCategoryId', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                
                <div className="grid gap-2">
                  <Label htmlFor="colorId" className="font-medium">Color *</Label>
                  <Select 
                    name="colorId"
                    value={formData.colorId}
                    onValueChange={(value) => handleSelectChange('colorId', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
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
                
                <div className="grid gap-2">
                  <Label htmlFor="thicknessId" className="font-medium">Thickness *</Label>
                  <Select 
                    name="thicknessId"
                    value={formData.thicknessId}
                    onValueChange={(value) => handleSelectChange('thicknessId', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select thickness" />
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
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}