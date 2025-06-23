// app/(main)/productions/components/production-form-client.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createProductionAction } from "@/actions/productions";
import { getAllOrdersAction, getOrdersByBranchAction } from "@/actions/orders";
import { getInventoryByBranchAction } from "@/actions/inventory";
import { Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ProductionFormProps {
  returnUrl: string;
  isEditing: boolean;
  selectedOrderId?: number;
  selectedInventoryId?: number;
}

export function ProductionFormClient({ 
  returnUrl, 
  isEditing, 
  selectedOrderId,
  selectedInventoryId
}: ProductionFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // State for related data
  const [orders, setOrders] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    orderId: selectedOrderId ? String(selectedOrderId) : "",
    inventoryId: selectedInventoryId ? String(selectedInventoryId) : "",
    quantity: "",
    remarks: ""
  });

  // Load required data
  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.branchId) {
        toast({
          title: "Error",
          description: "You are not assigned to a branch. Please contact your administrator.",
          variant: "destructive",
        });
        setDataLoading(false);
        return;
      }

      setDataLoading(true);
      try {
        // Load inventory for user's branch from session
        const inventoryRes = await getInventoryByBranchAction(session.user.branchId);
        if (inventoryRes.success) {
          setInventoryItems(inventoryRes.data.content);
        } else {
          toast({
            title: "Error loading inventory",
            description: inventoryRes.error || "Failed to load inventory items",
            variant: "destructive",
          });
        }

        // Load orders (optionally filter by user's branch)
        const ordersRes = await getOrdersByBranchAction(session.user.branchId);
        if (ordersRes.success) {
          // Filter orders to only show orders for the user's branch
          const userBranchOrders = ordersRes.data.content
          setOrders(userBranchOrders);
        } else {
          toast({
            title: "Error loading orders",
            description: ordersRes.error || "Failed to load orders",
            variant: "destructive",
          });
        }
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

    if (session) {
      loadData();
    }
  }, [session, selectedOrderId, toast]);

  // Handle order change
  const handleOrderChange = (orderId: string) => {
    setFormData(prev => ({ ...prev, orderId, inventoryId: "" }));
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    if (name === "orderId") {
      handleOrderChange(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append('quantity', formData.quantity);
      submitFormData.append('remarks', formData.remarks);
      
      const response = await createProductionAction(
        submitFormData, 
        parseInt(formData.orderId), 
        parseInt(formData.inventoryId)
      );

      if (response.success) {
        toast({
          title: "Production record created",
          description: "The production record has been successfully created.",
        });
        router.push(returnUrl);
      } else {
        toast({
          title: "Error",
          description: response.error || "An error occurred while creating the production record.",
          variant: "destructive",
        });
        
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

  // Show loading if session is not loaded yet
  if (!session) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading session...</span>
      </div>
    );
  }

  // Show error if user has no branch
  if (!session?.user?.branchId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You are not assigned to a branch. Please contact your administrator.</p>
        <Button variant="outline" onClick={() => router.push(returnUrl)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading form data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="orderId">
            Order <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="orderId"
            value={formData.orderId}
            onValueChange={(value) => handleSelectChange('orderId', value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              {orders.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No orders available for your branch
                </div>
              ) : (
                orders.map((order) => (
                  <SelectItem key={order.id} value={String(order.id)}>
                    {order.orderNumber} - {order.customerName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inventoryId">
            Inventory Item <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="inventoryId"
            value={formData.inventoryId}
            onValueChange={(value) => handleSelectChange('inventoryId', value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select inventory item" />
            </SelectTrigger>
            <SelectContent>
              {inventoryItems.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No inventory available for your branch
                </div>
              ) : (
                inventoryItems.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.productName} - Batch: {item.batchNumber} (Qty: {item.quantity})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">
          Quantity <span className="text-red-500">*</span>
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter production quantity"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Enter production remarks (optional)"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || orders.length === 0 || inventoryItems.length === 0}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Production Record'
          )}
        </Button>
      </div>
    </form>
  );
}
