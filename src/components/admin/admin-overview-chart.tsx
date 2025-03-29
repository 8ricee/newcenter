"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "T1",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T2",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T3",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T4",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T5",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T6",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T7",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T8",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T9",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T10",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T11",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "T12",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export function AdminOverviewChart() {
  const { theme } = useTheme()

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            borderRadius: "0.375rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
          formatter={(value) => [`${value.toLocaleString("vi-VN")} đ`, "Doanh thu"]}
          labelFormatter={(label) => `Tháng ${label}`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

