"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  color: string
  gauge: string
  length: number
}

const products: Product[] = [
  {
    id: "ibr-1",
    name: "IBR 0.47mm - Charcoal",
    price: 36.0,
    image: "/placeholder.svg?height=100&width=200",
    category: "ibr",
    color: "Charcoal",
    gauge: "0.47mm",
    length: 3.6,
  },
  {
    id: "ibr-2",
    name: "IBR 0.53mm - Galvanized",
    price: 45.0,
    image: "/placeholder.svg?height=100&width=200",
    category: "ibr",
    color: "Galvanized",
    gauge: "0.53mm",
    length: 3.6,
  },
  {
    id: "ibr-3",
    name: "IBR 0.58mm - Forest Green",
    price: 50.0,
    image: "/placeholder.svg?height=100&width=200",
    category: "ibr",
    color: "Forest Green",
    gauge: "0.58mm",
    length: 3.6,
  },
  {
    id: "ibr-4",
    name: "IBR 0.47mm - White",
    price: 38.0,
    image: "/placeholder.svg?height=100&width=200",
    category: "ibr",
    color: "White",
    gauge: "0.47mm",
    length: 3.6,
  },
  {
    id: "ibr-5",
    name: "IBR 0.53mm - Blue",
    price: 47.0,
    image: "/placeholder.svg?height=100&width=200",
    category: "ibr",
    color: "Blue",
    gauge: "0.53mm",
    length: 3.6,
  },
  {
    id: "ibr-6",
    name: "IBR 0.58mm - Brick Red",
    price: 52.0,
    image: "/placeholder.svg?height=100&width=200",
    category: "ibr",
    color: "Brick Red",
    gauge: "0.58mm",
    length: 3.6,
  },
  {
    id: "acc-1",
    name: "Ridge Cap - Galvanized",
    price: 15.0,
    image: "/placeholder.svg?height=100&width=200",
    category: "accessories",
    color: "Galvanized",
    gauge: "0.47mm",
    length: 1.8,
  },
  {
    id: "acc-2",
    name: "Flashing - Charcoal",
    price: 12.0,
    image: "/placeholder.svg?height=100&width=200",
    category: "accessories",
    color: "Charcoal",
    gauge: "0.47mm",
    length: 1.8,
  },
  {
    id: "fast-1",
    name: "Roofing Screws (100 pack)",
    price: 25.0,
    image: "/placeholder.svg?height=100&width=200",
    category: "fasteners",
    color: "Galvanized",
    gauge: "N/A",
    length: 0,
  },
]

interface POSProductGridProps {
  category?: string
  searchQuery?: string
  onAddToCart?: (product: Product) => void
  disableAddToCart?: boolean
}

export function POSProductGrid({
  category,
  searchQuery = "",
  onAddToCart,
  disableAddToCart = false,
}: POSProductGridProps) {
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({})

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    // First filter by category if specified
    if (category && product.category !== category) {
      return false
    }

    // Then filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        product.name.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.color.toLowerCase().includes(query) ||
        product.gauge.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleAddToCart = (product: Product) => {
    setAddedToCart((prev) => ({
      ...prev,
      [product.id]: true,
    }))

    // Call the callback if provided
    if (onAddToCart) {
      onAddToCart(product)
    }

    // Reset the button state after a short delay
    setTimeout(() => {
      setAddedToCart((prev) => ({
        ...prev,
        [product.id]: false,
      }))
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No products found. Try adjusting your search.
        </div>
      ) : (
        filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-[2/1] relative bg-muted">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-sm">{product.name}</h3>
              <div className="mt-1 text-xs text-muted-foreground">
                {product.gauge} • {product.length > 0 ? `${product.length}m` : "N/A"}
              </div>
              <div className="mt-2 font-bold">${product.price.toFixed(2)}</div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => handleAddToCart(product)}
                variant="default"
                className="w-full"
                disabled={disableAddToCart || addedToCart[product.id]}
                title={disableAddToCart ? "Cannot modify cart when an invoice is referenced" : ""}
              >
                {addedToCart[product.id] ? (
                  "Added"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}
