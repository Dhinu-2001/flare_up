"use client";
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// import { ColumnDef } from "@tanstack/react-table";

// Define the data structure for each payment entry
export const PaymentColumns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Event Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "category",
        header: "User",
    },
    {
        accessorKey: "created_at",
        header: "Paid At",
    },

    {
        accessorKey: "approval_status",
        header: "Transaction ID",
    },
    {
        accessorKey: "approval_status",
        header: "Approval Status",
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const event = row.original
            const navigate = useNavigate();

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
                        <DropdownMenuItem
                            onClick={() => navigate(`/hoster/events/event/${event.id}`)}>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];


// {
//   accessorKey: "amount",
//   header: () => <div className="text-right">Amount</div>,
//   cell: ({ row }) => {
//     const amount = parseFloat(row.getValue("amount"))
//     const formatted = new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "INR",
//     }).format(amount)

//     return <div className="text-right font-medium">{formatted}</div>
//   },
// },