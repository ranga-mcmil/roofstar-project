"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

const initialItems: CartItem[] = [
  {
    id: "ibr-1",
    name: "IBR 0.47mm - Charcoal",
    price: 36.0,
    quantity: 10,
  },
  {
    id: "ibr-2",
    name: "IBR 0.53mm - Galvanized",
    price: 45.0,
    quantity: 15,
  },
  {
    id: "fast-1",
    name: "Roofing Screws (100 pack)",
    price: 25.0,
    quantity: 2,
  },
]

export function POSCart() {
  const [items, setItems] = useState<CartItem[]>(initialItems)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">No items in cart</div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex items-center justify-between pb-4 border-b">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{item.name}</h4>
              <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
                <span className="sr-only">Decrease</span>
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                className="h-8 w-16 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
                <span className="sr-only">Increase</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
