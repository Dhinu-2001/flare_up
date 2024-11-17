'use client'

import { useState, useEffect } from 'react'
import { Package, Home, CreditCard, Languages, LogIn, UserPlus, Search, Bell, Settings, ArrowLeft, Plus, Pencil, Trash2, BarChart2, ShoppingBag, Calendar, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useParams } from 'react-router-dom'
import axiosInstance from '@/axiosconfig'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().min(1, { message: 'Description is required' })
})

export default function CategoryDetails() {
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, clearErrors, reset } = useForm({
        resolver: zodResolver(schema)
    })
    const { category_name } = useParams();
    const [cateData, setCateData] = useState(null)

    if(!category_name) return <p>Error no category.</p>

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const response = await axiosInstance.get(`/events/category/${category_name}/`)

                console.log(response)
                setCateData(response.data[0])
            } catch (error) {
                console.log(error)
            }
        }
        fetchCategoryDetails()
    }, [])

    const [category] = useState({
        id: 1,
        name: 'Electronics',
        description: 'All electronic devices and accessories',
        status: 'active',
        types: [' b', 'Laptops', 'Accessories', 'Smart Home', 'Audio'],
        itemCount: 245,
        lastUpdated: '2024-01-15',
        createdAt: '2023-01-01',
        salesData: {
            total: 1250000,
            growth: 15,
        },
        topItems: [
            { id: 1, name: 'iPhone 13 Pro', sales: 500, stock: 50 },
            { id: 2, name: 'MacBook Air M1', sales: 300, stock: 30 },
            { id: 3, name: 'AirPods Pro', sales: 1000, stock: 100 },
            { id: 4, name: 'Samsung Galaxy S21', sales: 400, stock: 40 },
            { id: 5, name: 'iPad Air', sales: 250, stock: 25 },
        ],
        recentOrders: [
            { id: 'ORD001', customer: 'John Doe', date: '2024-01-15', total: 1299 },
            { id: 'ORD002', customer: 'Jane Smith', date: '2024-01-14', total: 799 },
            { id: 'ORD003', customer: 'Bob Johnson', date: '2024-01-13', total: 249 },
        ],
    })

    if (!cateData) return <p>Loading...</p>;
    if (!cateData) return <p>Error loading data</p>;

    const onSubmit = async (data) => {
        data.category = cateData.id
        console.log(data)
        try {
            const response = await axiosInstance.post('/events/type/', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            console.log(response.data)
            reset();
        } catch (error) {
            console.log('Event creation failed:', error)
        } finally {

        }
    }

    return (
        <main className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-1">{cateData.name}</h1>
                    <p className="text-gray-500">{cateData.description}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Category
                    </Button>
                    <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Category
                    </Button>
                </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${category.salesData.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +{category.salesData.growth}% from last month
                        </p>
                        <Progress value={category.salesData.growth} className="mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{category.itemCount}</div>
                        <p className="text-xs text-muted-foreground">
                            In {category.types.length} different types
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{category.lastUpdated}</div>
                        <p className="text-xs text-muted-foreground">
                            Created on {category.createdAt}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{category.status}</div>
                        <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                            {category.status}
                        </Badge>
                    </CardContent>
                </Card>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex" >
                        <div className='mb-2'>
                            <CardTitle>Types</CardTitle>
                            <CardDescription>Types of items in this category</CardDescription>
                        </div>
                        <div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Type
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Type</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Type Name</label>
                                                <Input
                                                    placeholder="Enter type name"
                                                    {...register("name")}
                                                />
                                                {errors.name && (
                                                    <div className='text-red-500'>{errors.name.message}</div>
                                                )
                                                }
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Type description</label>
                                                <Textarea
                                                    placeholder="Enter type description"
                                                    {...register("description")}
                                                />
                                                {errors.description && (
                                                    <div className='text-red-500'>{errors.description.message}</div>
                                                )}
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={isSubmitting} >
                                                    {isSubmitting ? "Creating new type" : "Add new type"}
                                                </Button>
                                                {errors.root && (
                                                    <div className='text-red-500'>{errors.root.message}</div>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {cateData.event_types.map((type) => (
                                <Badge key={type} variant="outline">
                                    {type.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Items</CardTitle>
                        <CardDescription>Best performing products in this category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Sales</TableHead>
                                    <TableHead>Stock</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {category.topItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.sales}</TableCell>
                                        <TableCell>{item.stock}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card> */}

                {/* <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest transactions in this category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {category.recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${order.customer}`} />
                                                    <AvatarFallback>{order.customer[0]}</AvatarFallback>
                                                </Avatar>
                                                {order.customer}
                                            </div>
                                        </TableCell>
                                        <TableCell>{order.date}</TableCell>
                                        <TableCell>${order.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card> */}
            </div>
        </main>
    )
}