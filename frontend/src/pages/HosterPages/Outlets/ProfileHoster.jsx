import { Settings, MessageSquare, Package, Pen, Plus, Settings2, TriangleAlert, CircleOff } from 'lucide-react'
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
import HosterProfileUploadCloudinary from '@/Page_components/CloudinaryComponents/HosterProfileUploadCloudinary'
import AdminProfileShimmer from '@/components/Shimmer/AdminProfile'

const schema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  fullname: z.string().min(1, { message: 'Fullname is required' }),
  phone_number: z.string().min(10, { message: 'Phone number is required' }),
  email: z.string().min(1, { message: 'Email is required' }),
})

const selectPasswordSchema = (data) => {
  if (data) {
    const schemaNotPassword = z.object({
      new_password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
      confirm_password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    })
      .refine((data) => data.new_password === data.confirm_password, {
        message: "Passwords must match",
        path: ["confirm_password"], // Show error on the confirm_password field
      });

    const schemaHasPassword = z.object({
      current_password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
      new_password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
      confirm_password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    })
      .refine((data) => data.new_password === data.confirm_password, {
        message: "Passwords must match",
        path: ["confirm_password"], // Show error on the confirm_password field
      });

    const selectSchema = data.has_password ? schemaHasPassword : schemaNotPassword
    return selectSchema
  }
}

function ProfileHoster() {
  const { data, loading, error, refreshData } = useContext(ProfileDataContext)
  const { register: updateHosterProfileForm, setValue, handleSubmit, formState: { errors, isSubmitting }, clearErrors, reset } = useForm({
    resolver: zodResolver(schema)
  })

  const { register: updateHosterPasswordForm, setValue: setValuePassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword }, clearErrors: clearErrorsPassword, reset: resetPassword } = useForm({
    resolver: zodResolver(selectPasswordSchema(data))
  })

  const state = store.getState()
  const user_id = state.id
  let updateData = false
  const [profilePublicId, setProfilePublicId] = useState();


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

  if (loading) return <AdminProfileShimmer/>;
  if (error) return <p>Error loading data</p>;

  const onSubmit = async (data) => {
    console.log(data)

    await toast.promise(
      axiosInstance.patch(`/user/${user_id}/update_user_profile/`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      {
        loading: 'Profile updating',
        success: (response) => {
          // Fetch updated event details after success
          console.log('response datat', response.data)
          reset();
          refreshData();
          return 'Profile updated successfully';
        },
        error: (error) => {
          console.log('Event creation failed:', error)
          return error.response?.data?.error ? error.response?.data?.error : 'Profile updation failed'
        },
      }
    );
  }

  const onSubmitPassword = async (data) => {
    console.log(data)

    await toast.promise(
      axiosInstance.post(`/user/${user_id}/set_password/`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      {
        loading: 'Password updating',
        success: (response) => {
          // Fetch updated event details after success
          console.log(response.data)
          resetPassword();
          refreshData();
          return 'Password updated successfully';
        },
        error: (error) => {
          console.log('Event creation failed:', error)
          return error.response?.data?.error ? error.response?.data?.error : 'Password updation failed'
        },
      }
    );
  }



  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className='flex flex-col justify-center items-center gap-2' >
              <Avatar className="h-28 w-28">
                <AvatarImage src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1732028654/${data.profile_picture}.png`} />
                <AvatarFallback>{data.fullname}</AvatarFallback>
              </Avatar>
              {/* <Button className='border-2 bg-stone-900 text-white hover:bg-stone-800 '>Upload profile</Button> */}
              <HosterProfileUploadCloudinary publicId={profilePublicId} setPublicId={setProfilePublicId} refreshData={refreshData} />
            </div>
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
                        {...updateHosterProfileForm("username")}
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
                        {...updateHosterProfileForm("fullname")}
                      />
                      {errors.fullname && (
                        <div className='text-red-500'>{errors.fullname.message}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone number</label>
                      <Input
                        placeholder="Enter phone number"
                        {...updateHosterProfileForm("phone_number")}
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
                        {...updateHosterProfileForm("email")}
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
              <div className='flex items-center gap-2'>
                <span className="font-semibold">User Name: </span>
                <span className="text-gray-600">{data.username ? data.username :
                  <div className='flex items-center'>
                    <CircleOff className="mr-2 h-4 w-4 text-red-500" />
                    Please update
                  </div>
                }</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className="font-semibold">Full Name: </span>
                <span className="text-gray-600">{data.fullname}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className="font-semibold">Phone number: </span>
                <span className="text-gray-600">{data.phone_number ? data.phone_number :
                  <div className='flex items-center'>
                    <CircleOff className="mr-2 h-4 w-4 text-red-500" />
                    Please update
                  </div>
                }</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className="font-semibold">Email: </span>
                <span className="text-gray-600">{data.email}</span>
              </div>

              {data.has_password ?
                (<Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4 " />
                      Change password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Current Password</label>
                          <Input
                            placeholder="Enter current password"
                            {...updateHosterPasswordForm("current_password")}
                          />
                          {errorsPassword.current_password && (
                            <div className='text-red-500'>{errorsPassword.current_password.message}</div>
                          )
                          }
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">New Password</label>
                          <Input
                            placeholder="Enter new password"
                            {...updateHosterPasswordForm("new_password")}
                          />
                          {errorsPassword.new_password && (
                            <div className='text-red-500'>{errorsPassword.new_password.message}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Confirm Password</label>
                          <Input
                            placeholder="Re-enter new password" type="password"
                            {...updateHosterPasswordForm("confirm_password")}
                          />
                          {errorsPassword.confirm_password && (
                            <div className='text-red-500'>{errorsPassword.confirm_password.message}</div>
                          )
                          }
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSubmittingPassword} >
                            {isSubmittingPassword ? "Updating password" : "Update password"}
                          </Button>
                          {errorsPassword.root && (
                            <div className='text-red-500'>{errorsPassword.root.message}</div>
                          )}
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>)
                :
                (<Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <TriangleAlert className="mr-2 h-6 w-6 text-red-500" />
                      Set password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">New Password</label>
                          <Input
                            placeholder="Enter new password"
                            {...updateHosterPasswordForm("new_password")}
                          />
                          {errorsPassword.new_password && (
                            <div className='text-red-500'>{errorsPassword.new_password.message}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Confirm Password</label>
                          <Input
                            placeholder="Re-enter new password" type="password"
                            {...updateHosterPasswordForm("confirm_password")}
                          />
                          {errorsPassword.confirm_password && (
                            <div className='text-red-500'>{errorsPassword.confirm_password.message}</div>
                          )
                          }
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSubmittingPassword} >
                            {isSubmittingPassword ? "Creating password" : "Create password"}
                          </Button>
                          {errorsPassword.root && (
                            <div className='text-red-500'>{errorsPassword.root.message}</div>
                          )}
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>)
              }
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
