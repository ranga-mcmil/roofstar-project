"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "IBR 0.47mm",
    sales: 15552,
    units: 432,
  },
  {
    name: "IBR 0.53mm",
    sales: 12915,
    units: 287,
  },
  {
    name: "IBR 0.58mm",
    sales: 9900,
    units: 198,
  },
  {
    name: "Ridge Caps",
    sales: 4500,
    units: 300,
  },
  {
    name: "Flashing",
    sales: 3600,
    units: 300,
  },
  {
    name: "Fasteners",
    sales: 2500,
    units: 100,
  },
]

export function ProductPerformanceChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
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
        <Bar yAxisId="left" dataKey="sales" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={30} name="Sales ($)" />
        <Bar yAxisId="right" dataKey="units" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} name="Units Sold" />
      </BarChart>
    </ResponsiveContainer>
  )
}
