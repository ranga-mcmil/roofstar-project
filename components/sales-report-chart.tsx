"use client"

import { useTheme } from "next-themes"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    sales: 4000,
    orders: 24,
  },
  {
    name: "Feb",
    sales: 3000,
    orders: 18,
  },
  {
    name: "Mar",
    sales: 2000,
    orders: 12,
  },
  {
    name: "Apr",
    sales: 2780,
    orders: 19,
  },
  {
    name: "May",
    sales: 1890,
    orders: 14,
  },
  {
    name: "Jun",
    sales: 2390,
    orders: 15,
  },
  {
    name: "Jul",
    sales: 3490,
    orders: 21,
  },
  {
    name: "Aug",
    sales: 4000,
    orders: 25,
  },
  {
    name: "Sep",
    sales: 5000,
    orders: 30,
  },
  {
    name: "Oct",
    sales: 4500,
    orders: 28,
  },
  {
    name: "Nov",
    sales: 5500,
    orders: 32,
  },
  {
    name: "Dec",
    sales: 6000,
    orders: 35,
  },
]

export function SalesReportChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis dataKey="name" stroke={isDark ? "#888" : "#888"} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          yAxisId="left"
          stroke={isDark ? "#888" : "#888"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke={isDark ? "#888" : "#888"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            borderRadius: "6px",
            color: isDark ? "#fff" : "#000",
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="sales"
          stroke="#16a34a"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Sales ($)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="orders"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Orders"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
