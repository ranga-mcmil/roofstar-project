// app/(main)/productions/components/quick-create-button.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createProductionAction } from "@/actions/productions";
import { getOrdersByBranchAction } from "@/actions/orders"; // Fixed import
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
  const { data: session } = useSession();
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
    if (isOpen && session?.user?.branchId) {
      const loadData = async () => {
        setDataLoading(true);
        try {
          // Load inventory for user's branch from session
          const inventoryRes = await getInventoryByBranchAction(session.user.branchId!);
          if (inventoryRes.success) {
            setInventoryItems(inventoryRes.data.content);
          } else {
            toast({
              title: "Error loading inventory",
              description: inventoryRes.error || "Failed to load inventory items",
              variant: "destructive",
            });
          }

          // Load orders and filter by user's branch
          const ordersRes = await getOrdersByBranchAction(session.user.branchId);
          if (ordersRes.success) {
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

      loadData();
    }
  }, [isOpen, session, toast]);

  // Handle order change
  const handleOrderChange = (orderId: string) => {
    setFormData(prev => ({ ...prev, orderId, inventoryId: "" }));
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
      const submitData = new FormData();
      submitData.append('quantity', formData.quantity);
      submitData.append('remarks', formData.remarks);

      const response = await createProductionAction(
        submitData, 
        parseInt(formData.orderId), 
        parseInt(formData.inventoryId)
      );

      if (response.success) {
        toast({
          title: "Production Record Created",
          description: `Production record was created successfully.`,
          variant: "default",
        });
        
        setIsOpen(false);
        setFormData({
          orderId: '',
          inventoryId: '',
          quantity: '',
          remarks: ''
        });
        setInventoryItems([]);
        setOrders([]);
        
        // Force a complete page refresh
        window.location.href = window.location.pathname;
      } else {
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

  // Don't show button if user has no branch
  if (!session?.user?.branchId) {
    return null;
  }

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
                
                <div className="grid gap-2">
                  <Label htmlFor="inventoryId" className="font-medium">Inventory Item *</Label>
                  <Select 
                    name="inventoryId"
                    value={formData.inventoryId}
                    onValueChange={(value) => handleSelectChange('inventoryId', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select inventory" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No inventory available for your branch
                        </div>
                      ) : (
                        inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.productName} - Batch: {item.batchNumber}
                          </SelectItem>
                        ))
                      )}
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
                disabled={isLoading || !formData.orderId || !formData.inventoryId || !formData.quantity || orders.length === 0 || inventoryItems.length === 0}
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