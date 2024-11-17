'use client'

import { Settings, MessageSquare, Package, Pen, Plus, Settings2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ProfileDataContext } from "@/ContextFiles/ProfileDataProvider"
import { useContext, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import axiosInstance from '@/axiosconfig'
import { store } from "../../../redux/Store";
import React from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

const schema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  fullname: z.string().min(1, { message: 'Fullname is required' }),
  phone_number: z.string().min(1, { message: 'Phone number is required' }),
  email: z.string().min(1, { message: 'Email is required' }),
})

function ProfileHoster() {
  const { data, loading, error, refreshData } = useContext(ProfileDataContext)
  const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, clearErrors, reset } = useForm({
    resolver: zodResolver(schema)
  })
  const state = store.getState()
  const user_id = state.id
  let updateData = false

  function setUpdateData() {
    console.log('setupdate triggered')
    updateData = !updateData
  }

  // Populate form fields with userDetails when the component mounts
  useEffect(() => {
    if (data) {
      setValue("username", data.username || "");
      setValue("fullname", data.fullname || "");
      setValue("phone_number", data.phone_number || "");
      setValue("email", data.email || "");
    }
  }, [data, setValue, updateData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const onSubmit = async (data) => {
    console.log(data)
    try {
      const response = await axiosInstance.patch(`/user/${user_id}/update_user_profile/`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log(response.data)
      reset();
      toast.success('Profile updated successfully')

      await refreshData();
    } catch (error) {
      console.log('Event creation failed:', error)
      toast.error('Profile updation failed')
    } finally {

    }
  }

  // const HandlePassword =()=>{
    
  // }

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{data.fullname}</h2>
              <p className="text-gray-500">{data.username}</p>
            </div>
            <div className="ml-auto flex gap-2">
              {/* <Button variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    App
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button> */}


              {/* <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Platform Settings */}
        {/* <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">ACCOUNT</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Email me when someone follows me</div>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Email me when someone answers on my post</div>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Email me when someone mentions me</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

        {/* Profile Information */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>

            <Dialog>
              <DialogTrigger onClick={() => setUpdateData()} asChild>
                <Button className='border-2 border-white' variant="ghost" size="icon">
                  <Pen className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">User Name</label>
                      <Input
                        placeholder="Enter user name"
                        {...register("username")}
                      />
                      {errors.username && (
                        <div className='text-red-500'>{errors.username.message}</div>
                      )
                      }
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full name</label>
                      <Input
                        placeholder="Enter full name"
                        {...register("fullname")}
                      />
                      {errors.fullname && (
                        <div className='text-red-500'>{errors.fullname.message}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone number</label>
                      <Input
                        placeholder="Enter phone number"
                        {...register("phone_number")}
                      />
                      {errors.phone_number && (
                        <div className='text-red-500'>{errors.phone_number.message}</div>
                      )
                      }
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        placeholder="Enter emailId"
                        {...register("email")}
                      />
                      {errors.email && (
                        <div className='text-red-500'>{errors.email.message}</div>
                      )
                      }
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting} >
                        {isSubmitting ? "Updating profile" : "Update profile"}
                      </Button>
                      {errors.root && (
                        <div className='text-red-500'>{errors.root.message}</div>
                      )}
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">User Name: </span>
                <span className="text-gray-600">{data.username ? data.username : 'Please update'}</span>
              </div>
              <div>
                <span className="font-semibold">Full Name: </span>
                <span className="text-gray-600">{data.fullname}</span>
              </div>
              <div>
                <span className="font-semibold">Phone number: </span>
                <span className="text-gray-600">{data.phone_number ? data.phone_number : 'Please update'}</span>
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                <span className="text-gray-600">{data.email}</span>
              </div>
              {/* <Button onClick={HandlePassword} variant="outline">
                <Settings className="mr-2 h-4 w-4 " />
                {data.password ? 'Change password' : 'Set password'}
              </Button> */}
            </div>
          </CardContent>
        </Card>

        {/* Organization Information */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Organization Information</CardTitle>
            <Link to='/hoster/organization/update_organization/'>
              <Button className='border-2 border-white' variant="ghost" size="icon">
                <Pen className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).
            </p>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Full Name: </span>
                <span className="text-gray-600">Alec M. Thompson</span>
              </div>
              <div>
                <span className="font-semibold">Mobile: </span>
                <span className="text-gray-600">(44) 123 1234 123</span>
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                <span className="text-gray-600">alecthompson@mail.com</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversations */}
        {/* <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Sophie B.', 'Anne Marie', 'Ivanna', 'Peterson'].map((name) => (
                <div key={name} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{name}</h4>
                    <p className="text-sm text-gray-500">Hi! I need more information...</p>
                  </div>
                  <Button size="sm" variant="outline">Reply</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default ProfileHoster