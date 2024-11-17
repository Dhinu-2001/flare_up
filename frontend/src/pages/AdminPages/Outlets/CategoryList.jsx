'use client'

import { useState, useEffect, useContext } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { DataContext } from '@/ContextFiles/DataProvider'
import axiosInstance from '@/axiosconfig'
import { Link } from 'react-router-dom'

const schema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().min(1, { message: 'Description is required' })
})

export default function CategoryList() {
    const { data, loading, error } = useContext(DataContext)
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, clearErrors, reset } = useForm({
        resolver: zodResolver(schema)
    })

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    console.log('category and types', data)

    // useEffect(() => {
    //     if (Object.keys(errors).length > 0) {
    //         const timer = setTimeout(() => {
    //             clearErrors();
    //         }, 2000);
    //         return () => clearTimeout(timer);  // Cleanup timeout on component unmount or re-render
    //     }
    // }, [errors, clearErrors]);

    const onSubmit = async (data) => {
        const { name, description } = data
        console.log(name, description)
        try {
            const response = await axiosInstance.post('/events/create_category/', data, {
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
        <>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Categories & Types</h1>
                    <p className="text-gray-500">Manage your website categories and their associated types</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category Name</label>
                                    <Input
                                        placeholder="Enter category name"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <div className='text-red-500'>{errors.name.message}</div>
                                    )
                                    }
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category description</label>
                                    <Textarea
                                        placeholder="Enter category description"
                                        {...register("description")}
                                    />
                                    {errors.description && (
                                        <div className='text-red-500'>{errors.description.message}</div>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isSubmitting} >
                                        {isSubmitting ? "Creating new category" : "Add Category"}
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

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="font-semibold">{category.name}</h3>
                                        <Badge variant={category.status === 'Active' ? 'default' : 'secondary'}>
                                            {category.status}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {category.event_types.map((type) => (
                                            <Badge key={type} variant="outline">
                                                {type.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Last updated {` ${new Date((category.updated_at)).getFullYear()}-${(new Date((category.updated_at)).getMonth() + 1).toString().padStart(2, "0")}-${new Date((category.updated_at)).getDate().toString().padStart(2, "0")}`}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link to={`/admin/catgory/${category.name}`}>
                                        <Button variant="outline" size="icon">
                                            {/* <Pencil className="h-4 w-4" />  */}
                                            View
                                        </Button>
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}