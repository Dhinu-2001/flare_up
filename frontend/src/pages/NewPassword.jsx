import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react";
import axiosInstance from "@/axiosconfig"
import { useDispatch } from "react-redux"
import { setAuthData, setLoading, setError } from "@/redux/auth/authSlice"
import { useNavigate, Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { encryptToken } from "@/utils/tokenUtil"
import { toast } from "sonner"

const schema = z.object({
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
});

export default function NewPassword() {

    const navigate = useNavigate()
    const { register, handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors } = useForm({
        resolver: zodResolver(schema),
    });
    const dispatch = useDispatch()

    const onSubmit = async (data) => {
        const email = localStorage.getItem('registeredEmail');
        data.email = email
        
        console.log(data.new_password, data.confirm_password, data.email)
        try {
            dispatch(setLoading(true))
            await axiosInstance.post('/set-new-password/', data);

            navigate('/login')
            toast.success('New password successfully updated.')


        } catch (error) {
            const errorMessage = error.response?.data?.error || 'New password updation failed'
            toast.error(errorMessage)
        } finally {
            dispatch(setLoading(false))
        }
    }

    // Auto-clear errors after 5 seconds
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const timer = setTimeout(() => {
                clearErrors();
            }, 2000);
            return () => clearTimeout(timer);  // Cleanup timeout on component unmount or re-render
        }
    }, [errors, clearErrors]);

    return (
        <div className="flex flex-col min-h-[100dvh]">
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <Card className="mx-auto max-w-md">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardHeader>
                                <CardTitle>Forgot Password</CardTitle>
                                {/* <CardDescription>Log in to start exploring and attending the best event.</CardDescription> */}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Enter new password</Label>
                                    <Input {...register("new_password")} id="new_password" placeholder="Enter your new password" autoComplete="username" />
                                    {errors.new_password && (
                                        <div className="text-red-500">{errors.new_password.message}</div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Confirm new password</Label>
                                    <Input {...register("confirm_password")} id="confirm_password" type="password" placeholder="Re-enter new password" autoComplete="current-password" />
                                    {errors.confirm_password && (
                                        <div className="text-red-500">{errors.confirm_password.message}</div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={isSubmitting} type="submit" className="w-full">
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                                {errors.root && (
                                    <div className="text-red-500">{errors.root.message}</div>
                                )}

                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </section>
        </div>
    )
}

