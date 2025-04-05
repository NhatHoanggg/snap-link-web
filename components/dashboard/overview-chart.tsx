"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    bookings: 12,
    revenue: 2400,
  },
  {
    name: "Feb",
    bookings: 15,
    revenue: 3000,
  },
  {
    name: "Mar",
    bookings: 18,
    revenue: 3600,
  },
  {
    name: "Apr",
    bookings: 22,
    revenue: 4400,
  },
  {
    name: "May",
    bookings: 28,
    revenue: 5600,
  },
  {
    name: "Jun",
    bookings: 25,
    revenue: 5000,
  },
  {
    name: "Jul",
    bookings: 30,
    revenue: 6000,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "revenue") return [`$${value}`, "Revenue"]
            return [value, "Bookings"]
          }}
        />
        <Legend />
        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue" />
        <Bar dataKey="bookings" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} name="Bookings" />
      </BarChart>
    </ResponsiveContainer>
  )
}

