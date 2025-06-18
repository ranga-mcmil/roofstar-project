// lib/actions/dashboard-actions.ts
"use server"

import { unstable_cache } from 'next/cache'

export interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  sales: number
  salesChange: number
  customers: number
  customersChange: number
  inventoryValue: number
  inventoryChange: number
}

export interface PopularProduct {
  id: string
  name: string
  sheets: number
  sales: number
}

export interface LowStockItem {
  id: string
  name: string
  stock: number
  reorderPoint: number
  status: 'critical' | 'low'
}

export interface RecentSale {
  id: string
  customerName: string
  email: string
  amount: number
  initials: string
}

export interface ChartData {
  name: string
  total: number
}

// Cache dashboard stats for 5 minutes
export const getDashboardStats = unstable_cache(
  async (): Promise<DashboardStats> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // In a real app, this would fetch from your database
      return {
        totalRevenue: 45231.89,
        revenueChange: 20.1,
        sales: 2350,
        salesChange: 10.1,
        customers: 573,
        customersChange: 19,
        inventoryValue: 12234,
        inventoryChange: 4
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw new Error('Failed to fetch dashboard statistics')
    }
  },
  ['dashboard-stats'],
  { revalidate: 300 } // 5 minutes
)

// Cache chart data for 1 hour
export const getChartData = unstable_cache(
  async (): Promise<ChartData[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return [
        { name: "Jan", total: 4000 },
        { name: "Feb", total: 3000 },
        { name: "Mar", total: 2000 },
        { name: "Apr", total: 2780 },
        { name: "May", total: 1890 },
        { name: "Jun", total: 2390 },
        { name: "Jul", total: 3490 },
        { name: "Aug", total: 4000 },
        { name: "Sep", total: 5000 },
        { name: "Oct", total: 4500 },
        { name: "Nov", total: 5500 },
        { name: "Dec", total: 6000 },
      ]
    } catch (error) {
      console.error('Error fetching chart data:', error)
      throw new Error('Failed to fetch chart data')
    }
  },
  ['chart-data'],
  { revalidate: 3600 } // 1 hour
)

// Cache recent sales for 2 minutes
export const getRecentSales = unstable_cache(
  async (): Promise<RecentSale[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return [
        {
          id: "1",
          customerName: "John Doe Construction",
          email: "john.doe@example.com",
          amount: 1999.00,
          initials: "JD"
        },
        {
          id: "2",
          customerName: "Smith Developments",
          email: "smith@example.com",
          amount: 3499.00,
          initials: "SD"
        },
        {
          id: "3",
          customerName: "Roberts Builders",
          email: "roberts@example.com",
          amount: 2299.00,
          initials: "RB"
        },
        {
          id: "4",
          customerName: "Johnson & Miller",
          email: "info@johnsonmiller.com",
          amount: 5699.00,
          initials: "JM"
        },
        {
          id: "5",
          customerName: "City Projects Ltd",
          email: "contact@cityprojects.com",
          amount: 1429.00,
          initials: "CP"
        }
      ]
    } catch (error) {
      console.error('Error fetching recent sales:', error)
      throw new Error('Failed to fetch recent sales')
    }
  },
  ['recent-sales'],
  { revalidate: 120 } // 2 minutes
)

// Cache popular products for 30 minutes
export const getPopularProducts = unstable_cache(
  async (): Promise<PopularProduct[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return [
        {
          id: "ibr-1",
          name: "IBR 0.47mm - Charcoal",
          sheets: 432,
          sales: 15552
        },
        {
          id: "ibr-2",
          name: "IBR 0.53mm - Galvanized",
          sheets: 287,
          sales: 12915
        },
        {
          id: "ibr-3",
          name: "IBR 0.58mm - Forest Green",
          sheets: 198,
          sales: 9900
        }
      ]
    } catch (error) {
      console.error('Error fetching popular products:', error)
      throw new Error('Failed to fetch popular products')
    }
  },
  ['popular-products'],
  { revalidate: 1800 } // 30 minutes
)

// Cache low stock items for 5 minutes (more frequent updates needed)
export const getLowStockItems = unstable_cache(
  async (): Promise<LowStockItem[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return [
        {
          id: "ibr-6",
          name: "IBR 0.58mm - Brick Red",
          stock: 5,
          reorderPoint: 15,
          status: 'critical'
        },
        {
          id: "ibr-4",
          name: "IBR 0.47mm - White",
          stock: 12,
          reorderPoint: 20,
          status: 'low'
        },
        {
          id: "ibr-5",
          name: "IBR 0.53mm - Blue",
          stock: 18,
          reorderPoint: 25,
          status: 'low'
        }
      ]
    } catch (error) {
      console.error('Error fetching low stock items:', error)
      throw new Error('Failed to fetch low stock items')
    }
  },
  ['low-stock-items'],
  { revalidate: 300 } // 5 minutes
)

// Action to manually refresh dashboard data
export async function refreshDashboardData() {
  try {
    // This would trigger revalidation of cached data
    // In Next.js 14+, you can use revalidateTag or revalidatePath
    console.log('Dashboard data refresh requested')
    return { success: true }
  } catch (error) {
    console.error('Error refreshing dashboard data:', error)
    return { success: false, error: 'Failed to refresh data' }
  }
}