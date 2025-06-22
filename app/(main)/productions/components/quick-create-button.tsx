'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createProductionAction } from "@/actions/productions";
import { getAllOrdersAction } from "@/actions/orders";
import { getInventoryByBranchAction } from "@/actions/inventory";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function QuickCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // State for related data
  const [orders, setOrders] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  // Initialize form state
  const [formData, setFormData] = useState({
    orderId: '',
    inventoryId: '',
    quantity: '',
    remarks: ''
  });

  // Load required data when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        setDataLoading(true);
        try {
          const ordersRes = await getAllOrdersAction({ pageSize: 100 });
          if (ordersRes.success) setOrders(ordersRes.data.content);
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

  // Handle order change - load inventory for the selected order's branch
  const handleOrderChange = async (orderId: string) => {
    setFormData(prev => ({ ...prev, orderId, inventoryId: "" }));
    
    const selectedOrder = orders.find(o => o.id === parseInt(orderId));
    if (selectedOrder && selectedOrder.branchId) {
      try {
        const inventoryRes = await getInventoryByBranchAction(selectedOrder.branchId);
        if (inventoryRes.success) {
          setInventoryItems(inventoryRes.data.content);
        }
      } catch (error) {
        console.error("Error loading inventory:", error);
        toast({
          title: "Error",
          description: "Could not load inventory for this order.",
          variant: "destructive",
        });
      }
    } else {
      setInventoryItems([]);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    if (name === "orderId") {
      handleOrderChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert form data to FormData for the action
      const submitData = new FormData();
      submitData.append('quantity', formData.quantity);
      submitData.append('remarks', formData.remarks);

      // Submit to the server action
      const response = await createProductionAction(
        submitData, 
        parseInt(formData.orderId), 
        parseInt(formData.inventoryId)
      );

      if (response.success) {
        // Show success toast
        toast({
          title: "Production Record Created",
          description: `Production record was created successfully.`,
          variant: "default",
        });
        
        // Close modal and reset form
        setIsOpen(false);
        setFormData({
          orderId: '',
          inventoryId: '',
          quantity: '',
          remarks: ''
        });
        setInventoryItems([]);
        
        // Force a complete page refresh rather than just a router refresh
        window.location.href = window.location.pathname;
      } else {
        // Show error toast
        toast({
          title: "Error creating production record",
          description: response.error || "There was a problem creating the production record. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating production record:", error);
      toast({
        title: "Error creating production record",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> New Production
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Production Record</DialogTitle>
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
                  <Label htmlFor="orderId" className="font-medium">Order *</Label>
                  <Select 
                    name="orderId"
                    value={formData.orderId}
                    onValueChange={(value) => handleSelectChange('orderId', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={String(order.id)}>
                          {order.orderNumber} - {order.customerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="inventoryId" className="font-medium">Inventory Item *</Label>
                  <Select 
                    name="inventoryId"
                    value={formData.inventoryId}
                    onValueChange={(value) => handleSelectChange('inventoryId', value)}
                    disabled={isLoading || !formData.orderId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !formData.orderId 
                          ? "Select order first" 
                          : "Select inventory"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.productName} - Batch: {item.batchNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="quantity" className="font-medium">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  placeholder="Enter quantity"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="remarks" className="font-medium">Remarks</Label>
                <Textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks (optional)"
                  className="w-full"
                  disabled={isLoading}
                  rows={3}
                />
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
                disabled={isLoading || !formData.orderId || !formData.inventoryId || !formData.quantity}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Production Record'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}