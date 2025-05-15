"use client"

import { useTheme } from "next-themes"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "IBR 0.47mm", value: 4776 },
  { name: "IBR 0.53mm", value: 4671 },
  { name: "IBR 0.58mm", value: 3510 },
  { name: "Ridge Caps", value: 675 },
  { name: "Flashing", value: 360 },
  { name: "Fasteners", value: 1250 },
]

const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7"]

export function InventoryValueChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${value}`, "Value"]}
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            borderRadius: "6px",
            color: isDark ? "#fff" : "#000",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
