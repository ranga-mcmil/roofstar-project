"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 4000,
  },
  {
    name: "Feb",
    total: 3000,
  },
  {
    name: "Mar",
    total: 2000,
  },
  {
    name: "Apr",
    total: 2780,
  },
  {
    name: "May",
    total: 1890,
  },
  {
    name: "Jun",
    total: 2390,
  },
  {
    name: "Jul",
    total: 3490,
  },
  {
    name: "Aug",
    total: 4000,
  },
  {
    name: "Sep",
    total: 5000,
  },
  {
    name: "Oct",
    total: 4500,
  },
  {
    name: "Nov",
    total: 5500,
  },
  {
    name: "Dec",
    total: 6000,
  },
]

export function DashboardChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis dataKey="name" stroke={isDark ? "#888" : "#888"} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={isDark ? "#888" : "#888"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            borderRadius: "6px",
            color: isDark ? "#fff" : "#000",
          }}
          formatter={(value) => [`$${value}`, "Revenue"]}
        />
        <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  )
}
