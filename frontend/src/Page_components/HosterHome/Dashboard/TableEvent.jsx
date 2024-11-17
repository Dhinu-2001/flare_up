import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
  
const events = [
    {
      id: "INV001",
      title: "DevOPs",
      date_time: "10-03-2024",
      status: "Pending",
      total_registration: "25",
    },
    {
      id: "INV001",
      title: "Python meetup",
      date_time: "10-03-2024",
      status: "Pending",
      total_registration: "25",
    },
    {
      id: "INV001",
      title: "AI workshop",
      date_time: "10-03-2024",
      status: "Pending",
      total_registration: "25",
    },
    {
      id: "INV001",
      title: "UXUI",
      date_time: "10-03-2024",
      status: "Pending",
      total_registration: "25",
    },
]

function TableEvent() {

  return (
    
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Event ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total registration</TableHead>
          <TableHead className="text-right">View</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event,index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{event.id}</TableCell>
            <TableCell>{event.title}</TableCell>
            <TableCell>{event.date_time}</TableCell>
            <TableCell>{event.status}</TableCell>
            <TableCell>{event.total_registration}</TableCell>
            <TableCell className="text-right">
              <Button>View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableEvent
