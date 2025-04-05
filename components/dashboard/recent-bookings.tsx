"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, Check, Clock, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const bookings = [
  {
    id: "B-1234",
    client: "Sarah Johnson",
    email: "sarah@example.com",
    date: "May 28, 2025",
    time: "10:00 AM",
    type: "Wedding",
    status: "confirmed",
    amount: "$1,200",
  },
  {
    id: "B-1235",
    client: "Michael Chen",
    email: "michael@example.com",
    date: "May 30, 2025",
    time: "2:00 PM",
    type: "Corporate",
    status: "pending",
    amount: "$800",
  },
  {
    id: "B-1236",
    client: "Emily Rodriguez",
    email: "emily@example.com",
    date: "June 5, 2025",
    time: "11:30 AM",
    type: "Family",
    status: "confirmed",
    amount: "$350",
  },
  {
    id: "B-1237",
    client: "David Thompson",
    email: "david@example.com",
    date: "June 10, 2025",
    time: "4:00 PM",
    type: "Portrait",
    status: "confirmed",
    amount: "$250",
  },
  {
    id: "B-1238",
    client: "Jessica Williams",
    email: "jessica@example.com",
    date: "June 15, 2025",
    time: "1:00 PM",
    type: "Wedding",
    status: "pending",
    amount: "$1,500",
  },
]

export function RecentBookings() {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])

  const toggleBooking = (id: string) => {
    setSelectedBookings((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setSelectedBookings((prev) => (prev.length === bookings.length ? [] : bookings.map((booking) => booking.id)))
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedBookings.length === bookings.length}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-[100px]">
              <div className="flex items-center space-x-2">
                <span>ID</span>
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <Checkbox
                  checked={selectedBookings.includes(booking.id)}
                  onCheckedChange={() => toggleBooking(booking.id)}
                  aria-label={`Select booking ${booking.id}`}
                />
              </TableCell>
              <TableCell className="font-medium">{booking.id}</TableCell>
              <TableCell>
                <div>
                  <p>{booking.client}</p>
                  <p className="text-xs text-muted-foreground">{booking.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.date}</span>
                  <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                  <span>{booking.time}</span>
                </div>
              </TableCell>
              <TableCell>{booking.type}</TableCell>
              <TableCell>
                <Badge
                  variant={booking.status === "confirmed" ? "default" : "outline"}
                  className={booking.status === "confirmed" ? "bg-green-500" : ""}
                >
                  {booking.status === "confirmed" ? (
                    <Check className="mr-1 h-3 w-3" />
                  ) : (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{booking.amount}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Send reminder</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Cancel booking</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

